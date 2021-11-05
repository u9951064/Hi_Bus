import axios from "axios";
import CryptoJS from "crypto-js";

const {
  appID,
  appKey
} = require('../configs/MotcConfig');

const instance = axios.create({
  baseURL: 'https://gist.motc.gov.tw/gist_api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  params: {
    '$format': 'JSON',
  },
  timeout: 3000,
});

instance.interceptors.request.use(
  (config) => {
    const GMTString = new Date().toGMTString();
    const hmacSha1 = CryptoJS.HmacSHA1(`x-date: ${GMTString}`, appKey);
    const signature = CryptoJS.enc.Base64.stringify(hmacSha1);

    config.headers['X-Date'] = GMTString;
    config.headers.Authorization = `hmac username="${appID}", algorithm="hmac-sha1", headers="x-date", signature="${signature}""`;

    return config;
  },
  (error) => {
    return error;
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response)
      return response;
  },
  (error) => {
    return error;
  }
);

export default instance;