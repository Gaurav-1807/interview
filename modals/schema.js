const moongose = require("mongoose")

const userschema = new moongose.Schema({
    username: String,
    email: String,
    password: String,
},
{
  timestamps: true
})

const user = moongose.model("users", userschema)

const Task = new moongose.Schema({
    Title: String,
    Body: String,
    CreatedBy: String,
    Active_Inactive: Boolean,
    Geolocation: {
        latitude:String,
      longitude: String
    }
},
{
  timestamps: true
})

const taskSchema = moongose.model("task",Task)
module.exports = { user , taskSchema}