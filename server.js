const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");

const app = express();

app.use(express.urlencoded({ extended: false }));

// ----CONNECTING THE DATABASE
mongoose.connect("mongodb://localhost/Urlshortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// SETTING THE TEMPLATING ENGINE
app.set("view engine", "ejs");

// desc - Render the index.ejs file
// route - /
app.get("/", async (req, res) => {
  const allUrls = await shortUrl.find();
  res.render("index", {
    allUrls: allUrls,
  });
});

// desc - post request of the form
// route - /shortUrls
app.post("/shortUrls", async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

// desc - to redirect the user to the original url
// route - /:shortUrl
app.get("/:shortUrl", async (req, res) => {
  const yourUrl = await shortUrl.findOne({ short: req.params.shortUrl });
  if (yourUrl == null) return res.sendStatus(404);
  yourUrl.clicks++;
  yourUrl.save();
  res.redirect(yourUrl.full);
});

// Initialising the Port
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is up and running at 5000");
});
