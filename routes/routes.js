const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const passportService = require("../auth/auth");
const Controller = require("../auth/controller");
const router = express.Router();
passportService.start();
router.post("/signup", Controller.SignUp);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred while fetching user");
        return next(error);
      }

      req.login(user, { session: false }, (error) => {
        if (error) return next(error);

        const body = {
          _id: user.id,
          email: user.email,
        };

        const token = jwt.sign({ user: body }, "secret_string");

        return res.json({ token });
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  })(req, res, next);
});

module.exports = router;
