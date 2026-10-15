const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { mergeRequestOptions } = require('./options');

const app = express();
app.use(express.json());

const demoUser = {
  username: 'demo',
  password: 'demo-password',
  id: 'user-1',
  role: 'customer',
};
const jwtSecret = process.env.JWT_SECRET || 'demo-only-secret';

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== demoUser.username || password !== demoUser.password) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const token = jwt.sign(
    { sub: demoUser.id, username: demoUser.username, role: demoUser.role },
    jwtSecret,
    { expiresIn: '1h' },
  );
  return res.json({ token });
});

app.get('/profile', (req, res) => {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;
  if (!token) {
    return res.status(401).json({ error: 'missing bearer token' });
  }

  try {
    const claims = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    return res.json({
      id: claims.sub,
      username: claims.username,
      role: claims.role,
    });
  } catch (error) {
    return res.status(401).json({ error: 'invalid token' });
  }
});

app.get('/inventory', async (req, res) => {
  const baseUrl = process.env.INVENTORY_SERVICE_URL || 'http://localhost:8080/items';
  try {
    const response = await axios.get(baseUrl, mergeRequestOptions());
    return res.json(response.data);
  } catch (error) {
    return res.status(502).json({ error: 'inventory service unavailable' });
  }
});

module.exports = app;
