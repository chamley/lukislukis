import React from 'react';
import { render, screen, fireEvent, renderHook, cleanup } from '@testing-library/react';
import App from './App';


const testUsername = 'RANDOM USERNAME';


// DOCS
// Tests are fairly self-explanatory. check line comments

describe('Integrated test App.js + Login.js', ()=> {

  //beforeEach(cleanup);

  test('App renders a login',()=>{
    render(<App/>);
    expect(screen.getByTestId('login')).toBeInTheDocument();
  })

  test('Integrated Testing of App.js and Login.js to see if all components of the login render properly', () => {
    const regexp = new RegExp(testUsername);
    render(<App/>);

    fireEvent.change(screen.getByRole('textbox'), {
      target: {value: testUsername},
    });

    fireEvent.click(screen.getByText('Enter'));

    expect(screen.getByText(regexp)).toBeInTheDocument();

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('Integrated testing of App.js and Login.js to see if logout functions properly' , () => {
    // we are already logged in due to test above
    const regexp = new RegExp(testUsername);
    render(<App/>);

    // now logout. We didn't unmount anything so the state is as is from previous test()
    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect( () =>  getByText(regexp)).toThrow();
  });
})




