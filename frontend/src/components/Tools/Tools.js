import React, { useEffect, useState } from 'react';
import styles from './Tools.module.scss';
import { fabric } from 'fabric';
import { BrushTypes } from '../../domain/brushTypes';
import ApiService from '../../Services/ApiService';

const MAX_SIZE = 5000000;

function Tools({ canvas, socket, name, id, lock, setLock }) {
  const [brushSize, setBrushSize] = useState(1);
  const [color, setColor] = useState('black');
  const [drawingMode, setDrawingMode] = useState(true);

  const save = () => {
    if (canvas && JSON.stringify(canvas.toJSON()).length < MAX_SIZE) {
      const body = {
        _id: id,
        canvasData: JSON.stringify(canvas.toJSON()),
      };
      ApiService.createResource('canvas', body, 'PUT')
        .then((res) => console.info(res))
        .catch((err) => console.info(err));
      socket.emit('save', {
        data: JSON.stringify(body.canvasData),
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
    if (type === BrushTypes.BUBBLES) {
      canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
    }
    if (type === BrushTypes.SPRAY) {
      canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
    }
    if (type === BrushTypes.PENCIL) {
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
          <button onClick={changeBrushType(BrushTypes.BUBBLES)}>
            <img src="/images/bubbles.jpg" />
          </button>
          <button onClick={changeBrushType(BrushTypes.SPRAY)}>
            <img src="/images/spray.png" />
          </button>
          <button onClick={changeBrushType(BrushTypes.PENCIL)}>
            <img src="/images/pencil.png" />
          </button>
          <button onClick={addRectangle}>
            <img src="/images/square.png" />
          </button>
          <button onClick={addTriangle}>
            <img src="/images/triangle.png" />
          </button>
          <button onClick={addCircle}>
            <img src="/images/circle.png" />
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
