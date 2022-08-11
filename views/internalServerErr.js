const html = require("html-template-tag");
const layout = require("./layout");

module.exports = (err) => layout(html`
  <h1>Internal Server Error: 500</h1>
  <h2>${err.message}</h2>
  <a href="/wiki">Back to Homepage</a>
`);