const passport = require("passport");
const localStrategy = require("passport-local");
const UserModel = require("../model/model");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const { model } = require("../model/model");

// Create a passport middleware to handle user registration

module.exports.start = function () {
  console.log("starting Passport config...");
  // const signUpStrategy = new localStrategy(
  //   {
  //     usernameField: "email",
  //     passwordField: "password",
  //     session: false,
  //   },
  //   async (email, password, done) => {
  //     try {
  //       console.log(email, password);
  //       const user = await UserModel.create({ email, password });
  //       return done(null, user);
  //     } catch (error) {
  //       console.log("Error when creating user", error);
  //       done(error);
  //     }
  //   }
  // );

  // passport.use("signup", signUpStrategy);

  const signInStrategy = new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      console.log("local strategy", email, password);
      try {
        const user = await UserModel.findOne({ email });

        // if user is not found
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, user, { message: "Logged in successfully" });
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  );

  passport.use("login", signInStrategy);

  // use the passport JWT Strategy to verify the user JWT token
  const accessStrategy = new JWTStrategy(
    {
      secretOrKey: "secret_string",
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        //Pass the user details to the next middleware
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  );

  passport.use("secure", accessStrategy);
};
