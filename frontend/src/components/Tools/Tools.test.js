import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tools from './Tools';

const canvas = {};
const lock = {
  name: 'blabla',
};

beforeEach(() => {
  render(<Tools canvas={canvas} lock={lock} />);
});

describe('<Tools />', () => {
  test('it should mount', () => {
    const tools = screen.getByTestId('Tools');
    expect(tools).toBeInTheDocument();
  });

  it('clicking on the drawing-mode button should switch drawing modes', () => {
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

  it('Clicking on bubbles should change the brush to bubbles', () => {});
});
