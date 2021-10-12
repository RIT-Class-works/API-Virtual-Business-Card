const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse');
const jsonHandler = require('./jsonResponse');

const postHandler = (request, response) => {
  // uploads come in as a byte stream that we need
  // to reassemble once it's all arrived
  const body = [];

  // if the upload stream errors out, just throw a
  // a bad request and send it back
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // on 'data' is for each byte of data that comes in
  // from the upload. We will add it to our byte array.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // on end of upload stream.
  request.on('end', () => {
    // combine our byte array (using Buffer.concat)
    // and convert it to a string value (in this instance)
    const bodyString = Buffer.concat(body).toString();
    // since we are getting x-www-form-urlencoded data
    // the format will be the same as querystrings
    // Parse the string into an object by field name
    const bodyParams = query.parse(bodyString);

    // pass to our addUser function
    jsonHandler.addUser(request, response, bodyParams);
  });
};
const getBusinessCard = (request, response, parsedURL) => {
  const params = query.parse(parsedURL.query);
  console.log(`user id: ${params.id}`);
  const userData = jsonHandler.getUser(params.id);

  if (userData) {
    let xml = '<div style="background-color:#73AD21;color:white;width:600px;margin:100px auto auto auto;border: 3px solid DodgerBlue;">';
    xml += '<h1 style="text-align:center"> My business Card </h1>';
    xml += `<p style="margin-left:100px"> Name: ${userData.firstName} ${userData.lastName} </p>`;
    xml += `<p style="margin-left:100px"> Email: ${userData.email}  </p>`;
    xml += `<p style="margin-left:100px"> Phone: ${userData.phone}  </p>`;
    xml += `<p style="margin-left:100px"> Job/Position: ${userData.title} </p>`;
    xml += `<p style="margin-left:100px; margin-right:100px"> Description: ${userData.description} </p>`;
    // xml += `<p> ${userData.description} </p>`;
    xml += '<p style="margin-left:100px"> My Links: </p>';
    for (let i = 0; i < userData.links.length - 1; i++) {
      xml += `<p style="margin-left:100px;margin-right:100px"><a href="${userData.links[0]}">${userData.links[0]}</a></p>`;
    }
    xml += '</div>';

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(xml);
    response.end();
  }
};
const urlStruct = {

  GET: {
    '/': htmlHandler.getIndex,
    '/custom.css': htmlHandler.getCSS,
    '/getcard': getBusinessCard,
    '/images/background.png': htmlHandler.getBackground,
  },
  POST: {
    '/GenerateQR': postHandler,
  },
};
const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  console.log(parsedURL.pathname);
  console.log(request.method);
  if (urlStruct[request.method][parsedURL.pathname]) {
    console.log('Pathname and Handler: Checked');
    urlStruct[request.method][parsedURL.pathname](request, response, parsedURL);
  } else {
    console.log('Unexpected error at finding pathname');
  }
};

const port = process.env.PORT || process.env.NODE_PORT || 3000;
http.createServer(onRequest).listen(port);
