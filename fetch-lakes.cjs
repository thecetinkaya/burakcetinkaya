const https = require('https');
const fs = require('fs');

const query = '[out:json];(relation["name"="Van Gölü"];relation["name"="Tuz Gölü"];);out geom;';
const body = 'data=' + encodeURIComponent(query);

const req = https.request({
  hostname: 'overpass-api.de',
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(body)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('src/data/raw-lakes.json', data);
    console.log('Saved raw-lakes.json');
  });
});
req.on('error', (e) => {
  console.error(e);
});
req.write(body);
req.end();
