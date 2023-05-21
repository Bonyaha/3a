require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json()) //transforms JSON data of a request into a JavaScript object and then attaches it to the body property of the request object before the route handler is called
app.use(requestLogger)
app.use(express.static('build')) //To make express show static content, the page index.html

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => response.json(notes))
})
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then((note) => response.json(note))
})
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})
app.post('/api/notes', (request, response) => {
  //console.log(request.headers)
  const body = request.body
  //console.log(note)
  if (!body.content) {
    return response.status(400).json({
      error: 'content is missing',
    })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then((savedNote) => response.json(savedNote))
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
