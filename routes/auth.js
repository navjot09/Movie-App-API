/*Auth.js includes all the api related to user authorization and authentication */

const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = "This is for token formation."

//ROUTE 1 : Create a user using : POST "/auth/createUser" . This doesn't require our user to be already authenticated.

router.post('/createUser', [

    body('email', 'Enter a valid mail').isEmail(),
    body('password', 'password should be atleast 5 character long').isLength({ min: 5 }),
    body('name', 'name should be atleast 3 character long').isLength({ min: 3 })


], async(req, res) => {
    const errors = validationResult(req);
    let regSuccess = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Hashing of user password for security

    const salt = await bcrypt.genSaltSync(10);

    const securedPassword =await bcrypt.hashSync(req.body.password, salt);

    try{
        const user = await User.create({
            name: req.body.name,
            password: securedPassword,
            email : req.body.email
        });

        const data = {
            user:{
                id : user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        regSuccess = true;
        res.json({regSuccess, authToken});
    }catch (error){
        res.send({error : "Email already exist."})
    }
});



// ROUTE2 : Authentication of user using POST "/auth/login" . This doesn't require our user to be already authenticated.



router.post('/login', [

    body('email', 'Enter a valid mail').isEmail(),
    body('password', 'password cannot be blank').exists()

], async(req, res) => {
    let authSuccess = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

   const {email , password} = req.body;
    try{
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({authSuccess, error : "Login credentials not correct."})
        }
        const passwordCompare =await bcrypt.compare(password, user.password);

        if(!passwordCompare){
            return res.status(400).json({authSuccess, error : "Login credentials not correct."})
        }

        const data = {
            user:{
                id : user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        authSuccess = true;
        res.json({authSuccess, authToken})        
    }
    catch (error){
        console.error(error.message);
        res.status(500).send("Internal Server Error.")
        }
    }
);


// ROUTE 3 : Get logged in user details using POST "/auth/getUser" . This requires user to be logged in


router.post('/getUser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.")
    }

}
)

module.exports = router