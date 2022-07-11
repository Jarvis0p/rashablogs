//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const lodash = require("lodash");

const posts = [];
const app = express();

var id = 0;



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));



// mongoose connection
mongoose.connect("mongodb+srv://jarvis0p:jarvis0p@cluster0.kzpyaio.mongodb.net/blogDB", {
  useNewUrlParser: true
});

// Schema
const blogSchema = {
  title: String,
  post: String
};

// model
const Blog = mongoose.model("Blog", blogSchema);



app.get("/", function (req, res) {
  Blog.find({}, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        homePosts: results
      });
    }
  })

});


// home page
app.get("/home", function (req, res) {
  res.redirect("/");
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
  const post = new Blog({
    title: req.body.newTitle,
    post: req.body.newPost
  });
  post.save();
  res.redirect("/");
});
// compose page end


// new post page
app.get("/post/:postName", function (req, res) {
  var storedTitle = lodash.lowerCase(req.params.postName);
  Blog.find({}, function (err, results) {
    results.forEach(function (everypost) {
      var requestedTitle = lodash.lowerCase(everypost.title);
      if (requestedTitle === storedTitle) {
        res.render("post", {
          postTitle: everypost.title,
          postContent: everypost.post,
          readMore: storedTitle
        });
      }
    });
  });
});
// new post page end


// remove post page
app.get("/removePost/:postName", function (req, res) {
  console.log(id);
  var storedTitle = lodash.lowerCase(req.params.postName);
  Blog.find({}, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      for(var i = 0; i < results.length; i++) {
        if (lodash.lowerCase(results[i].title) === storedTitle) {
          id = results[i]._id;
          if(!(id === 0)) {
            Blog.findByIdAndRemove(id, function (err) {
              console.log("Passed ID" + id);
              if (err) {
                console.log(err);
              } else {
                console.log("success");
              }
              id = 0;
              res.redirect("/");
            });
          }
          break;
        }
        else{
          res.send("not found")
        }
      }
    }
  });

//   
});
// remove post page end



app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
