/*
  npm packages
*/
const express = require('express');
const bodyParser = require('body-parser');
const api = express();
module.exports = api;

//Google authentication with simple-google-openid.
const googleauth = require('simple-google-openid');
api.use(googleauth("562468116276-b6cal6rfdkjsm8r92butjr9jdmvi46s4.apps.googleusercontent.com"));
api.use(googleauth.guardMiddleware({realm: 'jwt'}));

//json array of users.
let users=[{
  "email": "robstow94@gmail.com", "roles": ["user", "admin"]
}];

/*
  User Functions
*/

//Gets a random number if the user is authorised by the admin.
api.get('/random', async (req, res) => {
  try {
    res.set('Content-Type', 'text/plain');
    if (checkUser(req) == false){
      res.sendStatus(403);
    } else {
      res.send(await Math.random().toString());
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
  }
});

//Shows the logged in user their role. If they are not a user it will show "none".
api.get('/user/roles', async (req, res) => {
  try {
    const role = users.find((user) => {return user.email == req.user.emails[0].value; });
    res.set('Content-Type', 'application/json');
    res.send(role? role.roles: []);
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
  }
});

//Allows the user to request authorization. If they're already a user, return an error
api.post('/user/request', async (req, res) => {
  try {
    if (checkUser(req) == true){
      res.sendStatus(422);
    } else {
      const userEmail = req.user.emails[0].value;
      const userObj = {"email": userEmail, "roles": []};
      users.push(userObj);
      res.sendStatus(202);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
  }
});

/*
  Admin Functions
*/

//Lists the users who wish to be authorised.
api.get('/user/request', async (req, res) => {
  try {
    if (checkAdmin(req) == false){
      res.sendStatus(403);
    } else {
      let x = [];
      const emails = users.filter((user) => { if(!user.roles.includes('user')) {x.push(user.email)} });
      res.json(x);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
  }
});

//Lists all authorised and unauthorised users
api.get('/users', async (req, res) => {
  try {
    if (checkAdmin(req) == false) {
      res.sendStatus(403);
    } else {
      let x = [];
      const emails = users.filter((user) => { x.push(user) });
      res.json(x);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
  }
});

//Approves unauthorised users
api.post('/user/approve', bodyParser.text(), async (req, res) => {
  try {
    if (checkAdmin(req) == false) {
      res.sendStatus(403);
    } else {
      let userObj = users.find((user) => { return user.email == req.body});
      userObj.roles = ['user'];
      res.send(userObj);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
  }
});

//Deletes a user
api.delete('/user/:id', async (req, res) => {
  try {
    if (checkAdmin(req) == false) {
      res.sendStatus(403);
    } else {
      users = users.filter((user) => { return user.email !== req.params.id; });
      res.sendStatus(204);
    }
  } catch (e){
    console.error(e);
    res.sendStatus(401);
  }
});

/*
  Authorization Functions
*/

//Is the user an authorised user?
function checkUser(req) {
  const currentUser = users.find((user) => {return user.email == req.user.emails[0].value; });
  if (typeof currentUser === 'undefined' || !currentUser.roles.includes('user')){
    return false;
  } else {
    return true;
  }
};

//Is the authorised user an admin?
function checkAdmin(req) {
  const currentUser = users.find((user) => {return user.email == req.user.emails[0].value; });
  if (typeof currentUser === 'undefined' || !currentUser.roles.includes('admin')){
    return false;
  } else {
    return true;
  }
};
