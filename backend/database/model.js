const mongoose=require('mongoose');
const validator=require('validator')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const RegisterationSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Please enter correct email");
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(value.length<6){
                throw new Error ("Please enter password more than 6 character");
            }
        }
    },
})
RegisterationSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8);
    }
    next();
})
RegisterationSchema.methods.generateAuthToken=async function(){
    const user=this;
    // console.log(user);
    const token=jwt.sign({_id:user._id.toString()},'helloworld',{
        expiresIn:"30s"
    });
    // console.log(token);
    // user.tokens=user.tokens.concat({token});
    // await user.save();
    return token;
    
}
const Registeration=mongoose.model('registeration',RegisterationSchema);
module.exports={
    Registeration
}