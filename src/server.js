// create server
// urlstruct for loading index

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
const urlStruct = {

  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getResponse,
    '/notReal': jsonHandler.getResponse,
  },
  POST: {
    '/GenerateQR': postHandler,
  },
  notFound: jsonHandler.getResponse,
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);
  console.log(parsedURL.pathname);
  console.log(request.method);
  if (urlStruct[request.method][parsedURL.pathname]) {
    console.log('Pathname and Handler: Checked');
    urlStruct[request.method][parsedURL.pathname](request, response, parsedURL.pathname);
  } else {
    urlStruct.notFound(request, response, parsedURL.pathname);
  }
};

const port = process.env.PORT || process.env.NODE_PORT || 3000;
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
