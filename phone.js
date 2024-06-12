require("dotenv").config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)


mongoose.connect(url)
        .then(() =>{
            console.log('Connecting to Mongo')
        })
        .catch(() =>{
            console.log('Connection Failed')
        })


const personSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        required:true
    },
    number:{
        type:String,
        required:true,
        maxLength:15,
        minLength:13,
        validate:{
            validator: function (v){
                return /^\+\d{3}-\d{3}-\d{6}/.test(v)
            }
        }
    }

})

const phoneModel = mongoose.model('PhoneNumber',personSchema)


module.exports = phoneModel