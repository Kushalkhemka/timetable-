const express = require('express');
const cors = require('cors');
const { ApifyClient } = require('apify-client');

// Load local env if present (safe: .env is gitignored)
try {
    // eslint-disable-next-line global-require
    require('dotenv').config();
} catch (_) {
    // dotenv is optional; env vars can still be provided by the shell
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
    console.error('Missing APIFY_TOKEN. Set it in your shell or in a local .env file.');
    process.exit(1);
}

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: APIFY_TOKEN,
});

// Internship search endpoint
app.post('/api/internships/search', async (req, res) => {
    try {
        const {
            max_results = 30,
            job_category = 'Software Development',
            work_from_home = true,
            location = 'Delhi',
            part_time = false,
            stipend = '',
            pages_to_scrape = 20
        } = req.body;

        // Prepare Actor input
        const input = {
            max_results,
            job_category,
            work_from_home,
            location,
            part_time,
            stipend,
            pages_to_scrape
        };

        console.log('Running Apify actor with input:', input);

        // Run the Actor and wait for it to finish
        const run = await client.actor("HfFlw87KoIcibIX7U").call(input);

        console.log('Actor run completed:', run.id);

        // Fetch Actor results from the run's dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        
        console.log(`Retrieved ${items.length} internship results`);

        // Transform the data to match our database schema
        const internships = items.map((item, index) => ({
            id: `apify_${run.id}_${index}`,
            title: item.title || item.jobTitle || 'N/A',
            company: item.company || item.companyName || 'N/A',
            location: item.location || location,
            job_category: item.category || job_category,
            work_from_home: item.remote || work_from_home,
            part_time: item.partTime || part_time,
            stipend: item.stipend || item.salary || stipend,
            description: item.description || item.jobDescription || '',
            requirements: item.requirements || item.qualifications || '',
            benefits: item.benefits || item.perks || '',
            application_url: item.url || item.applyUrl || item.link || '',
            posted_date: item.postedDate || item.datePosted || new Date().toISOString(),
            expiry_date: item.expiryDate || item.deadline || null,
            raw_data: item // Store original data for debugging
        }));

        res.json({
            success: true,
            internships,
            total_results: internships.length,
            run_id: run.id
        });

    } catch (error) {
        console.error('Error running Apify actor:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch internships',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Internship API server is running' });
});

app.listen(PORT, () => {
    console.log(`Internship API server running on port ${PORT}`);
});






