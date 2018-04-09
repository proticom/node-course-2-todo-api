const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5acbae93966bce511152970f11';
//
// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }


// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

//User.FindByID
var id = '5ac63918253f8afd6320e1d2';

if(ObjectID.isValid(id)) {
    User.find({
      _id: id
    }).then((users) => {
      console.log('Users', JSON.stringify(users, undefined, 2));
    });

    User.findOne({
      _id: id
    }).then((user) => {
      console.log('User', JSON.stringify(user, undefined, 2));
    });

    User.findById(id).then((user) => {
      if (!user) {
        return console.log('Id not found');
      }
      console.log('User By Id', JSON.stringify(user, undefined, 2));
    }).catch((e) => console.log(e));
  } else {
      console.log('ID not valid');
  }
