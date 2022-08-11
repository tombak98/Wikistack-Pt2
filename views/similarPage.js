const html = require("html-template-tag");
const layout = require("./layout");

module.exports = (page, simPages) => layout(html`
  <h3>Articles similar to ${page.title}</h3>
  <hr>
  <ul class="list-unstyled">
    <ul>
      ${simPages.map(page => html`<li>
        <a href="/wiki/${page.slug}">${page.title}</a>
      </li>`)}
    </ul>
  </ul>
`);
