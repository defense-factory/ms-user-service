jest.mock('axios');

const request = require('supertest');
const axios = require('axios');
const app = require('../src/app');
const { mergeRequestOptions } = require('../src/options');

describe('ms-user-service', () => {
  test('health returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('login and profile round-trip returns the user', async () => {
    const login = await request(app)
      .post('/login')
      .send({ username: 'demo', password: 'demo-password' });
    const profile = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(login.status).toBe(200);
    expect(profile.status).toBe(200);
    expect(profile.body).toEqual({
      id: 'user-1',
      username: 'demo',
      role: 'customer',
    });
  });

  test('profile without a token returns 401', async () => {
    const response = await request(app).get('/profile');
    expect(response.status).toBe(401);
  });

  test('merges request options with lodash defaults', () => {
    expect(mergeRequestOptions({ headers: { 'X-Demo': 'true' } })).toEqual({
      timeout: 2000,
      headers: {
        Accept: 'application/json',
        'X-Demo': 'true',
      },
    });
  });

  test('inventory proxies the upstream response without a network call', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 'item-1' }] });
    const response = await request(app).get('/inventory');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 'item-1' }]);
    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:8080/items',
      expect.objectContaining({ timeout: 2000 }),
    );
  });
});
