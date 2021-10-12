const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/filledform.html`);
const css = fs.readFileSync(`${__dirname}/../client/custom.css`);
const background = fs.readFileSync(`${__dirname}/../images/background.png`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getBackground = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(background);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBackground,
};
