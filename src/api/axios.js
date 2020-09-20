const axios = require("axios");
var iz = axios.create(
{	 baseURL:"/api",
    headers: {
        Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding":
            "gzip, deflate, br",
        "Accept-Language":
            "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        Cookie:
            "_ga=GA1.2.1514115482.1599915136; _gid=GA1.2.1154821716.1599915136; has_js=1; show_adult=1",
        Host:
            "ecchi.iwara.tv",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0",
        },
        timeout: 3000,
        retry: 100,
        retryDelay: 1000 
}
)
iz.interceptors.response.use((res)=>{
    if(res&&res.data){  
        console.log("res存在");
    }else{
        console.log("res不存在")
    }
    return res;
}, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        console.log(err,config.__retryCount,config.retry);
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

export default iz;