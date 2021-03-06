import React, { useEffect, useState } from 'react';
import styles from './Tools.module.scss';
import { fabric } from 'fabric';

function Tools({ canvas, saveCanvas }) {
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [drawingMode, setDrawingMode] = useState(true);
  const [selectedTool, setSelectedTool] = useState('pencil');

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
      setSelectedTool('bubbles');
    }
    if (type === 'spray') {
      canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
      setSelectedTool('spray');
    }
    if (type === 'pencil') {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      setSelectedTool('pencil');
    }
    canvas.freeDrawingBrush.width = brushSize;
    canvas.freeDrawingBrush.color = color;
    setDrawingMode(true);
    canvas.isDrawingMode = drawingMode;
  };

  const toggleDrawingMode = () => {
    if (drawingMode) setSelectedTool('');
    else {
      const selector = Object.keys(canvas.freeDrawingBrush);
      if (selector.indexOf('points') !== -1) setSelectedTool('bubbles');
      if (selector.indexOf('_points') !== -1) setSelectedTool('pencil');
      if (selector.indexOf('sprayChunks') !== -1) setSelectedTool('spray');
    }
    setDrawingMode(!drawingMode);
  };

  useEffect(() => {
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = color;
      canvas.isDrawingMode = drawingMode;
    }
  }, [canvas, brushSize, color, drawingMode]);

  const addRectangle = () => {
    setDrawingMode(false);
    setSelectedTool('');
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
    setSelectedTool('');
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
    setSelectedTool('');
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
        <div>
          <button style={{ fontSize: '12px' }} onClick={toggleDrawingMode} data-testid="toggleDraw">
            {drawingMode ? 'Exit' : 'Start'} drawing mode
          </button>
          <input
            id="rangeInput"
            type={'range'}
            min={1}
            max={100}
            value={brushSize}
            onChange={changeBrushSize}
            alt="brush-size"
          />
          <input type={'color'} value={color} onChange={changeColor} alt="set-color" />
        </div>
        <div className={styles.brushButtonsContainer}>
          <button
            className={styles[selectedTool === 'bubbles' ? 'active' : '']}
            onClick={changeBrushType('bubbles')}
            data-testid="bubblesBtn"
          >
            <img src="/images/bubbles.jpg" alt="brush bubbles" />
          </button>
          <button
            className={styles[selectedTool === 'spray' ? 'active' : '']}
            onClick={changeBrushType('spray')}
            data-testid="sprayBtn"
          >
            <img src="/images/spray.png" alt="brush spray" />
          </button>
          <button
            className={styles[selectedTool === 'pencil' ? 'active' : '']}
            onClick={changeBrushType('pencil')}
            data-testid="pencilBtn"
          >
            <img src="/images/pencil.png" alt="brush pencil" />
          </button>
          <button onClick={addRectangle} data-testid="rectangleBtn">
            <img src="/images/square.png" alt="brush square" />
          </button>
          <button onClick={addTriangle} data-testid="triangleBtn">
            <img src="/images/triangle.png" alt="brush triangle" />
          </button>
          <button onClick={addCircle} data-testid="circleBtn">
            <img src="/images/circle.png" alt="brush circle" />
          </button>
        </div>
        <button className={styles.clearButton} onClick={clear} data-testid="clearBtn">
          clear
        </button>
      </div>
    </div>
  );
}

export default Tools;
