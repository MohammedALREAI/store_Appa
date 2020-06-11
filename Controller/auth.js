const generateToken = require("../configure/generateToken");
const User = require("../models/User");
const FacebookUser = require("../models/FacebookUser");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  jwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  FacebookStrategy = require("passport-facebook").Strategy;
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;

const AuthController = {};
// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: FACEBOOK_APP_ID,
//             clientSecret: FACEBOOK_APP_SECRET,
//             callbackURL: 'http://localhost:5000/auth/facebook/callback',
//             profileFields: ['id', 'displayName', 'emails'],
//         },
//         async function (accessToken, refreshToken, profile, cb) {
//             console.log('facebook token : ' + accessToken)

//             try {
//                 const user = await FacebookUser.findOne({ id: profile.id })
//                 if (user == null) {
//                     const newUser = new FacebookUser({
//                         id: profile.id,
//                         email: profile.emails[0].value,
//                         name: profile.displayName,
//                     })
//                     await newUser.save()
//                     return cb(null, user)
//                 }
//                 return cb(null, {
//                     name: user.name,
//                     email: user.email,
//                     id: user.id,
//                 })
//             } catch (error) {
//                 cb(error)
//                 console.log(error)
//             }
//         }
//     )
// )

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      User.findOne({ email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect Email" });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    }
  )
);

// // facebook routes
// Router.get(
//     '/facebook',
//     passport.authenticate('facebook', {
//         scope: ['email'],
//     })
// )

// Router.get(
//     '/facebook/callback',
//     passport.authenticate('facebook', {
//         failureRedirect: '/login',
//     }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.json({ user: req.user })
//         res.redirect('/')
//     }
// )

AuthController.AddFacebook = async (req, res) => {
  const { email, userID, name } = req.body.data;

  if (!email || !userID || !name)
    return res.status(400).json({ msg: "you need to send all fields" });
  try {
    let user = await FacebookUser.findOne({ email, _id: userID });
    if (user == null) {
      user = new FacebookUser({ email, _id: userID, name });
      await user.save();
    }

    const token = generateToken({ id: userID });
    res.json(returnUserInfo(user, token));
  } catch (error) {
    console.log(error);
  }
};
const opt = {};
opt.jwtFromRequest = ExtractJwt.fromHeader("auth");

opt.secretOrKey = process.env.SECRET;
passport.use(
  new jwtStrategy(opt, (jwtPayload, done) => {
    console.log("jwt payload", jwtPayload);

    User.findById(jwtPayload.id)
      .then((user) => {
        console.log(user);

        return done(null, user);
      })
      .catch((err) => done(err));
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
AuthController.Login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ msg: "some thing went wrong", user });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err)
        return res.status(400).json({ msg: "some thing went wrong", err });
      const token = generateToken({ id: user.id });

      return res.json(returnUserInfo(user, token));
    });
  })(req, res, next);
};

function returnUserInfo(user, token) {
  return {
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
      token,
    },
  };
}
module.exports = AuthController;
