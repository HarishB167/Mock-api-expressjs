const axios = require("axios");

axios.interceptors.response.use(null, (error) => {
  console.log("INTERCEPTOR CALLED");
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.error("Unexpected error occured");
  }
  return Promise.reject(error);
});

function setAuthorizationToken(token) {
  axios.defaults.headers["Authorization"] = token;
}

module.exports = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setAuthorizationToken,
};
