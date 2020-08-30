// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     try {
//         const token = req.session.token;
//         const decoded = jwt.verify(token, process.env.JWT_KEY);
//         req.userData = decoded;
//         next();
//     } catch (error) {
//         // return res.status(401).json({
//         //     message: 'Auth failed'
//         // });
//         res.redirect('/');
//     }
// };


const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;
const passport = require('passport');
//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'top_secret',
  //we expect the user to send the token as a query parameter with the name 'secret_token'
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));