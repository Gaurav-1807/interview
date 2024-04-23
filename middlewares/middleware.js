const jwt = require("jsonwebtoken")
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.sendStatus(401);
    }
    else{
        const decoded = jwt.verify(token,"token")
        const {CreatedBy}= req.body;
        if(decoded === CreatedBy){
            next()
        }
        else{
            res.send("unautorized token")
        }
    }
    
};

module.exports = authenticateJWT;