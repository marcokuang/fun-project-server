const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const cors = require("cors");

mongoose.connect("mongodb://localhost:passport-jwt/passport-jwt", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) =>
  console.log("MongoDB connection:", error)
);
// mongoose.Promise = global.Promise;
require("./auth/auth");
app.use(cors());
app.use(bodyParser.json({ type: "*/*" }));

const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-routes");

app.use("/", routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use(
  "/user",
  passport.authenticate("secure", { session: false }),
  secureRoute
);

//Handle errors
app.use(function (err, req, res, next) {
  console.error("HAHAHAHA", err);
  res.status(err.status || 500);
  res.json({ error: err });
});

const server = http.createServer(app);

server.listen(4000, () => {
  console.log("Server started at port 4000");
});
