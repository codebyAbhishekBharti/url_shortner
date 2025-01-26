const jwt = require('jsonwebtoken');
const secret = "Abhishek@123"
function setUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
    }
    return jwt.sign(payload,secret);
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token,secret);
    } catch (error) {
        return null;
    }
}

module.exports = {setUser,getUser};