const urlPrefix = 'http://localhost:8008/overseas-bulter/v1';//'https://www.cqmygysdss.com:8008/overseas-bulter/v1'

function generateFullUrl (shortUrl) {
  console.log(urlPrefix);
  return urlPrefix + shortUrl;
}

module.exports.generateFullUrl = generateFullUrl;