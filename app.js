//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://shaheershakir22:OqA9VcNYxTU9u4Av@cluster0.tisxvbv.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true
})
// .then(() => {
//   console.log("atlas is connected")
// })
// .catch(err => console.log(err))

if (mongoose.connection.readyState === 1) {
  console.log('Mongoose is connected');
} else {
  console.log('Mongoose is not connected');
}

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////////////////////Requests Targetting all Articles////////////////////////////////////////////


app.get("/articles", function(req, res){
  Article.find({})
  .then (foundArticles => {
    res.send(foundArticles);
  })
  .catch(function(err){
    console.log(err);
  }
  )
});

app.post("/articles", (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })
  newArticle.save()
  .then(() => {
    console.log("sucessfullul added");
    es.send("Article added successfully");
  }).catch((err) => {
    console.log(err);
    res.status(400).send("unable to save to database");
  })
})

app.delete("/articles", (req, res) => {
  Article.deleteMany({})
  .then(() => {
    console.log("deleted all articles");
    res.send("deleted all articles");
  })
  .catch((err) => {
    console.log(err);
    res.status(400).send("unable to delete all articles");
  })
})

/////////////////////////////////////////////////////Requests Targetting A Specific Articles////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get((req, res) => {
  Article.findOne({title: req.params.articleTitle})
  .then(foundArticle => {
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found");
    }
  });
})
.put((req, res) => {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true}
  )
  .then(() => {
    res.send("successfully updated article");
  })
  .catch((err) => {
    console.log(err);
    res.status(400).send("unable to update article");
  })
})
.patch((req, res) => {
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body}
  )
})
.then(() => {
  res.send("successfully updated article");
})
.catch((err) => {
  console.log(err);
  res.status(400).send("unable to update article");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});