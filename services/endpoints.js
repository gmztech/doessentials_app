// const API_BASE_URL = 'http://192.168.1.90:5000'
const API_BASE_URL = 'https://api.rela.io'

export const endpoints = {
    request_password: ({}) => {
        return `${API_BASE_URL}/api/v1/mezclaesencial/requestpassword`
    },
    create_client: ({}) => {
        return `${API_BASE_URL}/api/v1/mezclaesencial/createclient`
    }

}