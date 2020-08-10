import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from './Login';

// DOCS:
// A login in itself is not a very complicated component so useful unit tests are a bit limited
// For more test check out App.test.js for integrated App.js+Login.js tests

// Further development: verify behavior of box upon window-resizing/use in different devices.



describe('<login />', () => {
  test('a login should be rendered', () => {
    render(<Login />);
    const login = screen.getByTestId('login');
    expect(login).toBeInTheDocument();
  });

  test('box accepts inputs', () => {
    const testUsername = 'random username';
    render(<Login />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: {value: testUsername},
    });
    // getByDisplay value grabs the input in the box
    expect(screen.getByDisplayValue(testUsername)).toBeInTheDocument();
  })

  test('On submit should persist submission', () => {
    const setName = jest.fn();
    const testUsername = 'random username';


    render(<Login setName={setName}/>);

    fireEvent.change(screen.getByRole('textbox'), {
      target: {value: testUsername},
    });
    fireEvent.click(screen.getByText('Enter'));
    
    //expect(setName.mock.calls.length).toBe(1);
    expect(setName).toHaveBeenCalledTimes(1);

  });

  
  // https://medium.com/wehkamp-techblog/unit-testing-your-react-application-with-jest-and-enzyme-81c5545cee45
  test('On submit without text inputed, fires alert', () => {
    //jest.clearAllMocks();
    const setName = jest.fn();
    window.alert = jest.fn();// = jest.spyOn(window, 'alert');

    render(<Login setName={setName}/>);
    fireEvent.click(screen.getByText('Enter'));
    expect(setName).toHaveBeenCalledTimes(0);
    expect(window.alert).toHaveBeenCalledTimes(1);


  });





  // test('user input should be stored properly', ()=>{
  //   render(<App />);
    
  // })


});