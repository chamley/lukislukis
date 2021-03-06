import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Canvas, { saveCanvas } from './Canvas';
import ApiService from '../../Services/ApiService';

jest.mock('../../Services/ApiService');
jest.mock('../UserList/UserList', () => () => <div data-testid="UserList"></div>);
jest.mock('../Tools/Tools', () => () => <div data-testid="Tools"></div>);
ApiService.getResource.mockResolvedValue({ _id: 'id_value', canvasData: ['someData'] });

jest.useFakeTimers();

const socket = {
  on: (str, callback) => {
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

describe('<Canvas />', () => {
  beforeEach(() => {
    act(() => {
      render(<Canvas socket={socket} />);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('it should mount', () => {
    expect(screen.getByTestId('wrapper')).toBeInTheDocument();
  });

  it('Should display the tool-box', () => {
    expect(screen.getByTestId('Tools')).toBeInTheDocument();
  });

  it("Should display the users' list", () => {
    expect(screen.getByTestId('UserList')).toBeInTheDocument();
  });

  it('Api calls should return a new canvas when not provided by the Api', () => {
    ApiService.getResource.mockResolvedValue({ _id: 'id_value', canvasData: [] });
    expect(screen.getByTestId('wrapper')).toBeInTheDocument();
  });

  it('Canvas should save on mouse up from the canvas', () => {
    fireEvent.mouseUp(screen.getByTestId('wrapper'));
    jest.advanceTimersByTime(1);
    expect(socket.emit).toHaveBeenCalledTimes(1);
  });

  it('Hitting delete should not work in drawing mode', () => {
    fireEvent.keyUp(document, { keyCode: 46 });
    expect(socket.emit).toHaveBeenCalledTimes(0);
  });
});
