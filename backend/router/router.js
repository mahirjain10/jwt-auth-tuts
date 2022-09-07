const express=require('express');
const router=express.Router();
const {signUp, login, verifyToken, getUser, renderIndexPage,renderLoginPage,renderRegisterPage,refreshToken, aboutMe, logout}=require('../controller/signup and login controller');
const cookieParser=require('cookie-parser');

router.use(express.urlencoded({extended: true}));
router.use(express.json())
router.use(cookieParser());

router.get('/',(req,res)=>{
    res.send('homepage');
})
router.post('/register/data/recorded',signUp);
router.post('/login/data/recorded',login);
router.get('/user',verifyToken,refreshToken,getUser);
router.get('/index',renderIndexPage);
router.get('/register',renderRegisterPage);
router.get('/login',renderLoginPage);
router.get('/aboutMe',aboutMe);
router.get('/logout',logout);
// router.get('/refresh',refreshToken,verifyToken,getUser);
module.exports=router