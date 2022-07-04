//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");

const posts = [];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home", {
    homePosts: posts
  });
});


// home page
app.get("/home", function (req, res) {
  res.redirect("/")
});
// home page end


// about page
app.get("/about", function (req, res) {
  res.render("about");
});
// about page end


// contact page
app.get("/contact", function (req, res) {
  res.render("contact");
});
// contact page end


// compose page
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {
  const post = {
    postTitle: req.body.newTitle,
    postContent: req.body.newPost
  };
  posts.push(post);
  res.redirect("/");
});
// compose page end


// new post page
app.get("/post/:postName", function (req, res) {
  var storedTitle = lodash.lowerCase(req.params.postName);
  posts.forEach(function (everypost) {
    var requestedTitle = lodash.lowerCase(everypost.postTitle);
    if (requestedTitle === storedTitle) {
      res.render("post", {
        postTitle: everypost.postTitle,
        postContent: everypost.postContent,
        readMore: storedTitle
      });
    }
  });
});
// new post page end


// remove post page
app.get("/removePost/:postName", function (req, res) {
  var storedTitle = lodash.lowerCase(req.params.postName);
  for (var i = 0; i <= posts.length; i++) {
    if (lodash.lowerCase(posts[i].postTitle) === storedTitle) {
      posts.splice(i,1);
      res.redirect("/");
    }
    else{
      res.send("not found");
    }
  }
});
// remove post page end



app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
