// set_admin_role.js
// Sets a specific user as admin by email
// Requires SUPABASE_SERVICE_ROLE_KEY in env

const { createClient } = require('@supabase/supabase-js');

// You can get these from your Supabase project settings
const SUPABASE_URL = 'https://ketlvbjlukqcolfkwyge.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function setUserAsAdmin(email) {
  if (!SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    console.log('Get this from your Supabase project settings > API > service_role key');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    // First, find the user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);
    console.log(`Current role: ${user.user_metadata?.role || 'none'}`);

    // Update user metadata to set role as admin
    const newMetadata = { 
      ...(user.user_metadata || {}), 
      role: 'admin' 
    };

    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: newMetadata
    });

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ Successfully set ${email} as admin!`);
    console.log('Please refresh your browser or log out and log back in to see the changes.');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log('Usage: node set_admin_role.js <email>');
  console.log('Example: node set_admin_role.js admin@example.com');
  process.exit(1);
}

setUserAsAdmin(email);




