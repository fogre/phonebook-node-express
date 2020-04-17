const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const persons = require('./persons.js')

const app = express()
let phonebook = persons.persons

morgan.token('postReq', (req, res) => {
	if (req.body.name) return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :postReq')
)

app.get('/', (req, res) => {
  res.send('<h1>Go to /api/persons to view the phonebook</h1>')
})

app.get('/api/info', (req, res) => {
	const count = phonebook.length
	const date = new Date()
	res.send(`<p>Phonebook has ${count} persons information<p><br/>${date}`)
	res.send(date)
})

app.get('/api/persons', (req, res) => {
	res.json(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = phonebook.find(pers => pers.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => { 
	const id = Number(req.params.id)
	phonebook = phonebook.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  
  if (!person.name )
    return res.status(400).json({
    	error: 'name is required'
    })

  if (!person.number) 
    return res.status(400).json({
    	error: 'number is required'
    })

  if (phonebook.some(pers => pers.name === person.name))
  	return res.status(400).json({
    	error: `${person.name} already exists`
    })
 
	const maxId = phonebook.length
    ? Math.max(...phonebook.map(n => n.id))
    : 0
  person.id = Number(maxId)+1
  res.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint);

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})