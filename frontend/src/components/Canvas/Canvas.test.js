import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Canvas from './Canvas';

const socket = {
  on: (str, callback) => callback([{ name: 'blabla' }]),
  emit: (str) => ({}),
};

describe('<Canvas />', () => {
  test('it should mount', () => {
    render(<Canvas socket={socket} name="hi!" />);

    const canvas = screen.getByTestId('Canvas');

    expect(canvas).toBeInTheDocument();
  });
});
