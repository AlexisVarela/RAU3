const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/userModel.js');
const dotenv = require('dotenv');
dotenv.config();
// Serialización y deserialización del usuario
passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findById(id);
    done(null, usuario);
  } catch (err) {
    done(err, null);
  }
});

// Estrategia Google
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let usuario = await Usuario.findOne({ email: profile.emails[0].value });
//     if (!usuario) {
//       usuario = await Usuario.create({
//         nombre: profile.displayName,
//         email: profile.emails[0].value,
//         password: 'social-login' // Contraseña dummy para social login
//       });
//     }
//     return done(null, usuario);
//   } catch (err) {
//     return done(err, null);
//   }
// }));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback" // 👈 URL correcta con tu puerto
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Primero busca por googleId
    let usuario = await Usuario.findOne({ googleId: profile.id });

    // Si no existe, busca por email (por si ya se registró con email normal)
    if (!usuario) {
      usuario = await Usuario.findOne({ email: profile.emails[0].value });
    }

    // Si no existe, crearlo
    if (!usuario) {
      usuario = await Usuario.create({
        nombre: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id, // 👈 Guardar googleId
        password: 'social-login'
      });
    } else if (!usuario.googleId) {
      // Si ya existe con email pero sin googleId, se lo agregamos
      usuario.googleId = profile.id;
      await usuario.save();
    }

    return done(null, usuario);
  } catch (err) {
    return done(err, null);
  }
}));

