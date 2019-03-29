//jshint eversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require("mongoose");
const lowerCase = require('lodash.lowercase');

const app = express();


const homeStartingContent = "To add new post click on Compose link.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');
// mongoose.connect("mongodb+srv://admin-ilia:Admin123@cluster0-p6buz.mongodb.net/blogDB", {
//     useNewUrlParser: true
// });

mongoose.connect("mongodb://localhost:27017/blogDB", {
    useNewUrlParser: true
});

const postSchema = {
    title:String,
    post: String
};

const Post = mongoose.model("Post", postSchema);
const List = {
    posts: postSchema
};

const defaultPost = new Post ({
    title: "Instructions",
});

app.get("/", function (req, res) {
    Post.find({}, function (err, foundPost) {
        console.log(foundPost);
        res.render("home", {
            homeContent: homeStartingContent,
            postsArr: foundPost
        });
    });

});

app.get("/about", function (req, res) {
    res.render("about", {
        aboutContents: aboutContent
    });
});

app.get("/contact", function (req, res) {
    res.render("contact", {
        contactContents: contactContent
    });
});

app.get("/compose", function (req, res) {
    res.render("compose");
});

app.get("/posts/:posttitle", function (req, res) {
    var requestedName = req.params.posttitle;
    // var postToLowerCase = _.lowerCase(requestedName);

    Post.findOne({ _id: requestedName }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result) {
                res.render("post", {
                    foundPostTitle: result.title,
                    foundPostBody: result.post
                });
            }
        }
    });
  });

app.post("/compose", function (req, res) {
     const newPost = new Post ({
        title: req.body.titleName,
         post: req.body.postText
    });
    newPost.save();
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("server started");
});