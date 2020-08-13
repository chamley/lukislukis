import React, { useEffect, useState } from 'react';
import styles from './Canvas.module.scss';
import { fabric } from 'fabric';
import Tools from '../Tools/Tools';
import UserList from '../UserList/UserList';
import Loader from '../Loader/Loader';

const MAX_SIZE = process.env.REACT_APP_MAX_SIZE;

function Canvas({ socket }) {
  const [loaded, setLoaded] = useState(false);
  const [canvas, setCanvas] = useState({});
  const [id, setId] = useState('');

  useEffect(() => {
    socket.on('connection', (data) => {
      console.log(data);
      setId(data.id);
      if (data.canvas.canvasData) {
        setLoaded(true);
        const importCanvas = initCanvas();
        importCanvas._id = data.canvas._id;
        importCanvas.loadFromJSON(data.canvas.canvasData, () => {
          setCanvas(importCanvas);
          importCanvas.renderAll();
        });
      } else {
        setCanvas(initCanvas());
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('saving', (data) => {
      if (Object.keys(canvas).length > 1) {
        canvas.loadFromJSON(JSON.parse(data.canvas.canvasData), () => {
          setCanvas(canvas);
          canvas.renderAll();
        });
      }
    });
    document.addEventListener('keyup', handleKeyup, false);
  }, [canvas, socket]);

  const initCanvas = () => {
    return new fabric.Canvas('main-canvas', {
      preserveObjectStacking: true,
      height: window.innerHeight - 200,
      width: window.innerWidth - 500,
      backgroundColor: 'white',
      isDrawingMode: true,
    });
  };

  const saveCanvas = () => {
    setTimeout(() => {
      const canvasData = JSON.stringify(canvas.toJSON());
      if (canvas && canvasData.length < MAX_SIZE) {
        const body = {
          id: id,
          canvas: {
            _id: canvas._id,
            canvasData,
          },
        };
        socket.emit('save', body);
      } else {
        alert('Your canvas is too big!!');
      }
    }, 1);
  };

  const handleKeyup = (e) => {
    if (e.keyCode === 46 && canvas.toJSON) {
      if (canvas.isDrawingMode === false) {
        const activeObjects = canvas.getActiveObjects();
        canvas.discardActiveObject();
        activeObjects.forEach((obj) => canvas.remove(obj));
        saveCanvas();
      }
    }
  };

  return (
    <div className={styles.Canvas} data-testid="Canvas">
      <div className={styles.canvasContainer}>
        {!loaded ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : (
          <div className={styles.canvasWrapper} onMouseUp={saveCanvas} data-testid="wrapper">
            <canvas className={styles.canvas} id="main-canvas"></canvas>
          </div>
        )}
        <div className={styles[!loaded ? 'hidden' : '']}>
          <div className={styles.toolbox}>
            <Tools canvas={canvas} saveCanvas={saveCanvas} />
            <div className="userList">
              <UserList socket={socket} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Canvas;
