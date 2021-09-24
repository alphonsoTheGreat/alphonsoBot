const axios = require("axios")

function createInstance(baseUrl, headers, responseInterceptorSuccess, responseInterceptorError) {

    const instance = axios.create({
        baseURL: baseUrl,
        headers: headers
    });

    instance.interceptors.response.use(responseInterceptorSuccess, responseInterceptorError);
    return instance

}


module.exports = {
    createInstance
}