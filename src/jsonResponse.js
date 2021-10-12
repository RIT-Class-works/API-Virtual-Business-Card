const QRCode = require('qrcode');

const userData = {};

const writeResponse = (request, response, statusCode, object) => {
  response.writeHead(statusCode, 'Content-Type: application/json');
  response.write(JSON.stringify(object));
  response.end();
};
const generateQR = (request, response, urlString) => {
  console.log(urlString);
  const opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.3,
    margin: 1,
    color: {
      dark: '#010599FF',
      light: '#FFBF60FF',
    },
  };

  QRCode.toDataURL(urlString, opts, (err, url) => {
    if (err) throw err;
    console.log(url);

    const json = {
      imageSrc: url,
    };
    console.log(`json url: ${json.imageSrc}`);
    writeResponse(request, response, 201, json);
  });
};

const addUser = async (request, response, userParams) => {
  // if missing parameter

  // update exist user

  // create new user

  const id = new Date().getTime();
  console.log(`time: ${id}`);

  userData[id] = {
    firstName: `${userParams.firstName}`,
    lastName: `${userParams.lastName}`,
    email: `${userParams.email}`,
    phone: `${userParams.phone}`,
    title: `${userParams.title}`,
    description: `${userParams.description}`,
    links: null,
  };

  console.log(`link length: ${userParams.linkLength}`);

  if (userParams.linkLength > 0) {
    const linkArray = userParams.links.split(',');
    console.log(linkArray);
    userData[id].links = linkArray;
  }
  console.log(userData[id]);
  generateQR(request, response, `${request.headers.host}/getcard?id=${id}`);
};
const getUser = (id) => {
  if (userData[id]) {
    return userData[id];
  }

  console.log('no user of this id found');
  return null;
};

module.exports = {
  addUser,
  getUser,
};
