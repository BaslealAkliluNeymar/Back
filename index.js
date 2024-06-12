require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const phoneModel = require('./phone')
app = express()

app.use(express.json())
app.use(cors())

// morgan.token('id', (req,res,next) =>{
    
//     // let filter = persons.filter(person => person.id === par)
//     if(req.params){
//         const filter = phoneModel.find({_id:req.params.id})
//         .then(data =>{
//             return data
//         })
//         const clean = {
//             name:filter.name,
//             number:filter.number
//         }
    
//         return JSON.stringify(clean)
//     }
//     else{
//         next()
//     }
// })

app.get('/api/persons',(req,res,next) =>{
    phoneModel
    .find({})
    .then(data =>{
        res.json(data)
    })
})


app.get('/info',(req,res,next) =>{
   let long = phoneModel.find({})
        .then(data =>{
            return data.length
        })
    res.send(
        `<div> 
            <p>persons has ${long} numbers <p>
            <p>${new Date(0).toString()}</p>
        </div>`
    )
})

app.get('/api/persons/:id'/*morgan(':method :url :status :res[content-length] - :response-time ms :id')*/,(req,res,next) =>{
    // console.log(req.params.id)
    phoneModel.find({_id:req.params.id})
            .then(data =>{
                if(data){
                    res.json(data)
                }
                else{
                    res.status(404).end()
                }
            })
            .catch(err => next(err))
    
})

app.delete('/api/persons/:id',(req,res,next) =>{

    phoneModel.findByIdAndDelete(req.params.id)
                .then(data =>{
                    console.log(data)
                    res.send(204).end()
                })
                .catch(error =>{
                    console.log('Okay then')
                })
    // persons = persons.filter(person => person.id !== +req.params.id)
    // res.send(persons)
})


app.put('/api/persons/:id',(req,res,next) =>{
    const newData = req.body

    const content = {
        name : newData.name,
        number : newData.number
    }


    phoneModel
    .findByIdAndUpdate(req.params.id,content, {new:true,runValidators:true,context:'query'})
    .then(data =>{
        res.json(data)
    })
    .catch(err => console.log(err))
})
const generateId = () =>{
    let datas = phoneModel.find({})
            .then((data) =>{
                return data
            })
    let arr = [] 
    arr.push(datas)   
    const maxId = arr.length > 0 ?
                Math.max(...arr.map(p => p.id))
                : 0
    return maxId + 1
}


app.post('/api/persons',async (req,res ,next) =>{
    const {name,number} = req.body

    if ( !name || !number){
        return res.status(400).send({
            error:"Please enter valid data"
        })
    }

    const newContact = new phoneModel({ name, number });

    try{
        const savedContact = await newContact.save();
        res.json(savedContact)
    }
    catch(error){
        res.status(400).send(error.errors.name.message);
    }
})

const unknownPages = (req,res,next) =>{
    res.status(404).send({message:"Unknown!"})
}


app.use(unknownPages)
const errorHandler = (error, req, res,next) =>{
    if (error.name === "CastError"){
        res.status(404).send({
            message:"Error Properly Handled!"
        })
    }
    else if(error.name === "ValidatorError"){
        res.status(404).send({
            message:error.name
        })
    }
    // next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT,() =>{
    console.log('Listening on PORT 3001')
})