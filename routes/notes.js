const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const db = require('../db/db.json');
const path = require("path");

notes.get('/notes', (req, res) => res.status(200).send(db));

notes.post('/notes', (req, res) => {
    const body = req.body;
    console.log(body);
    if (!body.text || !body.title) return res.status(400);

    const record = {
        id: uuidv4(),
        title: body.title,
        text: body.text
    };

    db.unshift(record);
    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(db), (err) => (err) ? console.error(err) : console.log('File written successfully'));

    return res.status(201).send(record);
});

notes.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400);

    const index = db.findIndex(note => note.id === id);
    if (index === -1) return res.status(204);

    db.splice(index, 1);
    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(db), (err) => (err) ? console.error(err) : console.log('File written successfully'));

    return res.status(200).send(db);
});

module.exports = notes;