const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (req, res, next) => {
	Person.find({}).then(persons => {
    res.json(persons)
  })
})

personsRouter.get('/:id', (req, res, next) => {
	Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }  
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (req, res, next) => { 
	Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.post('/', (req, res, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

personsRouter.put('/:id', (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, {new : true})
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

module.exports = personsRouter