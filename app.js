// import required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// initialize the app
const app = express();
app.set("engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
dotenv.config();

// connect mongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qm4gv.mongodb.net/wikiDB?retryWrites=true&w=majority`);

// create a schema for blog articles
const articlesSchema = mongoose.Schema({
  title: String,
  content: String
});
// create a model for the schema
const Article = mongoose.model("Article", articlesSchema);


// articles route
app.route("/articles")

// get route
.get(function(req, res) {
  // get all the values.
  Article.find({}, function(err, foundList) {
    if (err) {
      res.send(err);
    } else {
      res.send(foundList);
    }
  });
})

// post route
.post(function(req, res) {
  // create new article
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  // save the article
  newArticle.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully added the article!!");
    }
  });
})

// delete route
.delete(function(req, res) {
  // delete all the elements
  Article.deleteMany(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Successfully deleted all the articles!!");
    }
  });
});


// specific articles route
app.route("/articles/:title")
// get route

.get(function(req, res) {
  Article.findOne({title: req.params.title}, function(err, foundList) {
    if (err) {
      res.send(err);
    } else {
      res.send(foundList);
    }
  });
})

// put route
.put(function(req, res) {
  Article.update({title: req.params.title}, {title: req.body.title, content: req.body.content}, {overwrite: true}, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully updated the article!!");
    }
  });
})

// patch route
.patch(function(req, res) {
  Article.update({title: req.params.title}, {$set: req.body}, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully updated the article!!");
    }
  });
})

// delete route
.delete(function(req, res) {
  Article.deleteOne({title: req.params.title}, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Successfully deleted the article!!");
    }
  });
});


// host the app
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});