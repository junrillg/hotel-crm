const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-uxtqg.mongodb.net/${process.env.DB_NAME}?retryWrites=true`)
.then(() => {
  console.log('Connected to database!')
})
.catch(() => {
  console.log('Connection Failed!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req,res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
      res.status(201).json({
        message: 'Post added successfully!',
        postId: createdPost._id
      });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(posts => {
       res.status(200).json({
         message: 'Posts fetched successfully',
         posts
       });
    })
    .catch(err => console.error(err));
});

app.delete('/api/posts/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then(result => {
      res.status(200).json({
        message: 'Post deleted!'
      });
  });

});

module.exports = app;