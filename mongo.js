const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Roman:${password}@cluster1.d7mltpu.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'GET and POST are the most important methods of HTTP protocol',
  important: true,
})

note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})
/* Note.find({}).then((result) => {
  result.forEach((i) => console.log(i))
  mongoose.connection.close()
}) */
