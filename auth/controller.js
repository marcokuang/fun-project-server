const jwt = require("jsonwebtoken");
const User = require("../model/model");

module.exports.SignUp = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "you must provide email and password" });
  }

  //if a user with the given email exists
  User.findOne({ email: email }, (err, existingUser) => {
    // if a user with email exists, return an error
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ error: "email is in use" });
    }
  });

  // if a user with email does not exist, create and save user record
  const user = new User({
    email: email,
    password: password,
  });

  user.save((err) => {
    if (err) {
      return next(err);
    }

    const body = {
      _id: user.id,
      email: user.email,
    };
    res.json({ token: jwt.sign({ user: body }, "secret_string") });
  });
};
