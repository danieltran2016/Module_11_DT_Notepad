const express = require('express');
const notes = require('./db/db.json');
const path = require('path');
const fs = require('fs');
const util = require('util');

const PORT = 3001;
const app = express();


//middleware for parsing json and url from the data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//GET homepage
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//GEt route notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

//Function to read data from a given a file and append some content
const readAndAppend = (content) => {
            notes.push(content);
            writeToFile(file, notes);
        }

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request receieved for notes`);
    res.json(notes);

});
console.log(notes);

//POST route for new note
app.post('/api/notes', (req, res) =>{
    console.info(`${req.method} request recieved to make new note`);
    const {title, text} = req.body;
    console.log(title);
    if(req.body){
        const newNote = {
            title: title,
            text: text
        };
        readAndAppend(newNote);
        res.json('note added');
    } else {
        res.error('error')
    }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

