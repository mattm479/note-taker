const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const db = require('../db/db.json');

// Route to retrieve all notes from database
notes.get('/notes', (req, res) => res.status(200).json(db));

// Route to add a new note to the database
notes.post('/notes', (req, res) => {
    // Check we have required fields to make new note
    if (!req.body.title || !req.body.text) return res.status(400).json('Title and Text are required');

    // Create note
    const note = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text
    };

    // Ensure note was added to database
    const currentLength = db.length;
    const newLength = db.unshift(note);
    if (currentLength + 1 !== newLength) return res.status(500).json('Unable to write note to database. Please try again.');

    // Write the database to file
    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(db), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json('Unable to write note to database. Please try again.');
        }

        return res.status(201).json(note);
    });
});

// Route to delete a note from the database
notes.delete('/notes/:id', (req, res) => {
    // Check the id to be deleted was sent
    if (!req.params.id) return res.status(400).json('Missing Id');

    // Ensure id exists in the database
    const index = db.findIndex(note => note.id === req.params.id);
    if (index === -1) return res.status(400).json('Invalid Id');

    // Ensure note was deleted from the database
    const deleted = db.splice(index, 1);
    if (deleted.length !== 1) return res.status(500).json('Unable to delete note from database. Please try again.');

    // Write the database to file
    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(db), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json('Unable to delete note from database. Please try again.');
        }

        return res.status(200).json(db);
    });
});

module.exports = notes;