const {Registeration}=require('../database/model');
const bcrypt=require('bcryptjs') ;
const jwt = require('jsonwebtoken');

exports.signUp=async(req,res)=>{
    const User=new Registeration();
    User.name=req.body.name,
    User.email=req.body.email
    if(req.body.password===req.body.confirmPassword){
        User.password=req.body.password;
    }
    else{
        throw new Error('ircorrect password');
    }
    try{
        await User.save();
        res.redirect('/login');
        // res.status(201).send({message:"usser data saved"});
    }
    catch(err){
        console.log(err); 
        res.send(err);
    }
}

exports.login=async(req,res)=>{
    const User=new Registeration();
    const userData=await Registeration.findOne({email:req.body.email});
    console.log(userData);
    // console.log("isMatcch = "+isMatch);
    if(userData==={}){
        res.status(404).send({message:"user not found"});
    }
    else{
        const isMatch=await bcrypt.compare(req.body.password,userData.password);
        if(!isMatch){
            res.status(400).send({message:"wrong password"}); 
        }
        else{
            const token=await userData.generateAuthToken()
            console.log(token);
            res.cookie("jwt",token,{
                path:'/',
                expires:new Date(Date.now()+1000*30),
                httpOnly:true,
                sameSite:"lax"
            });
            res.redirect('/user');
            // res.status(201).send({message:"user logged in",user:userData,token:token});
        }
    }
}
exports.verifyToken=async(req,res,next)=>{
    // const token=req.header('Authorization').replace('Bearer ','');
    const token =req.cookies.jwt;
    console.log(token);    
    const user=jwt.verify(token,"helloworld");
    if(!user){
        res.status(404).send({message:'invalid token'});
    }
    else{
        console.log(user)
        req.id=user._id
        // res.status(201).send({message:"token matched"});
    }
    next();
}
exports.getUser=async(req,res)=>{
    const user= await Registeration.findOne({_id:req.id});
    if(!user){
        res.status(404).send({message:"user not found"});
    }
    else{
        res.render('user',{
            data:user,
            renderLogOut:true
        })
        // res.status(201).send({message:"user found",user:user});
    }
}
exports.refreshToken=async(req,res,next)=>{
    const token =req.cookies.jwt;
    console.log("refresh token function's token variable ->",token);
    if(!token){
        res.status(404).send({message:"couldnt find token"});
    }
    else{
        const user=jwt.verify(token,"helloworld");
        if(!user){
        res.status(404).send({message:'invalid token'});
    }
    else{
        res.clearCookie('jwt');
        // req.cookie.jwt=" ";
        const token=jwt.sign({_id:user._id.toString()},'helloworld',{
            expiresIn:"30s"
        });
        res.cookie("jwt",token,{
            path:'/',
            expires:new Date(Date.now()+1000*30),
            httpOnly:true,
            sameSite:"lax"
        });
        req.id=user._id
        next();
    }
    }
}
exports.aboutMe=(req,res)=>{
    res.send("welcome to abt me");
}
exports.logout=(req,res)=>{
    const token =req.cookies.jwt;
    const user=jwt.verify(token,"helloworld");
    if(!user){
    res.status(404).send({message:'invalid token'});
}
else{
    res.clearCookie('jwt');
    res.redirect('/index');
}
}
exports.renderIndexPage=(req,res)=>{
    res.render('index',{
    });
}
exports.renderLoginPage=(req,res)=>{
    res.render('login',{
        renderLogin:true
    });
}
exports.renderRegisterPage=(req,res)=>{
    res.render('register',{
        renderLogin:true,
    });
}