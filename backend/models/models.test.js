const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const CanvasModel = require('./canvas');

const mongod = new MongoMemoryServer();

const cData = {
  dateCreated: new Date(),
  dateModified: new Date(),
  canvasData: {
    property1: 'string',
    property2: 0,
    property3: true,
    property4: null,
    property5: undefined,
    property6: {
      nestProp1: 'nestedString',
      nestProp2: 1,
      nestProp3: false,
    },
  },
  isMainCanvas: true,
};

describe('Canvas Model Test', () => {
  beforeAll(async () => {
    const dbURI = await mongod.getUri();
    const mongooseOpts = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    };
    mongoose
      .connect(dbURI, mongooseOpts)
      .then(() => console.info('Connected to the DB!'))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  });

  afterEach(async () => {
    // const dbData = await CanvasModel.find({});
    // console.info(dbData);
    const { collections } = mongoose.connection;

    Object.keys(collections).forEach(async (key) => {
      const collection = collections[key];
      await collection.deleteMany();
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoose.stop();
  });

  it('should not contain anything initially', async () => {
    const count = await CanvasModel.countDocuments();
    expect(count).toEqual(0);
  });

  it('should create & save a canvas successfully with a new _id', async () => {
    const initCanvas = new CanvasModel(cData);
    const savedCanvas = await initCanvas.save();
    expect(savedCanvas._id).toBeDefined();
  });

  it('should save the canvas model with the correct data', async () => {
    const Canvas = await CanvasModel.create(cData);
    expect(Canvas.dateCreated).toBe(cData.dateCreated);
    expect(Canvas.dateModified).toBe(cData.dateModified);
    const canv = cData.canvasData;
    expect(Canvas.canvasData).toHaveProperty('property1', canv.property1);
    expect(Canvas.canvasData).toHaveProperty('property2', canv.property2);
    expect(Canvas.canvasData).toHaveProperty('property3', canv.property3);
    expect(Canvas.canvasData).toHaveProperty('property4', canv.property4);
    expect(Canvas.canvasData).toHaveProperty('property5', canv.property5);
    expect(Canvas.canvasData.property6).toHaveProperty('nestProp1', canv.property6.nestProp1);
    expect(Canvas.canvasData.property6).toHaveProperty('nestProp2', canv.property6.nestProp2);
    expect(Canvas.canvasData.property6).toHaveProperty('nestProp3', canv.property6.nestProp3);
    expect(Canvas.isMainCanvas).toBe(cData.isMainCanvas);
  });

  it('should insert canvas, but with not defined field in schema -> undefined', async () => {
    cData.invalidProp = 'invalidProp';
    const canvasWithInvalidField = new CanvasModel(cData);
    const savedCanvasWithInvalidField = await canvasWithInvalidField.save();
    expect(savedCanvasWithInvalidField._id).toBeDefined();
    expect(savedCanvasWithInvalidField.invalidProp).toBeUndefined();
    delete cData.invalidProp;
  });

  it('should not create canvas with wrong type of data ', async () => {
    const wrongCanvas = {
      dateCreated: '-123',
      dateModified: Symbol('foo'),
      canvasData: false,
      isMainCanvas: {
        property1: false,
        property2: {
          nestProp1: null,
        },
      },
    };

    const errorType = mongoose.Error.ValidationError;
    await expect(CanvasModel.create(wrongCanvas)).rejects.toThrow(errorType);
  });
});
