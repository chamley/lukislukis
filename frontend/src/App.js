import React, { useEffect, useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import styles from './App.module.scss';
import Canvas from './components/Canvas/Canvas.js';
import Login from './components/Login/Login.js';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_IO_URL);

function App() {
  const [name, setName] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['name']);

  useEffect(() => {
    if (cookies.name) {
      setName(cookies.name);
    }
  }, [cookies]);

  useEffect(() => {
    if (name) {
      setCookie('name', name);
      socket.emit('enter', name);
    } else {
      socket.emit('leave');
      removeCookie('name');
    }
  }, [name, setCookie, removeCookie]);

  const logout = () => {
    setName('');
  };

  return (
    <CookiesProvider>
      <div className={styles.App} data-testid="App">
        {name ? (
          <div className={styles.mainpage}>
            <div className={styles.appHeader}>
              <h3>Hello {name}!</h3>
              <button onClick={logout}>Logout</button>
            </div>
            <div id="canvasContainer" className={styles.container}>
              <Canvas id="canvas" socket={socket} name={name} />
            </div>
          </div>
        ) : (
          <Login setName={setName} />
        )}
      </div>
    </CookiesProvider>
  );
}

export default App;
