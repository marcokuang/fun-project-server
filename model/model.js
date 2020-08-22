const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// construct user schema for the database
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// pre-hook will be called before user information is saved
UserSchema.pre("save", async function (next) {
  // assign the current document which will soon be saved to the user variable
  const user = this;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    console.log(user);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  //hash the password sent by user and check if it matches with the same hash stored in password

  const validate = await bcrypt.compare(password, user.password);
  // console.log(validate);
  return validate;
};

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
