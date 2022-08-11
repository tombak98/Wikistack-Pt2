const html = require("html-template-tag");
const layout = require("./layout");

module.exports = (pages) => layout(html`
  <h3>Pages</h3>
  <hr>
  <ul class="list-unstyled">
    <ul>
      ${pages.map(page => html`<li><a href="/wiki/${page.slug}">${page.title}</a></li>`)}
    </ul>
  </ul>
  <h3>Search by Tag</h3>
  <hr>
  <form method="GET" action='/wiki/search'>
  <div class="form-group">
      <label for="tag" class="col-sm-2 control-label">Tag</label>
      <div class="col-sm-10">
        <input name="tag" type="text" class="form-control"/>
      </div>
    </div>
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-primary">submit</button>
    </div>
  </form>`);