import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';

import flowbiteReact from "flowbite-react/plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        allowedHosts: ['bc3e40f675c9.ngrok-free.app'],
        proxy: {
            '/api': {
                target: process.env.VITE_BACKEND_URL || 'http://localhost:5055',
                changeOrigin: true,
                secure: false,
            },
            '/ingest': {
                target: process.env.VITE_INGEST_URL || 'http://localhost:5056',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    resolve: {
        alias: {
            src: resolve(__dirname, 'src'),
            // Allow importing shared components from packages/main
            main: resolve(__dirname, '../main/src'),
        },
    },
    esbuild: {
        loader: 'tsx',
        include: /src\/.*\.tsx?$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                {
                    name: 'load-js-files-as-tsx',
                    setup(build) {
                        build.onLoad(
                            { filter: /src\\.*\.js$/ },
                            async (args) => ({
                                loader: 'tsx',
                                contents: await fs.readFile(args.path, 'utf8'),
                            })
                        );
                    },
                },
            ],
        },
    },


    
    // plugins: [react(),svgr({
    //   exportAsDefault: true
    // })],

    plugins: [ react(), flowbiteReact()],
});