const axios = require("axios");
const tunnel = require('tunnel')
const tunnelProxy = tunnel.httpsOverHttp({
    proxy: {
        host: '127.0.0.1',
        port: '1081',
    },
});
var iz = axios.create(
{	 baseURL:"https://ecchi.iwara.tv",
        timeout: 10000,
        retry: 5,
        retryDelay: 1000 ,
        proxy: false,
        httpsAgent: tunnelProxy,
}
)
iz.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        console.log(err)
        return Promise.reject(err);
    }
    
    // Increase the retry count
    config.__retryCount += 1;
    console.log("请求重试次数:"+config.__retryCount)
    
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
        return iz(config);
    });
});

module.exports = {iz}