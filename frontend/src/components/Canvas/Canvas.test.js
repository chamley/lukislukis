import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Canvas from './Canvas';
import ApiService from '../../Services/ApiService';

jest.mock('../../Services/ApiService');
jest.mock('../UserList/UserList', () => () => <div data-testid="UserList"></div>);
jest.mock('../Tools/Tools', () => () => <div data-testid="Tools"></div>);
ApiService.getResource.mockResolvedValue({ _id: 'id_value', canvasData: ['someData'] });

const socket = {
  on: (str, callback) => {
    if (str === 'userList') return callback([{ name: 'blabla' }]);
    if (str === 'locks') return callback({ name: '' });
    if (str === 'saving')
      return callback({
        data: JSON.stringify({
          version: '3.6.3',
          objects: [],
        }),
      });
    if (str === 'connection') return callback('stringId');
  },
  emit: jest.fn(),
};

let name = 'blabla';

describe('<Canvas />', () => {
  test('it should mount', () => {
    act(() => {
      render(<Canvas socket={socket} name={name} />);
    });
    expect(screen.getByTestId('Canvas')).toBeInTheDocument();
  });

  it('Clicking on Canvas should lock the active user when free', () => {
    act(() => {
      render(<Canvas socket={socket} name={name} />);
    });
    jest.clearAllMocks();
    fireEvent.click(screen.getByRole('canvas'));
    expect(socket.emit).toHaveBeenCalledTimes(1);
  });

  it('Clicking on Canvas should not allow painting when busy', () => {
    socket.on = (str, callback) => {
      if (str === 'userList') return callback([{ name: 'blabla' }]);
      if (str === 'locks') return callback({ name: 'mockUser' });
    };
    act(() => {
      render(<Canvas socket={socket} name={name} />);
    });
    jest.clearAllMocks();
    fireEvent.click(screen.getByRole('canvas'));
    expect(socket.emit).toHaveBeenCalledTimes(0);
  });

  it('Should display the tool-box', () => {
    act(() => {
      render(<Canvas socket={socket} name={name} />);
    });
    expect(screen.getByTestId('Tools')).toBeInTheDocument();
  });

  it("Should display the users' list", () => {
    act(() => {
      render(<Canvas socket={socket} name={name} />);
    });
    expect(screen.getByTestId('UserList')).toBeInTheDocument();
  });

  it('Should render a warning message when another user is drawing', () => {
    socket.on = (str, callback) => {
      if (str === 'userList') return callback([{ name: 'blabla' }]);
      if (str === 'locks') return callback({ name: 'mockUser' });
    };
    act(() => {
      render(<Canvas socket={socket} name={name} />);
    });
    expect(screen.getByText(/currently drawing/i)).toBeInTheDocument();
  });

  it('Should not render a warning when not locked', () => {
    act(() => {
      render(<Canvas socket={socket} name={name} />);
    });
    expect(() => getByText(/currently drawing/i)).toThrow();
  });
});

describe('Testing Api Calls', () => {
  it('Api calls should return a new canvas when not provided by the Api', () => {
    ApiService.getResource.mockResolvedValue({});
    act(() => {
      render(<Canvas socket={socket} name={name} />);
    });
    const canvas = screen.getByTestId('Canvas');
    expect(canvas).toBeInTheDocument();
  });
});
