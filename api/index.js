const express = require('express');
const bodyParser = require('body-parser');
const api = express.Router();
module.exports = api;

const db = require(`./db-datastore`);

//get database list
api.get('/', async (req, res) => {
  try {
    res.json(await db.list());
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

//get database data
api.get('/:id(\\w+)', async (req, res) => {
  try {
    res.send(await db.get(req.params.id));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

//put data into database
api.put('/:id(\\w+)', bodyParser.text(), async (req, res) => {
  try {
    res.send(await db.put(req.params.id, req.body));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

//post data to database
api.post('/:id(\\w+)', bodyParser.text(), async (req, res) => {
    try {
        res.send(await db.post(req.params.id, req.body));
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

//delete data from database
api.delete('/:id(\\w+)', async (req, res) => {
  try {
    await db.delete(req.params.id, req.body);
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
 }
});
