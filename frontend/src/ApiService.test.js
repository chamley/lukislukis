
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ApiService from './ApiService';




// DOCS:
// The function of the Api service is to:

// 1. Persist a newly created canvas to the db (ApiService.createResource) in Tools.js
    // parameters:
    // endpoint --> a string pointing us the route for the backend
    // body --> an object with _id field and a stringified representation of a canvas object converted to json
    // type --> request type for the router

// 2. Fetch a canvas for a subsequently connecting user from the db (ApiService.getResource ) in Canvas.js
      // parameters 
      // endpoint --> for router in backend
      // params --> i dont see this used in the current codebase but generically allows us to add params to our queries

  // current ideas for testing: 
  // 1. status codes
  // 2. Create a canvas, then fetch it and test it has the same id

  // further research if there was more time: screen compare for canvas equality
  // iterate through canvas object and determine if relevant fields are identical

describe('unit test for functions in ApiService.js', () => {
  
  test('returns proper status code on failure', async () => {
    const endpoint = 'canvas';
    const invalidBody = {};
    const type = 'PUT'
    const x = await ApiService.createResource(endpoint, invalidBody, type)
    expect(x.status).toEqual(500)
  })
  

  test('persists valid canvas to db', async ()=> {
    const endpoint = 'canvas';
    const type = 'PUT'
    const createMockCanvas = function() {
      return '{field : data}'
    }
    const mockId = '123456789_12'; // requires 12 byte string. 1 char = 1 byte, idk ..
    const body = {
      _id:mockId,
      canvasData: createMockCanvas()
    }
    const x = await ApiService.createResource(endpoint, body, type);
    console.log(x)
    // BE emits 'Error: Error canvas not found with id 123456789_12'
  });

  test('retrieves persisted canvas from db', async() => {
    //tbd
  })


});