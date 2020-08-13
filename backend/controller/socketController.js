const Canvas = require('../models/canvas');

exports.getMainCanvas = async () => {
  try {
    let canvas = await Canvas.findOne({ isMainCanvas: true }).exec();
    if (!canvas) canvas = await Canvas.create({ isMainCanvas: true });
    return canvas;
  } catch (error) {
    console.error(error);
  }
};

exports.getCanvas = async (req, res) => {
  try {
    const canvas = await Canvas.findById(req.params.id);
    if (!canvas) throw new Error(`Error: canvas not found with id "${req.params.id}"`);
    res.status(200);
    res.json(canvas);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json(error);
  }
};

exports.postCanvas = async (req, res) => {
  try {
    // creating with an empty object will populate with the default values
    const canvas = await Canvas.create({});
    res.status(201);
    res.json(canvas);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.putCanvas = async (body) => {
  // todo make a id validator to check for non hex id
  try {
    const newCanvas = await Canvas.findByIdAndUpdate(
      body._id,
      {
        canvasData: body.canvasData,
        dateModified: new Date(),
      },
      {
        useFindAndModify: false,
        new: true,
      },
    );
    if (!newCanvas) throw new Error(`Error canvas not found with id ${req.body.id}`);
    return 'canvas saved';
  } catch (error) {
    console.error(error);
  }
};
