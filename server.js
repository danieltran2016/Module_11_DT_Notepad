const express = require('express');
const notes = require('./db/db.json');
const path = require('path');
const fs = require('fs');
const util = require('util');
const {v4 : uuidv4} = require('uuid')
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


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

//Function to append some content
const append = (content) => {
            notes.push(content);
            fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
                if (err) {
                  console.error(err);
                }
              });
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
    console.log(text)
    if(req.body){
        const newNote = {
            id: uuidv4(),
            title: title,
            text: text
        };
        append(newNote);
       return res.json(notes);
    } else {
     //   res.error('error')
    }
});

app.delete('/api/notes/:id', (req, res) =>{
    readFileAsync('./db/db.json', 'utf8').then((notes) => {
        let parsedNotes;

        try {
          parsedNotes = [].concat(JSON.parse(notes));
        } catch (err) {
          parsedNotes = [];
        }
        console.log('parsednotes',parsedNotes)
        return parsedNotes;
      }).then((notes) => notes.filter((note) => note.id !== req.params.id))
      .then((filteredNotes) => writeFileAsync('./db/db.json', JSON.stringify(filteredNotes)))
      .then(notes=> res.json(notes))
});


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

