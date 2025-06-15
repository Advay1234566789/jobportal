const express = require('express');
const axios = require('axios');
const router = express.Router();

const APP_ID = '7c0167e5';
const APP_KEY = '1976c5924bce0db5ef3eabc80d5b8a7c';

router.get('/search', async (req, res) => {
  try {
    const { time, type } = req.query;

    // Construct URL with Adzuna API parameters
    let url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10`;

    // Add time (contract type) filter if provided
    if (time) {
      url += `&contract_type=${time}`;
    }

    // Add job type filter if provided
    if (type) {
      url += `&location0=US&what_or=remote%20${type}`;
    }

    console.log('Requesting URL:', url); // Debug log

    // Make the API request
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Transform and return results
    const transformedResults = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      time: time || job.contract_type || 'Not Specified',
      type: type || 'Not Specified',
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      redirect_url: job.redirect_url
    }));

    res.json(transformedResults);
  } catch (error) {
    // Enhanced error logging
    console.error('Full error:', error);
    
    // Check for specific axios error response
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      
      // Return the error response from Adzuna
      return res.status(error.response.status).json({
        message: 'Error from Adzuna API',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response received
      console.error('No response received:', error.request);
      return res.status(500).json({
        message: 'No response received from Adzuna API'
      });
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
      return res.status(500).json({
        message: 'Error setting up job search request',
        error: error.message
      });
    }
  }
});

module.exports = router;