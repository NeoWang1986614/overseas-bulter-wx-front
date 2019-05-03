const urlPrefix = 'https://bulter.mroom.com.cn:8008/overseas-bulter/v1';
// const urlPrefix = 'https://bulter.mroom.com.cn:8008/overseas-bulter/v1';//'https://www.cqmygysdss.com:8008/overseas-bulter/v1'

const appId = 'wx69af257300e856ce';
const appSecret = 'cfa353d6dc3df7ad19582b816179d038';

function generateFullUrl (shortUrl) {
  console.log(urlPrefix);
  return urlPrefix + shortUrl;
}

module.exports = {
  generateFullUrl: generateFullUrl,
  appId: appId,
  appSecret: appSecret
}