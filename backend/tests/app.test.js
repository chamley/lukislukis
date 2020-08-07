const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();
require('dotenv').config();
const app = require('../app');

describe('Paths not on router', () => {
  test('GET to root "/" -> fails (404)', (done) => {
    request(app)
      .get('/')
      .then((res) => {
        expect(res.statusCode).toBe(404);
        done();
      });
  });

  test('GET to path not on router -> fails (404)', (done) => {
    request(app)
      .get('/otherplace?key1=value&key2=value')
      .then((res) => {
        expect(res.statusCode).toBe(404);
        done();
      });
  });
});

describe('Paths on router', () => {
  const mainCanvas = {};

  beforeAll(async (done) => {
    const dbURI = await mongod.getUri();
    const mongooseOpts = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    };
    mongoose
      .connect(dbURI, mongooseOpts)
      .then(() => {
        console.info('Connected to the DB!');
        // don't want to log the (intentionally) produced errors in controllers:
        console.error = jest.fn();
        done();
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  });

  afterEach(async (done) => {
    // const dbData = await CanvasModel.find({});
    // console.info(dbData);
    done();
  });

  afterAll(async (done) => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    done();
  });

  test('GET to "/main-canvas" -> ok (200, headers, body)', (done) => {
    request(app)
      .get('/main-canvas')
      .then((res) => {
        const { headers, body, statusCode } = res;
        expect(statusCode).toBe(200);
        expect(body).toBeDefined();
        expect(headers).toBeDefined();
        expect(headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(headers).toHaveProperty('access-control-allow-origin', '*');
        Object.keys(body).forEach((key) => {
          mainCanvas[key] = body[key];
        });
        done();
      });
  });

  test('GET to "/canvas/:id" -> ok (200, headers, body)', (done) => {
    request(app)
      .get(`/canvas/${mainCanvas._id}`)
      .then((res) => {
        const { headers, body, statusCode } = res;
        expect(statusCode).toBe(200);
        expect(body).toBeDefined();
        expect(headers).toBeDefined();
        expect(headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(headers).toHaveProperty('access-control-allow-origin', '*');
        done();
      });
  });

  test('GET to "/canvas/:wrongId" -> fails (500)', (done) => {
    request(app)
      .get('/canvas/wrongId')
      .then((res) => {
        const { headers, body, statusCode } = res;
        expect(statusCode).toBe(500);
        expect(body).toBeDefined();
        expect(headers).toBeDefined();
        done();
      });
  });

  /* not calls for this endpoint in the FE */
  test('POST to "/canvas" -> ok (201, headers, body)', (done) => {
    request(app)
      .post('/canvas')
      .send(mainCanvas)
      .then((res) => {
        const { headers, body, statusCode } = res;
        expect(statusCode).toBe(201);
        expect(body).toBeDefined();
        expect(headers).toBeDefined();
        expect(headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(headers).toHaveProperty('access-control-allow-origin', '*');
        done();
      });
  });

  test('PUT to "/canvas" -> ok (201, headers, body)', async (done) => {
    mainCanvas.canvasData = {
      newProperty: true,
    };
    request(app)
      .put('/canvas')
      .send(mainCanvas)
      .then((res) => {
        const { headers, body, statusCode } = res;
        expect(statusCode).toBe(200);
        expect(body.canvasData).toHaveProperty('newProperty', true);
        expect(headers).toBeDefined();
        expect(headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(headers).toHaveProperty('access-control-allow-origin', '*');
        done();
      });
  });

  test('PUT to "/canvas" -> fails (500))', (done) => {
    mainCanvas._id = '1234';
    request(app)
      .put('/canvas')
      .send(mainCanvas)
      .then((res) => {
        const { headers, body, statusCode } = res;
        expect(statusCode).toBe(500);
        expect(body).toBeDefined();
        expect(headers).toBeDefined();
        expect(headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(headers).toHaveProperty('access-control-allow-origin', '*');
        done();
      });
  });
});
