require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');
const{SHA256} = require('crypto-js');

var {mongoose} = require('./db/mongoose');
var{Todo} = require('./models/todo');
var{User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT


app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

//get /todos/12345
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id
  // Valid id using isValid
  if(!ObjectID.isValid(id)) {
      // 404 - send back empty
      res.status(404).send();
    } else {
      // FindByID
      Todo.findOne({
        _id: id,
        _creator: req.user._id
      }).then((todo) => {
        if (todo) {
          //if todo - send it back
          res.status(200).send({todo})
        } else {
          //if no todo - send back 404 with empty body
          res.status(404).send()
        }
      }).catch((e) => res.status(400).send());
    }
});

// //delete /todos/12345
// app.delete('/todos/:id', authenticate, (req, res) => {
//   // get the id
//   var id = req.params.id
//
//   // validate the id -> not valid? return 404
//   if(!ObjectID.isValid(id)) {
//       // 404 - send back empty
//       res.status(404).send();
//     } else {
//       // FindByID
//       Todo.findOneAndRemove({
//         _id: id,
//         _creator: req.user._id
//       }).then((todo) => {
//         if (todo) {
//           //if todo - send it back
//           res.status(200).send({todo})
//         } else {
//           //if no todo - send back 404 with empty body
//           res.status(404).send()
//         }
//       }).catch((e) => res.status(400).send());
//     }
// });

//Async version of the above
app.delete('/todos/:id', authenticate, async (req, res) => {
  // get the id
  const id = req.params.id

  // validate the id -> not valid? return 404
  if(!ObjectID.isValid(id)) {
      // 404 - send back empty
      return res.status(404).send();
  }

  try {
    // FindByID
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (todo) {
      //if todo - send it back
      res.status(200).send({todo})
    } else {
      //if no todo - send back 404 with empty body
      res.status(404).send()
    }
  } catch (e) {
    res.status(400).send()
  }
});


app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text','completed']);

  if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.comleted = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email','password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
  // var body = _.pick(req.body, ['email','password']);
  // var user = new User(body);
  //
  // user.save().then(() => {
  //   return user.generateAuthToken();
  // }).then((token) => {
  //   res.header('x-auth', token).send(user);
  // }).catch((e) => {
  //   res.status(400).send(e);
  // })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  await req.user.removeToken(req.token);
  try {
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
