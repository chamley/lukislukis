

const BASE_URL = 
  (process.env.NODE_ENV === 'production') 
  ?  process.env.REACT_APP_API_PROD_URL 
  :  process.env.REACT_APP_API_URL;


function getResource(endpoint, params) {
  const url = `${BASE_URL}${endpoint}` + (params ? `/${params}` : '');
  return fetchFromDb(url);
}

function createResource(endpoint, body, type) {
  const url = `${BASE_URL}${endpoint}`;
  return fetchFromDb(url, {
    method: type,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

const fetchFromDb = async (url, options) => {
  return fetch(url, options)
    .then((res) => (res.status < 400 ? res : Promise.reject(res)))
    .then((res) => (res.status !== 204 ? res.json() : res))
    .catch((error) => console.log(error));
};

export default {
  getResource,
  createResource,
};
