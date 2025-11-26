const bcrypt = require('bcrypt');
const User = require("../models/User");

const {
    createAccessToken,
    createRefreshToken,
    verifyRefreshToken,
} = require('../utils/tokenUtils');
const { use } = require('react');


exports.register = async (req,res) => {
    try{
        const {name, email, password} = req.body;
        
        if(!name || !email|| !password)
            return res.status(400).json({message:"Name, email are required"});

        const existing  = await userInfo.findOne({email});
        if (existing) return res.status(400).json({message:"email is already in use"});

        const salt = await bcrypt.genSalt(8);
        const hashed  = await bcrypt.hash(password,salt);

        const user = await User.create({
            name,
            email,
            password: hashed
        });

        return res.status(201).json({message:"user registered",user: {id: user._id, name : user.name , email : user.email}});
    }  catch (err){
        return res.status(500).json({message:"server error"});
    }
};


exports.login = async (req,res) =>{
try{
    const {email, password} = req.body;
    
    const user  = await user.findOne({email});
    if (!user) return res.status(401).json({message:"invalid details"});


    const match  = await bcrypt.compare(password,user.password);
    if (!ismatch) return res.status(401).json({message:"invalid details"});


    const payload = { id : user._id, email : use.email};

    const accessToken = createAccessToken(payload);
    const refreshToken = refreshToken(payload);

    user.refreshToken = refreshToken ;
    await user.save ();

    return res.json({
        accessToken,
        refreshToken,
        expiresIn: proccess.env.ACCESS_TOKEN_EXPIRES || "50s"
    });
} 
catch(err){
    console.log(err);
    return res.status(500).json({message:"server error"});
}


exports.refreshToken = async (req,res) => {
    try{
        const {refreshToken} = req.body;
        if (!refreshToken) return res.status(400).json({message:"Refresh token is required"});

        let payload;
        try{
            payload = verifyRefreshToken(refreshToken);
        }
        catch(err){
            return res.status(401).json({message:"invalid token"})
        }

        const user  =  await User.findById(payload.id)
        if(!user || !user.refreshToken){
            return res.status(401).json({message:"refresh token is incorrect"})
        }

        if(user.refreshToken !== refreshToken){
            return res.status(401).json({message:"refresh token is not correct"})
        }

        const newPayload = {id:user._id, email:user.email};
        const newAccessToken = createAccessToken(newPayload);
        const newRefeshToken = createRefreshToken(newPayload);

        user.refreshToken = newRefeshToken
        await user.save();

        return res.json({
            accessToken:newAccessToken,
            refreshToken: newRefeshToken,
            expiresIn:proccess.env.ACCESS_TOKEN_EXPIRES|| "50s"
        });
    } catch (err){
        console.log(err)
        return res.status(500).json({message:"server error"})
    }

 }
};
