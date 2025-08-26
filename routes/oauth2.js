const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/user/login' }),
  (req, res) => {
    req.session.usuario = {
      id: req.user._id,
      username: req.user.nombre
    };
    res.redirect('/');
  }
);


module.exports = router;