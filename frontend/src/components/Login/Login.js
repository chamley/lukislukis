import React, { useState } from 'react';
import styles from './Login.module.scss';

function Login({ setName }) {
  const [nameInput, setNameInput] = useState('');

  const handleSubmit = (e) => {
    if (!nameInput) return alert('You have to enter a username!');
    setName(nameInput);
  };

  const handleNameChange = ({ target }) => {
    setNameInput(target.value);
  };

  return (
    <div className={styles.login} data-testid="Login">
      <div className={styles.heading}>
        <h1>Lukis</h1>
      </div>
      <form className={styles.loginForm}>
        <label className={styles.formLabel}>Please Enter Your Name</label>
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
      </form>
      <div className={styles.heading}>
        <h1>Lukis</h1>
      </div>
    </div>
  );
}

export default Login;
