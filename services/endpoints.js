// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://api.rela.io';

export const endpoints = {
  request_password: ({}) => {
    return `${API_BASE_URL}/api/v1/doessentials/requestpassword`;
  },
  create_client: ({}) => {
    return `${API_BASE_URL}/api/v1/doessentials/createclient`;
  },
};
