#!/bin/bash

# Startup script for timetable app deployment
set -e

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y curl wget git nginx nodejs npm python3 python3-pip python3-venv certbot python3-certbot-nginx ufw

# Install PM2 globally
npm install -g pm2

# Create application user
useradd -m -s /bin/bash timetable || true

# Create application directory
mkdir -p /opt/timetable-app
chown timetable:timetable /opt/timetable-app

# Download and extract application
cd /tmp
gsutil cp gs://BUCKET_NAME/timetable-app.tar.gz .
tar -xzf timetable-app.tar.gz -C /opt/timetable-app/
chown -R timetable:timetable /opt/timetable-app

# Install dependencies
cd /opt/timetable-app/server
sudo -u timetable npm install

cd /opt/timetable-app/spike-react-tailwind/ingest-server
sudo -u timetable npm install

cd /opt/timetable-app/spike-react-tailwind/packages/starterkit
sudo -u timetable npm install
sudo -u timetable npm run build

# Create environment files
cat > /opt/timetable-app/server/.env << 'ENVEOF'
NODE_ENV=production
PORT=5055
SUPABASE_URL=https://ketlvbjlukqcolfkwyge.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldGx2YmpsdWtxY29sZmt3eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjEwMTksImV4cCI6MjA3MjkzNzAxOX0.Lro-UME31Wcn-Y6RegmadZqPPJk9MzlQuDYO8Uf0tyw
ENVEOF

cat > /opt/timetable-app/spike-react-tailwind/ingest-server/.env << 'ENVEOF'
NODE_ENV=production
PORT=5056
GEMINI_API_KEY=your_gemini_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
PYTHON_BIN=python3
ENVEOF

cat > /opt/timetable-app/spike-react-tailwind/packages/starterkit/.env.production << 'ENVEOF'
VITE_SUPABASE_URL=https://ketlvbjlukqcolfkwyge.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldGx2YmpsdWtxY29sZmt3eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjEwMTksImV4cCI6MjA3MjkzNzAxOX0.Lro-UME31Wcn-Y6RegmadZqPPJk9MzlQuDYO8Uf0tyw
VITE_BACKEND_URL=http://localhost:5055
VITE_INGEST_URL=http://localhost:5056
ENVEOF

chown -R timetable:timetable /opt/timetable-app

# Setup PM2
cat > /opt/timetable-app/ecosystem.config.js << 'PM2EOF'
module.exports = {
  apps: [
    {
      name: 'timetable-backend',
      script: 'server.js',
      cwd: '/opt/timetable-app/server',
      user: 'timetable',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5055
      },
      error_file: '/var/log/pm2/timetable-backend-error.log',
      out_file: '/var/log/pm2/timetable-backend-out.log',
      log_file: '/var/log/pm2/timetable-backend.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'timetable-ingest',
      script: 'server.js',
      cwd: '/opt/timetable-app/spike-react-tailwind/ingest-server',
      user: 'timetable',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5056
      },
      error_file: '/var/log/pm2/timetable-ingest-error.log',
      out_file: '/var/log/pm2/timetable-ingest-out.log',
      log_file: '/var/log/pm2/timetable-ingest.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
PM2EOF

# Create log directory
mkdir -p /var/log/pm2
chown timetable:timetable /var/log/pm2

# Setup systemd service
cat > /etc/systemd/system/pm2-timetable.service << 'SYSTEMDEF'
[Unit]
Description=PM2 process manager for timetable app
Documentation=https://pm2.keymetrics.io/
After=network.target

[Service]
Type=notify
User=timetable
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/bin:/usr/local/bin
Environment=PM2_HOME=/home/timetable/.pm2
ExecStart=/usr/local/bin/pm2-runtime start /opt/timetable-app/ecosystem.config.js
ExecReload=/usr/local/bin/pm2 reload all
ExecStop=/usr/local/bin/pm2 kill

[Install]
WantedBy=multi-user.target
SYSTEMDEF

# Setup Nginx
cat > /etc/nginx/sites-available/timetable-app << 'NGINXEOF'
upstream backend {
    server 127.0.0.1:5055;
}

upstream ingest {
    server 127.0.0.1:5056;
}

limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=upload:10m rate=2r/s;

server {
    listen 80;
    server_name _;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    location / {
        root /opt/timetable-app/spike-react-tailwind/packages/starterkit/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    location /ingest/ {
        limit_req zone=upload burst=5 nodelay;
        
        proxy_pass http://ingest/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        client_max_body_size 50M;
    }
    
    location /health {
        proxy_pass http://backend/health;
        access_log off;
    }
    
    location /ingest-health {
        proxy_pass http://ingest/health;
        access_log off;
    }
    
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ \.(env|log|sql)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINXEOF

# Enable site
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/timetable-app /etc/nginx/sites-enabled/timetable-app

# Test and start nginx
nginx -t && systemctl restart nginx && systemctl enable nginx

# Enable and start PM2 service
systemctl daemon-reload
systemctl enable pm2-timetable.service
systemctl start pm2-timetable.service

# Configure firewall
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

# Cleanup
rm -f /tmp/timetable-app.tar.gz

echo "Deployment completed successfully!"
