const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')
const authController = require('../controllers/authController')

router.route('/api/users')
    .get(userController.list)
    .post(userController.create)
// send request to the same end points 

router.param('id', userController.userByID)
// whenever the id is inputted

router.route('/api/users/:id')
    .get(authController.requireSignin ,userController.read)
    .put(authController.requireSignin,authController.hasAuthorization, userController.update)
    .delete(authController.requireSignin,authController.hasAuthorization,userController.remove)


router.get('/api/users/:id', (req,res)=> {
    const id = req.params.id
    res.send(`We are asking for the ${id}`)
});

module.exports = router;