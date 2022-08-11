const html = require("html-template-tag");
const layout = require("./layout");

module.exports = (tag, pages) => layout(html`
  <h3>Articles with ${tag.name}</h3>
  <hr>
  <ul class="list-unstyled">
    <ul>
      ${pages.map(page => html`<li>
        <a href="/wiki/${page.slug}">${page.title}</a>
      </li>`)}
    </ul>
  </ul>
`);
