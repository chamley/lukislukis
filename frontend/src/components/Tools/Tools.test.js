import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tools from './Tools';
import ApiService from '../../Services/ApiService';

jest.mock('../../Services/ApiService');
ApiService.createResource.mockResolvedValue(true);

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
  freeDrawingBrush: {
    points: [],
  },
  _objects: [],
};

const saveCanvas = jest.fn();

describe('<Tools />', () => {
  beforeEach(() => {
    render(<Tools canvas={canvas} saveCanvas={saveCanvas} />);
  });

  afterEach(() => {
    canvas.clear();
    jest.clearAllMocks();
  });

  test('it should mount', () => {
    expect(screen.getByTestId('Tools')).toBeInTheDocument();
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
    expect(canvas.freeDrawingBrush.color).toBe('#ff0000');
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
    expect(canvas._objects[0].type).toBe('rect');
    expect(saveCanvas).toHaveBeenCalledTimes(1);
  });

  it('Clicking on triangle should create a new triangle', () => {
    expect(canvas._objects).toHaveLength(0);
    fireEvent.click(screen.getByAltText('brush triangle'));
    expect(canvas._objects[0].type).toBe('triangle');
    expect(saveCanvas).toHaveBeenCalledTimes(1);
  });

  it('Clicking on circle should create a new circle', () => {
    expect(canvas._objects).toHaveLength(0);
    fireEvent.click(screen.getByAltText('brush circle'));
    expect(canvas._objects[0].type).toBe('circle');
    expect(saveCanvas).toHaveBeenCalledTimes(1);
  });

  it('Clicking on clear should reset the canvas', () => {
    fireEvent.click(screen.getByAltText('brush circle'));
    expect(canvas._objects).toHaveLength(1);
    jest.clearAllMocks();
    fireEvent.click(screen.getByText('clear'));
    expect(canvas._objects).toHaveLength(0);
    expect(saveCanvas).toHaveBeenCalledTimes(1);
  });

  it('should recover the selected tool when switching drawing mode', () => {
    fireEvent.click(screen.getByTestId('sprayBtn'));
    fireEvent.click(screen.getByTestId('toggleDraw'));
    fireEvent.click(screen.getByTestId('toggleDraw'));
    expect(screen.getByTestId('sprayBtn')).toHaveClass('active');
    fireEvent.click(screen.getByTestId('pencilBtn'));
    fireEvent.click(screen.getByTestId('toggleDraw'));
    fireEvent.click(screen.getByTestId('toggleDraw'));
    expect(screen.getByTestId('pencilBtn')).toHaveClass('active');
    fireEvent.click(screen.getByTestId('bubblesBtn'));
    fireEvent.click(screen.getByTestId('toggleDraw'));
    fireEvent.click(screen.getByTestId('toggleDraw'));
    expect(screen.getByTestId('bubblesBtn')).toHaveClass('active');
  });
});
