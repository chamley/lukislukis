import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Canvas from './Canvas';

const socket = {
  on: (str, callback) => {
    if (str === 'userList') return callback([{ name: 'blabla' }]);
    if (str === 'locks') return callback({ name: 'mockName' });
  },
  emit: jest.fn(),
};

const canvas = {
  add: function () {
    this._objects.push.apply(this._objects, arguments);
    return this;
  },
  clear: function () {
    this._objects = [];
    return true;
  },
  toJSON: () => [],
  setActiveObject: function (obj) {
    return true;
  },
  _objects: [],
};

const lock = {
  name: 'blabla',
};

let name = 'blabla';

describe('<Canvas />', () => {
  beforeEach(() => {
    render(<Canvas socket={socket} name={name} />);
  });

  afterEach(() => {
    canvas.clear();
    jest.clearAllMocks();
  });

  test('it should mount', () => {
    const canvas = screen.getByTestId('Canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('Clicking on Canvas should lock the active user', () => {
    jest.clearAllMocks();
    expect(lock.name).toBe('');
    fireEvent.click(screen.getByRole('canvas'));
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(lock.name).toBe('mockName');
  });
});
