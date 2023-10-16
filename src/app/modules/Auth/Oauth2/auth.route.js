/* eslint-disable node/no-extraneous-require */
const express = require("express");
const passport = require("passport");
const router = express.Router();

//   for google authentication using O auth2.0 with passport js
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
    failureMessage: true,
  }),
  function (req, res) {
    //failure message
    console.log(req.session.messages);
    // Successful authentication, redirect success.
    res.redirect("");
  }
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/error",
    failureMessage: true,
  }),
  function (req, res) {
    //failure message
    console.log(req.session.messages);
    // Successful authentication, redirect success.
    res.redirect(
      "https://traveller-system-mern-eta.vercel.app/verification-success/"
    );
  }
);

router.get("/auth/google/success", function (req, res) {
  // Successful authentication, redirect success.
  console.log("success", { req: req.user, res: res.user });
});

router.get("/auth/google/error", function (req, res) {
  // error in authentication, redirect success.
  console.log("error", { req, res });
});

const authRouter = router;

module.exports = authRouter;
