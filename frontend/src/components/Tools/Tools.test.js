import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tools from './Tools';

const canvas = {};
const lock = {
  name: 'blabla',
};

describe('<Tools />', () => {
  test('it should mount', () => {
    render(<Tools canvas={canvas} lock={lock} />);

    const tools = screen.getByTestId('Tools');

    expect(tools).toBeInTheDocument();
  });
});
