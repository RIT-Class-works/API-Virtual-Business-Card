const userData = {};
const writeMetaData = (resquest, response, statusCode) => {
  response.writeHead(statusCode, 'Content-Type: application/json');
  response.end();
};
const writeResponse = (request, response, statusCode, object) => {
  response.writeHead(statusCode, 'Content-Type: application/json');
  response.write(JSON.stringify(object));
  response.end();
};
const addUser = (request, response, userParams) => {
  // if missing parameter

  // update exist user

  // create new user
  userData[userParams.name] = {
    name: `${userParams.name}`,
    title: `${userParams.title}`,
    description: `${userParams.description}`,
    links: null
  };
  console.log(`link length: ${userParams.linkLength}`);

  if (userParams.linkLength > 0) {
    const linkArray = userParams.links.split(',');
    console.log(linkArray);
    userData[userParams.name].links = linkArray;
  }
  console.log(userData[userParams.name]);
  writeResponse(request, response, 201, userData[userParams.name]);
};

// return a javascript obj
const getUsers = () => {
  const users = {
    userData,
  };
  return users;
};
let object;
const getResponse = (request, response, pathName) => {
  switch (pathName) {
    case '/getUsers':
      console.log('Cased Handled: checked');
      object = getUsers();
      writeResponse(request, response, 200, object);
      break;
    default:
      // not real
      object = {
        id: 'NotFound',
        message: 'No resource has been found',
      };
      writeResponse(request, response, 404, object);
      break;
  }
};

const getMetaData = (request, response, pathName) => {
  switch (pathName) {
    case '/getUsers':
      writeMetaData(request, response, 200);
      break;
    case '/notReal':
      writeMetaData(request, response, 404);
      break;
    default:
      console.log('Unexpected Error at Url PathName (metadata)');
      break;
  }
};

module.exports = {
  getResponse,
  getMetaData,
  addUser,

};
