const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'my_verify_token';
const FORWARD_URL = process.env.FORWARD_URL || '';

app.use(bodyParser.json());

// GET endpoint for verifying webhook with Meta
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// POST endpoint for receiving events
app.post('/webhook', async (req, res) => {
  console.log('Received webhook:', JSON.stringify(req.body, null, 2));

  // Optional: forward to MuleSoft or Salesforce
  if (FORWARD_URL) {
    try {
      await axios.post(FORWARD_URL, req.body);
      console.log('Forwarded to', FORWARD_URL);
    } catch (err) {
      console.error('Forwarding error:', err.message);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
