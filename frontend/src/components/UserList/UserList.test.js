import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserList from './UserList';

const socket1 = {
  on: (str, callback) => callback([{ name: 'blabla' }]),
};
const socket2 = {
  on: (str, callback) => callback([{ name: 'blabla' }, { name: 'blabla2' }]),
};

describe('<UserList />', () => {
  test('it should mount', () => {
    render(<UserList socket={socket1} />);
    const userList = screen.getByTestId('UserList');
    expect(userList).toBeInTheDocument();
  });

  test('should display a list of artists', async () => {
    let userList = render(<UserList socket={socket1} />);
    expect(await screen.findAllByTestId('artist')).toHaveLength(1);
    userList.unmount();
    userList = render(<UserList socket={socket2} />);
    expect(await screen.findAllByTestId('artist')).toHaveLength(2);
  });

  it('should display the right names', async () => {
    let userList = render(<UserList socket={socket2} />);
    expect(await screen.getByText('blabla2')).toBeInTheDocument();
  });
});
