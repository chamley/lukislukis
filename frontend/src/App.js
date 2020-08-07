import React, { useEffect, useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import styles from './App.module.scss';
import Canvas from './components/Canvas/Canvas';
import Login from './components/login/login';
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

  // DUNNO WHAT THIS DOES!
  // if (!name === '') {
  //   return <div className="App"></div>;
  // }

  const logout = () => {
    setName('');
  };

  return (
    <CookiesProvider>
      <div className="App">
        {name ? (
          <div className="mainPage">
            <div className={styles.appHeader}>
              <h3>Hello {name}!</h3>
              <button onClick={logout}>Logout</button>
            </div>
            <div className={styles.container}>
              <Canvas socket={socket} name={name} />
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
