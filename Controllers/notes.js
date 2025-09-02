const notesRouter = require('express').Router();
const Note = require('../models/note');

// GET toutes les notes
notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => response.json(notes))
});

// GET note par ID
notesRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) response.json(note)
            else response.status(404).end()
        })
        .catch(error => next(error))
});

// POST nouvelle note
notesRouter.post('/', (request, response, next) => {
    const { content, important } = request.body;
    const note = new Note({ content, important});
    note.save()
        .then(savedNote => response.json(savedNote))
        .catch(error => next(error))
});

// PUT mise à jour note
notesRouter.put('/:id', (request, response, next) => {
    const { content, important } = request.body;
    Note.findById(request.params.id)
        .then(note => {
            if (!note) {
                return response.status(410).json({
                    message: "La note a déjà été supprimée du serveur."
                });
            }
            note.content = content;
            note.important = important;
            return note.save().then(updatedNote => response.json(updatedNote))
        })
        .catch(error => next(error))
});

// DELETE note
notesRouter.delete('/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (!note) {
                return response.status(410).json({
                    message: "La note a déjà été supprimée du serveur."
                });
            }
            return Note.findByIdAndDelete(request.params.id)
                .then(() => response.status(204).end());
        })
        .catch(error => next(error))
});

module.exports = notesRouter;