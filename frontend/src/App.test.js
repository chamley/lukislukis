import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { Socket } from 'socket.io-client';

jest.mock('./components/Canvas/Canvas', () => () => <div data-testid="Canvas"></div>);
jest.mock('./components/Login/Login', () => () => <div data-testid="Login"></div>);
Socket.emit = () => true;

describe('<App />', () => {
  test('App renders in the page', () => {
    render(<App />);
    expect(screen.getByTestId('App')).toBeInTheDocument();
  });

  test('App renders a login when no cookie is provided', () => {
    render(<App />);
    expect(screen.getByTestId('Login')).toBeInTheDocument();
  });

  test('App renders Canvas when a cookie is provided', () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'name=testName',
    });
    render(<App />);
    expect(screen.getByTestId('Canvas')).toBeInTheDocument();
  });

  test('App renders the name of the user and a Logout button when logged in', () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'name=testName',
    });
    render(<App />);
    expect(screen.getByText(/testName/i)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('Clicking on Logout should render the Login page', () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'name=testName',
    });
    render(<App />);
    // now logout. We didn't unmount anything so the state is as is from previous test()
    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('Login')).toBeInTheDocument();
    expect(() => getByText(/testName/i)).toThrow();
  });
});
