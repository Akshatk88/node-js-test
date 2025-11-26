const {verifyAccessToken} = require("../utils/tokenUtils");

const authMiddleware  (req , res, next) =>{
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({message: "Authorization missing"})

    const token = header.split(" ")[1];
    if(!token) return res.status(401).json({message:"token missing"})

    try{
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    }catch (err){
        return res.status(401).json({message:"invalid or expired token"})
    }
};

module.exports = authMiddleware;