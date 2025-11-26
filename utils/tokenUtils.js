const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
    return jwt.sign(payload , proeccess.env.JWT_ACCESS_SECRET ,{
        expiresIn : process.env.ACCESS_TOKEN_EXPIRES || "50s"
    });
};


const createRefreshToken = (payload) => {
     return jwt.sign(payload , proeccess.env.JWT_REFRESH_SECRET ,{
        expiresIn : process.env.REFRESH_TOKEN_EXPIRES || "6d"
    });
}

const verifyAccessToken = (token) =>{
    return jwt.verify(token,process.env.JWT_ACCESS_SECRET);
};


const verifyRefreshToken = (token) =>{
    return jwt.verify(token,process.env.JWT_REFRESH_SECRET);
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};