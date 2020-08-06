import React, { useEffect, useState } from 'react';
import styles from './Tools.module.scss';
import { fabric } from 'fabric';
import ApiService from '../../Services/ApiService';

const MAX_SIZE = process.env.REACT_APP_MAX_SIZE;

function Tools({ canvas, socket, name, id, lock }) {
  const [brushSize, setBrushSize] = useState(1);
  const [color, setColor] = useState('black');
  const [drawingMode, setDrawingMode] = useState(true);

  const save = () => {
    if (canvas && JSON.stringify(canvas.toJSON()).length < MAX_SIZE) {
      const body = {
        _id: id,
        canvasData: JSON.stringify(canvas.toJSON()),
      };
      ApiService.createResource('canvas', body, 'PUT').catch((err) => console.info(err));
      socket.emit('save', {
        data: body.canvasData,
        id,
      });
    } else {
      alert('Your canvas is too big!!');
    }
  };

  const isDisabled = () => {
    return lock.name !== name && lock.name !== undefined;
  };

  const clear = () => {
    canvasLock();
    canvas.clear();
  };

  const canvasLock = () => {
    if (!lock.name) {
      socket.emit('lock', name);
    }
  };

  const changeColor = ({ target }) => {
    setColor(() => target.value);
  };

  const changeBrushSize = ({ target }) => {
    setBrushSize(() => {
      return parseInt(target.value, 10) || 1;
    });
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
    const rect = new fabric.Rect();
    rect.set('angle', 15).set('flipY', true);
    rect.set({ width: 100, height: 80, fill: color });
    rect.set('selectable', true);
    canvas.add(rect).setActiveObject(rect);
  };

  const addTriangle = () => {
    setDrawingMode(false);
    const triangle = new fabric.Triangle();
    triangle.set('angle', 15).set('flipY', true);
    triangle.set({ width: 100, height: 80, fill: color });
    triangle.set('selectable', true);
    canvas.add(triangle).setActiveObject(triangle);
  };

  const addCircle = () => {
    setDrawingMode(false);
    const circle = new fabric.Circle();
    circle.set('angle', 15).set('flipY', true);
    circle.set({ radius: 100, height: 80, fill: color });
    circle.set('selectable', true);
    canvas.add(circle).setActiveObject(circle);
  };

  return (
    <div className={styles.Tools}>
      <div className={styles.toolsContainer}>
        <button onClick={toggleDrawingMode}>{drawingMode ? 'Exit' : 'Start'} drawing mode</button>
        <input type={'range'} min={1} max={100} onChange={changeBrushSize} />
        <input type={'color'} onChange={changeColor} />
        <div className={styles.brushButtonsContainer}>
          <button onClick={changeBrushType('bubbles')}>
            <img src="/images/bubbles.jpg" alt="brush bubbles" />
          </button>
          <button onClick={changeBrushType('spray')}>
            <img src="/images/spray.png" alt="brush spray" />
          </button>
          <button onClick={changeBrushType('pencil')}>
            <img src="/images/pencil.png" alt="brush pencil" />
          </button>
          <button onClick={addRectangle}>
            <img src="/images/square.png" alt="brush square" />
          </button>
          <button onClick={addTriangle}>
            <img src="/images/triangle.png" alt="brush triangle" />
          </button>
          <button onClick={addCircle}>
            <img src="/images/circle.png" alt="brush circle" />
          </button>
        </div>
        <button className={styles.saveButton} disabled={isDisabled()} onClick={save}>
          send
        </button>
        <button className={styles.clearButton} disabled={isDisabled()} onClick={clear}>
          clear
        </button>
      </div>
    </div>
  );
}

export default Tools;
