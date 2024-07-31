const express = require('express')
const router = express.Router();
const {getAllUsers,getSingleUsers,showCurrentUser,updateUser,updateUserPassword,} = require('../controllers/userController')
const{authenticateUser,authorizePermissions,} = require('../middleware/authentication')


router.route('/').get(authenticateUser,authorizePermissions('admin'),getAllUsers);

router.route('/showMe').get(authenticateUser,showCurrentUser);

router.route('/:id').get(authenticateUser, getSingleUsers);

router.route('/updateUser').patch(authenticateUser,updateUser)
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)


module.exports = router;