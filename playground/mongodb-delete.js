//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

// deleteMany
// db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result) => {
//   console.log(result);
// });

// deleteOne
// db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
//   console.log(result);
// });

//findOneAndDelete
// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
//   console.log(result);
// });

// deleteMany
// db.collection('Users').deleteMany({name: 'Edward'}).then((result) => {
//   console.log(result);
// });

//findOneAndDelete
db.collection('Users').findOneAndDelete({
  _id : new ObjectID('5ac395bbfaad8b394f700a97')
}).then((result) => {
  console.log(result);
});

  //db.close();
});
