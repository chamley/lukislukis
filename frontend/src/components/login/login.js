import React, { useState } from 'react';
import styles from './Login.module.scss';

function Login({ setName }) {
  const [nameInput, setNameInput] = useState('');

  const handleSubmit = (e) => {
    if (!nameInput) return alert('must enter a name');
    setName(nameInput);
  };

  const handleNameChange = ({ target }) => {
    setNameInput(target.value);
  };

  return (
    <div className={styles.login} data-testid="login">
      <img src="/images/background.jpg" />
      <div className={styles.heading}>
        <h1>Lukis</h1>
      </div>
      <div className={styles.loginForm}>
        <label className={styles.formElement}>Please Enter Your Name</label>
        <input
          className={styles.formElement}
          type="text"
          name="login"
          value={nameInput}
          onChange={handleNameChange}
        />
        <button className={styles.formElement} type="submit" value="Submit" onClick={handleSubmit}>
          Enter
        </button>
      </div>
      <div className={styles.heading}>
        <h1>Lukis</h1>
      </div>
    </div>
  );
}

export default Login;
