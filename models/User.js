const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,'Indique su nombre'],
        minlength: 3,
        maxlength: 50,},
    email: {
        type: String,
        unique: true,
        required:[true,'Indique su email'],
        validate:{
            validator: validator.isEmail,
            message:'Por favor indique un email valido'
    }},
    password:{ 
        type: String, 
        required: [true, 'Indique su contraseña'],
        minlength : 6,},
    role: {
        type: String,
        enum: ['admin', 'user'],
        default:'user',
        },
});


UserSchema.pre('save', async function(){
    
    if(!this.isModified('password')) return
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
});

UserSchema.methods.comparePassword = async function (canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
};

module.exports= mongoose.model('User',UserSchema);