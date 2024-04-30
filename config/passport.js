const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { compareSync } = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../Model/userModel");

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username }).exec();
      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      if (!compareSync(password, user.password)) {
        return done(null, false, {
          message: "Incorrect Password",
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOne({ username: profile.email })
        .exec()
        .then((user) => {
          if (!user) {
            let newUser = new User({
              username: profile.email,
            });
            newUser
              .save()
              .then((newUser) => done(null, newUser))
              .catch((err) => {
                console.log(err);
                return done(err, null);
              });
          } else {
            return done(null, user);
          }
        })
        .catch((err) => {
          console.log(err);
          return done(err, null);
        });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: `${process.env.FACEBOOK_APP_ID}`,
      clientSecret: `${process.env.FACEBOOK_APP_SECRET}`,
      callbackURL:
        "https://sparknex-backend.onrender.com/auth/facebook/callback",
    },

    async function (accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken);
      console.log(profile, "fbprofile");
      const user = await User.findOne({ username: profile.id })
        .exec()
        .then((user) => {
          console.log("object");
          console.log(user);
          if (!user) {
            let newUser = new User({
              username: profile.id,
            });
            newUser
              .save()
              .then((newUser) => done(null, newUser))
              .catch((err) => {
                console.log(err);
                return done(err, null);
              });
          } else {
            return done(null, user);
          }
        })
        .catch((err) => {
          console.log(err);
          return done(err, null);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  try {
    done(null, user._id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
