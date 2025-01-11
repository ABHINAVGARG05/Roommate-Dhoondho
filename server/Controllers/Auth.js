import passport from "passport";
import dotenv from "dotenv"
import { Strategy as GoogleStrategy } from "passport-google-oauth2";


import UserModel from "../Models/userModel.js"


dotenv.config();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:process.env.GOOGLE_CALL_BACK_URL,
      passReqToCallback: true,
    },
    async (profile, done) => {
      try {
        console.log(profile)
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
            const name = profile.given_name.split(" ")
                user = await UserModel.create({
                googleId: profile.id,
                username: profile.email,
                firstname: [0],
                lastname: name[name.length -1],
                regnum: profile.family_name,
                profilePicture: profile.picture,
                isVerified: true, 
            });
        }
        return done(null, user);
      } 
      catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
