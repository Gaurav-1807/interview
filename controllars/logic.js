
const jwt = require('jsonwebtoken');
const joi = require("joi")
const bcrypt = require('bcrypt');
const { user, taskSchema } = require('../modals/schema');
const { resolveSoa } = require('dns');

const joivalidation = joi.object({
    username: joi.string().min(5).max(15).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(1660).required()
})

const taskvalidation = joi.object({
    Title: joi.string().min(5).max(15).required(),
    Body: joi.string().min(10).max(350).required(),
    CreatedBy: joi.string().email().required(),
    Active_Inactive: joi.boolean().required(),
    Geolocation: {
        latitude: joi.string().required(),
        longitude: joi.string().required()
    }
})
const signup = async (req, res) => {
    let { username, password, email, role } = req.body
    const { error, value } = joivalidation.validate(req.body)
    let users = await user.findOne({ email: email })

    if (error) {
        res.send(error.message)
    }
    else {
        if (users) {

            res.send(`Account already exists with :   ${users.email}`)
        }
        else {
            bcrypt.hash(password, 5, async (err, hash) => {
                let data = await user.create({
                    username: username,
                    email: email,
                    password: hash,
                })


                res.send(`Account created successfully  ${data} `)
            })


        }
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        user.findOne({ email }).then(user => {
            if (!user) {
                return res.status(404).json({ email: 'User not found' });
            }

            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {


                    let token = jwt.sign(user.email, "token")
                    res.send(`login successfully : ${user},Token : ${token}`)
                } else {
                    return res.status(400).json({ password: 'Password incorrect' });
                }
            });
        });
    }
    catch (err) { res.send(err.message) }
}


const addtask = async (req, res) => {

    try {
        const { error, value } = taskvalidation.validate(req.body)
        if (error) {
            res.send(error.message)
        }
        const newPost = new taskSchema({
            Title: req.body.Title,
            Body: req.body.Body,
            CreatedBy: req.body.CreatedBy,
            Active_Inactive: req.body.Active_Inactive,
            Geolocation: {
                latitude: req.body.Geolocation.latitude,
                longitude: req.body.Geolocation.longitude
            }
        });

        newPost.save().then(post => res.json(post)).catch(err => console.log(err));
    }
    catch (err) { res.send(err.message) }
}

const gettask = async (req, res) => {
    const data = await taskSchema.find({ CreatedBy: req.body.CreatedBy })
    res.send(data)
}

const updateTask = async (req, res) => {
    const data = await taskSchema.findByIdAndUpdate({ _id: req.params.id }, {
        Title: req.body.Title,
        Body: req.body.Body,
        CreatedBy: req.body.CreatedBy,
        Active_Inactive: req.body.Active_Inactive,
        Geolocation: {
            type: "Point", // Assuming you're storing Point type coordinates
            coordinates: [parseFloat(req.body.Geolocation.longitude), parseFloat(req.body.Geolocation.latitude)]
        }

    })
    res.send("update successfully " )
}

const deletetask = async (req, res) => {
    const data = await taskSchema.findByIdAndDelete({ _id: req.params.id })
    if (!data) {
        res.send("Task not found")
    }
    res.send("deleted successfully")

}
const retrivetask = async (req, res) => {
    const { latitude, longitude } = req.body;
    const maxDistance = 1000; // in meters

    taskSchema.find({
        Geolocation: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                $maxDistance: maxDistance
            }
        }
    }).then(posts => res.json(posts)).catch(err => console.log(err));
}

const activetask = async (req, res) => {
  
        taskSchema.aggregate([
            {
                $group: {
                    _id: "$Active_Inactive",
                    count: { $sum: 1 }
                }
            }
        ]).then(result => {
            const counts = {
                active: 0,
                inactive: 0
            };
    
            result.forEach(doc => {
                if (doc._id === true) {
                    counts.active = doc.count;
                } else {
                    counts.inactive = doc.count;
                }
            });
    
            console.log("Active posts count:", counts.active);
            console.log("Inactive posts count:", counts.inactive);
    
            
            res.send(counts);
        }).catch(err => {
            console.error(err);
            res.status(500).send("An error occurred");
        });
    }


module.exports = { signup, login, addtask, gettask, updateTask, deletetask  , retrivetask , activetask}