import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

const noName = '';
const name = 'some name';

test('renders login page', () => {
  const { getByText } = render(<App />);
  const greeting = getByText('Please Enter Your Name');
  expect(greeting).toBeInTheDocument();
});
