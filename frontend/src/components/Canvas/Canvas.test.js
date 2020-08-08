import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Canvas from './Canvas';

const socket = {
  on: (str, callback) => {
    if (str === 'userList') return callback([{ name: 'blabla' }]);
    if (str === 'locks') return callback({ name: '' });
  },
  emit: jest.fn(),
};

let name = 'blabla';

describe('<Canvas />', () => {
  test('it should mount', () => {
    let component = render(<Canvas socket={socket} name={name} />);
    const canvas = screen.getByTestId('Canvas');
    expect(canvas).toBeInTheDocument();
    component.unmount();
  });

  it('Clicking on Canvas should lock the active user when free', () => {
    let component = render(<Canvas socket={socket} name={name} />);
    jest.clearAllMocks();
    fireEvent.click(screen.getByRole('canvas'));
    expect(socket.emit).toHaveBeenCalledTimes(1);
    component.unmount();
  });

  it('Clicking on Canvas should not allow painting when busy', () => {
    socket.on = (str, callback) => {
      if (str === 'userList') return callback([{ name: 'blabla' }]);
      if (str === 'locks') return callback({ name: 'mockUser' });
    };
    let component = render(<Canvas socket={socket} name={name} />);
    jest.clearAllMocks();
    fireEvent.click(screen.getByRole('canvas'));
    expect(socket.emit).toHaveBeenCalledTimes(0);
    component.unmount();
  });

  it('Should display the tool-box', () => {
    let component = render(<Canvas socket={socket} name={name} />);
    expect(screen.getByTestId('Tools')).toBeInTheDocument();
    component.unmount();
  });

  it("Should display the users' list", () => {
    let component = render(<Canvas socket={socket} name={name} />);
    expect(screen.getByTestId('UserList')).toBeInTheDocument();
    component.unmount();
  });

  it('Should render a warning message when another user is drawing', () => {
    socket.on = (str, callback) => {
      if (str === 'userList') return callback([{ name: 'blabla' }]);
      if (str === 'locks') return callback({ name: 'mockUser' });
    };
    let component = render(<Canvas socket={socket} name={name} />);
    expect(screen.getByText(/currently drawing/i)).toBeInTheDocument();
    component.unmount();
  });

  it('Should not render a warning when not locked', () => {
    let component = render(<Canvas socket={socket} name={name} />);
    expect(() => getByText(/currently drawing/i)).toThrow();
    component.unmount();
  });
});
