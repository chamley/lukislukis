const BASE_URL = process.env.REACT_APP_API_URL;

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
  try {
    const res = await fetch(url, options);
    const res_1 = res.status < 400 ? res : Promise.reject(res);
    return res_1.status !== 204 ? res_1.json() : res_1;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getResource,
  createResource,
};
