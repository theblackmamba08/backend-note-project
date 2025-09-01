const express = require('express')
const path = require('path')
require('dotenv').config()
const Note = require('./models/note')



const app = express()
app.use(express.json())
app.use(express.static('dist'))

// --- 2. Logger les requêtes ---
const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
}
app.use(requestLogger)

app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html')); 
});

// --- 4. Routes ---

// GET toutes les notes
app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => res.json(notes))
})

// GET note par ID
app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) res.json(note)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

// POST nouvelle note
app.post('/api/notes', (req, res, next) => {
  const { content, important } = req.body
  const note = new Note({ content, important })
  note.save()
    .then(savedNote => res.json(savedNote))
    .catch(error => next(error))
})

// PUT mise à jour note
app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body
  Note.findById(req.params.id)
    .then(note => {
      if (!note) return res.status(404).end()
      note.content = content
      note.important = important
      return note.save().then(updatedNote => res.json(updatedNote))
    })
    .catch(error => next(error))
}) 

// DELETE note
app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

// --- 5. Middleware pour routes inconnues ---
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// --- 6. Middleware global d’erreurs ---
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  res.status(500).end()
}
app.use(errorHandler)


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});