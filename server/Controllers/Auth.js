import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import UserModel from "../Models/userModel.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALL_BACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          const name = profile.given_name.split(" ");
          user = await UserModel.create({
            googleId: profile.id,
            username: profile.email,
            firstname: name[0],
            lastname: name[name.length - 1],
            regnum: profile.family_name,
            profilePicture: profile.picture,
            isVerified: true,
            activeChats: [],
            gender: "",
          });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.username, firstname: user.firstname, lastname: user.lastname, gender: user.gender }, process.env.JWTKEY, { expiresIn: "7d" });
        console.log(token)
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, data);
});

passport.deserializeUser(async (data, done) => {
  try {
    const user = await UserModel.findById(data.user._id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
