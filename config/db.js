const mongoose = require('mongoose')

const connect =async()=>{
    await mongoose.connect(`mongodb+srv://gauravambaliya77:gaurav@cluster0.6hcuzhv.mongodb.net/Users`)
    console.log("Connect to MongoDB")
}

module.exports = connect