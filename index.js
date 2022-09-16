const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('build'))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body-content'))

morgan.token('body-content', function(req, res) {
  return JSON.stringify(req.body)
})

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-23456",
  },
  {
    id: 2,
    name: "Ada Lovelance",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  let resLineOne = '<p>phonebook has info for '+ persons.length +' people</p>'
  let resLineTwo = new Date().toLocaleString()
  
  response.send(resLineOne + resLineTwo)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  let checkName = persons.find(p => p.name === body.name)
  if (checkName) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * (500000 - 5) + 5),
  }

  persons = persons.concat(person)

  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})