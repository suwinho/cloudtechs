const request = require('supertest');
const app = require('./server');
const { pool } = require('./db');

jest.mock('./db', () => ({
  pool: {
    query: jest.fn()
  },
  initDb: jest.fn()
}));

describe('API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test('GET /health zwraca 200 i poprawne pole status oraz uptime', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('uptime');
  });

  test('GET /stats korzysta z bazy danych i poprawnie zwraca komplet danych', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ count: '10' }] });

    const res = await request(app).get('/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalItems', 10); 
    expect(res.body).toHaveProperty('requests');
    expect(res.body).toHaveProperty('uptime');
    expect(pool.query).toHaveBeenCalledTimes(1); 
  });
});
