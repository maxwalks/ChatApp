const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    username: {
        type: String,
        required: [true, 'Please enter a username.'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: [6, 'Minimum password length is 6 characters.']
    }
})


// fire a function before doc saved to db
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  // static method to login user
  UserSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect username');
  };

module.exports = mongoose.model('User', UserSchema)