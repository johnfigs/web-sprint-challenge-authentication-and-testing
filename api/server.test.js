const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

// [POST] /api/auth/register/
describe('[POST] /api/auth/register', () => {
  let res
  beforeEach(async () => {
    res = await request(server)
      .post('/api/auth/register/').send({ username: 'Kooks', password: 'iAmDoc' })
  })
  it('responds with a 201 created', async () => {
    expect(res.status).toBe(201)
  })
  it('responds with 401 on duplicate user registration', async () => {
    expect(res.status).toBe(401)
  })
})

// [POST] /api/auth/login/
describe('[POST] /api/auth/login', () => {
  let res
  beforeEach(async () => {
    res = await request(server)
      .post('/api/auth/register/').send({ username: 'jfigs', password: 'findMe' })
  }) 
  it('responds with a status 200 on successful login', async () => {
    res = await request(server)
              .post('/api/auth/login/')
              .send({ username: 'jfigs', password: 'findMe' })
    expect(res.status).toBe(200)
  })
  it('responds with token on successful login', async () => {
    res = await request(server)
                .post('/api/auth/login/')
                .send({ username: 'jfigs', password: 'findMe' })
    expect(res.text).toContain('token')
  })
})

// [GET] /api/jokes/
describe('[GET] /api/jokes/', () => {
  it('throws an error when not authenticated', async () => {
    let res = await request(server).get('/api/jokes/')
    expect(res.status).toBe(401)
  })
  it('pulls the correct amount of jokes', async () => {
    let res2 = await request(server).get('api/jokes/')
    .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo0LCJ1c2VybmFtZSI6Imtvb2tzIiwiaWF0IjoxNjM0MzM5MDM1LCJleHAiOjE2MzQ0MjU0MzV9.O9_bbz5XPhIVkpMwGt3_p4oHlDp-BbF1gnzvDfo9xVQ' )
    expect(res2.body).toHaveLength(3)
  })
})

