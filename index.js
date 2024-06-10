const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
app = express()


app.use(express.json())
app.use(cors())

morgan.token('id', (req,res,next) =>{
    const par = Number(req.params.id)
    let filter = persons.filter(person => person.id === par)
    const clean = {
        name:filter[0].name,
        number:filter[0].number
    }

    return JSON.stringify(clean)
})

let persons = [
        { 
          "id": 1,
          "name": "Arto Hellas", 
          "number": "040-123456"
        },
        { 
          "id": 2,
          "name": "Ada Lovelace", 
          "number": "39-44-5323523"
        },
        { 
          "id": 3,
          "name": "Dan Abramov", 
          "number": "12-43-234345"
        },
        { 
          "id": 4,
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122"
        },
        { 
        "id": 4,
        "name": "Basleal Aklilu", 
        "number": "+39-23-6423122"
        }
    ]


app.get('/api/persons',(req,res) =>{
    res.send(persons)
})


app.get('/info',(req,res) =>{
    res.send(
        `<div> 
            <p>persons has ${persons.length} numbers <p>
            <p>${new Date(0).toString()}</p>
        </div>`
    )
})

app.get('/api/persons/:id',morgan(':method :url :status :res[content-length] - :response-time ms :id'),(req,res) =>{
    const par = Number(req.params.id)
    let filter = persons.filter(person => person.id === par)
    if(filter.length > 0){
        res.send(filter)
    }
    else{
        res.status(400).end()
    }



})

app.delete('/api/persons/:id',(req,res) =>{
    persons = persons.filter(person => person.id !== +req.params.id)
    res.send(persons)
})

const generateId = () =>{
    const maxId = persons.length > 0 ?
                Math.max(...persons.map(p => p.id))
                : 0
    return maxId + 1
}
app.post('/api/persons',(req,res) =>{
    const newData = req.body
    if (!newData | !newData.name | !newData.number){
        return res.status(400).json({
            error:"Please enter valid data"
        })
    }

    content = { 
        "id": generateId(),
        "name": newData.name, 
        "number": newData.number  
    }

    persons = persons.concat(content)

    res.send(persons)
})


const PORT = process.env.PORT || 3001
app.listen(PORT,() =>{
    console.log('Listening on PORT 8000')
})