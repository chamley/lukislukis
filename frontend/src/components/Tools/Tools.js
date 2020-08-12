import React, { useEffect, useState } from 'react';
import styles from './Tools.module.scss';
import { fabric } from 'fabric';

function Tools({ canvas, saveCanvas }) {
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [drawingMode, setDrawingMode] = useState(true);

  const clear = () => {
    canvas.clear();
    saveCanvas();
  };

  const changeColor = ({ target }) => {
    setColor(target.value);
  };

  const changeBrushSize = ({ target }) => {
    setBrushSize(parseInt(target.value, 10));
  };

  const changeBrushType = (type) => (e) => {
    if (type === 'bubbles') {
      canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
    }
    if (type === 'spray') {
      canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
    }
    if (type === 'pencil') {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }
    canvas.freeDrawingBrush.width = brushSize;
    canvas.freeDrawingBrush.color = color;
    setDrawingMode(true);
    canvas.isDrawingMode = drawingMode;
  };

  const toggleDrawingMode = () => {
    setDrawingMode(!drawingMode);
  };

  useEffect(() => {
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = color;
      canvas.isDrawingMode = drawingMode;
    }
  }, [canvas, canvas.freeDrawingBrush, brushSize, color, canvas.isDrawingMode, drawingMode]);

  const addRectangle = () => {
    setDrawingMode(false);
    const rectangle = new fabric.Rect();
    rectangle.set({
      type: 'rect',
      width: brushSize * 1.618 * 4,
      height: brushSize * 4,
      fill: color,
      angle: 15,
      selectable: true,
    });
    canvas.add(rectangle).setActiveObject(rectangle);
    saveCanvas();
  };

  const addTriangle = () => {
    setDrawingMode(false);
    const triangle = new fabric.Triangle();
    triangle.set({
      type: 'triangle',
      width: brushSize * 4,
      height: brushSize * 0.866 * 4,
      fill: color,
      selectable: true,
      angle: 15,
    });
    canvas.add(triangle).setActiveObject(triangle);
    saveCanvas();
  };

  const addCircle = () => {
    setDrawingMode(false);
    const circle = new fabric.Circle();
    circle.set({
      type: 'circle',
      radius: brushSize * 2,
      fill: color,
      selectable: true,
    });
    canvas.add(circle).setActiveObject(circle);
    saveCanvas();
  };

  return (
    <div className={styles.Tools} data-testid="Tools">
      <div className={styles.toolsContainer}>
        <button id="toggleDraw" onClick={toggleDrawingMode}>
          {drawingMode ? 'Exit' : 'Start'} drawing mode
        </button>
        <input
          id="rangeInput"
          type="range"
          min={1}
          max={100}
          value={brushSize}
          onChange={changeBrushSize}
          alt="brush-size"
        />
        <input type="color" value={color} onChange={changeColor} alt="set-color" />
        <div className={styles.brushButtonsContainer}>
          <button id="bubblesBtn" onClick={changeBrushType('bubbles')}>
            <img src="/images/bubbles.jpg" alt="brush bubbles" />
          </button>
          <button id="sprayBtn" onClick={changeBrushType('spray')}>
            <img src="/images/spray.png" alt="brush spray" />
          </button>
          <button id="pencilBtn" onClick={changeBrushType('pencil')}>
            <img src="/images/pencil.png" alt="brush pencil" />
          </button>
          <button id="squareBtn" onClick={addRectangle}>
            <img src="/images/square.png" alt="brush square" />
          </button>
          <button id="triangleBtn" onClick={addTriangle}>
            <img src="/images/triangle.png" alt="brush triangle" />
          </button>
          <button id="circleBtn" onClick={addCircle}>
            <img src="/images/circle.png" alt="brush circle" />
          </button>
        </div>
        <button id="clearBtn" className={styles.clearButton} onClick={clear}>
          clear
        </button>
      </div>
    </div>
  );
}

export default Tools;
