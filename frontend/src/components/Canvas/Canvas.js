import React, { useEffect, useState } from 'react';
import styles from './Canvas.module.scss';
import { fabric } from 'fabric';
import Tools from '../Tools/Tools';
import ApiService from '../../Services/ApiService';
import UserList from '../UserList/UserList';

const MAX_SIZE = process.env.REACT_APP_MAX_SIZE;

function Canvas({ name, socket }) {
  const [canvas, setCanvas] = useState({});
  const [id, setId] = useState('');
  const [lock, setLock] = useState({});

  const initCanvas = () => {
    return new fabric.Canvas('main-canvas', {
      preserveObjectStacking: true,
      height: window.innerHeight * 0.75,
      width: window.innerWidth * 0.6,
      backgroundColor: 'cyan',
      isDrawingMode: true,
    });
  };

  useEffect(() => {
    socket.emit('getLocks');
    socket.on('locks', (data) => {
      setLock(() => data);
      if (Object.keys(canvas).length > 0) {
        if (data.name && data.name !== name) {
          canvas.isDrawingMode = false;
          canvas.forEachObject((obj) => (obj.selectable = false));
        } else {
          // canvas.isDrawingMode = true;
          canvas.forEachObject((obj) => (obj.selectable = true));
        }
      }
    });
  }, [canvas, name, socket]);

  useEffect(() => {
    socket.on('connection', (data) => setId(data));
    socket.on('saving', (data) => {
      if (Object.keys(canvas).length > 1) {
        canvas.loadFromJSON(JSON.parse(data.data), () => {
          setCanvas(canvas);
          canvas.renderAll();
        });
      }
    });
  }, [canvas, socket]);

  useEffect(() => {
    ApiService.getResource('main-canvas').then((data) => {
      setId(data._id);
      if (data.canvasData) {
        const importCanvas = initCanvas();
        importCanvas.loadFromJSON(data.canvasData, () => {
          setCanvas(importCanvas);
          importCanvas.renderAll();
        });
      } else {
        setCanvas(initCanvas());
      }
    });
  }, []);

  const saveCanvas = () => {
    setTimeout(() => {
      const canvasData = JSON.stringify(canvas.toJSON());
      if (canvas && canvasData.length < MAX_SIZE) {
        const body = {
          _id: id,
          canvasData,
        };
        ApiService.createResource('canvas', body, 'PUT');
        socket.emit('save', {
          data: canvasData,
          id,
        });
      } else {
        alert('Your canvas is too big!!');
      }
    }, 1);
  };

  return (
    <div className={styles.Canvas} data-testid="Canvas">
      <div className={styles.canvasContainer}>
        <div onMouseUp={saveCanvas} role="canvas">
          <canvas style={{ border: 'solid 1px #eee' }} id="main-canvas"></canvas>
        </div>
        <div className={styles.toolbox}>
          <Tools
            canvas={canvas}
            socket={socket}
            name={name}
            id={id}
            saveCanvas={saveCanvas}
            lock={lock}
          />
          <div className="userList">
            <UserList socket={socket} />
          </div>
        </div>
      </div>
      {lock.name ? (
        <div className={styles.status}>{lock.name} is currently drawing...</div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Canvas;
