const express = require('express')
const path = require('path');
const app = express()

app.use(express.static('dist'))

let notes = [
	{
		id: 1,
		content: "HTML is easy",
		date: "2022-05-30T17:30:31.098Z",
		important: true
	},
	{
		id: 2,
		content: "Browser can execute only Javascript",
		date: "2022-05-30T18:39:34.091Z",
		important: false
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2022-05-30T19:20:14.298Z",
		important: true
	}
];

app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html')); 
});

app.get('/api/notes', (request, response) => {
    response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
};
app.post('/api/notes', express.json(), (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({ 
            error: 'content missing' 
        });
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date().toISOString(),
        id: generateId(),
    };

    notes = notes.concat(note);

    response.status(201).json(note);
});

app.put('/api/notes/:id', express.json(), (request, response) => {
    const id = Number(request.params.id);
    const body = request.body;
    const note = notes.find(note => note.id === id);
    if (!note) {
        return response.status(404).json({ 
            error: 'note not found' 
        });
    }
    const updatedNote = { ...note, ...body };
    notes = notes.map(n => n.id !== id ? n : updatedNote);
    response.json(updatedNote);
});   

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const noteExists = notes.some(note => note.id === id);
    if (!noteExists) {
        return response.status(410).json({
            message: "L'élément a déjà été supprimé du serveur."
        });
    }
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
});


const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);