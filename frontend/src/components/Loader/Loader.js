import React from 'react';
import styles from './Loader.module.scss';

const Loader = () => (
  <div className={styles.Loader}>
    <div className={styles.spinner} data-testid="Loader"></div>
  </div>
);

export default Loader;
