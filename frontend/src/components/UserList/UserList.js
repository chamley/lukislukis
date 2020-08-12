import React, { useState, useEffect } from 'react';
import styles from './UserList.module.scss';

const UserList = ({ socket }) => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    socket.on('userList', (data) => {
      setUserList(data);
    });
  }, [socket]);

  return (
    <div className={styles.UserList} data-testid="UserList">
      <div className={styles.listHeader}>
        <span id="fellowArtists">Fellow Artists Connected:</span>
      </div>
      <div className={styles.namesList}>
        {userList &&
          userList.map((user) => (
            <div key={user.name + Math.random()} className={styles.singleUser} data-testid="artist">
              {user.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserList;
