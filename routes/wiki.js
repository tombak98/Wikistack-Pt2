const express = require("express");
const router = express.Router();
const { db, Page, User, Tag } = require("../models");
const { main, addPage, editPage, wikiPage, notFoundPage } = require("../views");
const searchList = require("../views/searchList.js")
const similarPage = require("../views/similarPage.js")

// GET /wiki
router.get("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) {
    next(error);
  }
});

// POST /wiki
router.post("/", async (req, res, next) => {
  try {
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });

    const page = await Page.create(req.body);

    await page.setAuthor(user);

    let tagArray = req.body.tags.split(" ")
    tagArray.forEach(async function(element) {
      const [tag, wasCreated] = await Tag.findOrCreate({
        where: {
          name: element
        }
      })
      await page.addTag(tag)
    })

    res.redirect("/wiki/" + page.slug);
  } catch (error) {
    next(error);
  }
});

// POST /wiki/:slug
router.put("/:slug", async (req, res, next) => {
  try {
    const [updatedRowCount, updatedPages] = await Page.update(req.body, {
      where: {
        slug: req.params.slug
      },
      returning: true
    });

    res.redirect("/wiki/" + updatedPages[0].slug);
  } catch (error) {
    next(error);
  }
});

// DELETE /wiki/:slug
router.delete("/:slug", async (req, res, next) => {
  try {
    await Page.destroy({
      where: {
        slug: req.params.slug
      }
    });

    res.redirect("/wiki");
  } catch (error) {
    next(error);
  }
});

// GET /wiki/add
router.get("/add", (req, res) => {
  res.send(addPage());
});

// GET /wiki/search
router.get("/search", async (req,res,next) => {
  let tagName = req.query.tag
  try {
    const tag = await Tag.findOne({
      where: {
        name: tagName
      },
      include: {
        model: Page
      }
    })
    res.send(searchList(tag, tag.pages))
  } catch (error) {
    next(error)
  }
})

// GET /wiki/:slug
router.get("/:slug", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      },
      include: {
        model: User,
        as: 'author'
      }
    });
    const tags = await page.getTags()
    if (page === null) {
      res.status(404).send(notFoundPage())
    } else {
      // const author = await page.getAuthor();
      res.send(wikiPage(page, page.author, tags));
    }
  } catch (error) {
    next(error);
  }
});

// GET /wiki/:slug/similar
router.get('/:slug/similar', async (req,res,next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      },
      include: {
        model: Tag
      }
    })
    let tagNames = [];
    for (let i = 0; i < page.tags.length; i++) {
      tagNames.push(page.tags[i].name)
    }
    let similarPages = await page.findSimilar(tagNames)
    res.send(similarPage(page, similarPages))
  } catch(error) {
    next(error)
  }
})

// GET /wiki/:slug/edit
router.get("/:slug/edit", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    if (page === null) {
      res.sendStatus(404);
    } else {
      const author = await page.getAuthor();
      res.send(editPage(page, author));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
