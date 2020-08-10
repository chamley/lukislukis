import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tools from './Tools';

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

const socket = {
  emit: jest.fn(),
};

describe('<Tools /> for the active user', () => {
  beforeEach(() => {
    render(<Tools canvas={canvas} socket={socket} name={name} lock={lock} />);
  });

  afterEach(() => {
    canvas.clear();
    jest.clearAllMocks();
  });

  test('it should mount', () => {
    const tools = screen.getByTestId('Tools');
    expect(tools).toBeInTheDocument();
  });

  it('Clicking on the drawing-mode button should switch drawing modes', () => {
    fireEvent.click(screen.getByText(/drawing mode/i));
    expect(screen.getByText(/Start/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/drawing mode/i));
    expect(screen.getByText(/Exit/i)).toBeInTheDocument();
  });

  it('Dragging the brush size bar should change the size', () => {
    const brushSize = screen.getByAltText('brush-size');
    fireEvent.change(brushSize, { target: { value: 10 } });
    expect(brushSize.value).toBe('10');
    fireEvent.change(brushSize, { target: { value: 1 } });
    expect(brushSize.value).toBe('1');
    fireEvent.change(brushSize, { target: { value: 100 } });
    expect(brushSize.value).toBe('100');
  });

  it('Should change the color', () => {
    const setColor = screen.getByAltText('set-color');
    fireEvent.change(setColor, { target: { value: '#ff0000' } });
    expect(setColor.value).toBe('#ff0000');
  });

  it('Clicking on bubbles should change the brush to bubbles', () => {
    const bubbles = { points: [] };
    fireEvent.click(screen.getByAltText('brush bubbles'));
    expect(canvas.freeDrawingBrush).toMatchObject(bubbles);
  });

  it('Clicking on spray should change the brush to spray', () => {
    const spray = { sprayChunks: [] };
    fireEvent.click(screen.getByAltText('brush spray'));
    expect(canvas.freeDrawingBrush).toMatchObject(spray);
  });

  it('Clicking on pencil should change the brush to pencil', () => {
    const pencil = { _points: [] };
    fireEvent.click(screen.getByAltText('brush pencil'));
    expect(canvas.freeDrawingBrush).toMatchObject(pencil);
  });

  it('Clicking on rectangle should create a new rectangle', () => {
    expect(canvas._objects).toHaveLength(0);
    fireEvent.click(screen.getByAltText('brush square'));
    expect(canvas._objects[0].type).toBe('rectangle');
  });

  it('Clicking on triangle should create a new triangle', () => {
    expect(canvas._objects).toHaveLength(0);
    fireEvent.click(screen.getByAltText('brush triangle'));
    expect(canvas._objects).toHaveLength(1);
  });

  it('Clicking on circle should create a new circle', () => {
    expect(canvas._objects).toHaveLength(0);
    fireEvent.click(screen.getByAltText('brush circle'));
    expect(canvas._objects).toHaveLength(1);
  });

  it('Clicking on clear should reset the canvas', () => {
    fireEvent.click(screen.getByAltText('brush circle'));
    expect(canvas._objects).toHaveLength(1);
    expect(screen.getByText('clear')).not.toHaveAttribute('disabled');
    fireEvent.click(screen.getByText('clear'));
    expect(canvas._objects).toHaveLength(0);
  });

  it('Clicking on save should trigger the save function', () => {
    expect(screen.getByText('send')).not.toHaveAttribute('disabled');
    fireEvent.click(screen.getByText('send'));
    expect(socket.emit).toHaveBeenCalledTimes(1);
  });

  it('Saving a Canvas too big should alert an error', () => {
    canvas.toJSON = () => Array(5000000).fill(1);
    const unmockedAlert = window.alert;
    window.alert = jest.fn();
    expect(screen.getByText('send')).not.toHaveAttribute('disabled');
    fireEvent.click(screen.getByText('send'));
    expect(socket.emit).toHaveBeenCalledTimes(0);
    expect(window.alert).toHaveBeenCalledTimes(1);
    window.alert = unmockedAlert;
  });
});

describe('<Tools /> for inactive user', () => {
  beforeEach(() => {
    render(<Tools canvas={canvas} socket={socket} name={'anotherUser'} lock={lock} />);
  });

  it('Clear button should be disabled', () => {
    expect(screen.getByText('clear')).toHaveAttribute('disabled');
    fireEvent.click(screen.getByAltText('brush circle'));
    expect(canvas._objects).toHaveLength(1);
    fireEvent.click(screen.getByText('clear'));
    expect(canvas._objects).toHaveLength(1);
  });

  it('Save button should be disabled', () => {
    expect(screen.getByText('send')).toHaveAttribute('disabled');
    fireEvent.click(screen.getByText('send'));
    expect(socket.emit).toHaveBeenCalledTimes(0);
  });
});

describe('<Tools /> when no one is drawing', () => {
  it('Clear button should lock isDrawing for the current user', () => {
    render(<Tools canvas={canvas} socket={socket} name={name} lock={{}} />);
    expect(screen.getByText('clear')).not.toHaveAttribute('disabled');
    fireEvent.click(screen.getByText('clear'));
    expect(canvas._objects).toHaveLength(0);
    expect(socket.emit).toHaveBeenCalledTimes(1);
  });
});
