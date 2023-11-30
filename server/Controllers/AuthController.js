import UserModel from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationMail } from "../utils/sendVerificationMail.js";
import { sendPasswordResetMail } from "../utils/sendPasswordResetMail.js";

// Registering a new User
export const registerUser = async (req, res) => {
  console.log(req.body);

  // Check if the request has an 'Origin' header
  const url = req.get('Origin');
  console.log('Domain:', url);

  if (process.env.NODE_ENV === "production" && url !== process.env.CLIENT_URL) {
    res.status(403).json({ message: `${process.env.ACCESS_FORBIDDEN_MSG}`, url: url });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
    const newUser = new UserModel(req.body);
    const { username } = req.body;

    const oldUser = await UserModel.findOne({ username });
    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const emailToken = crypto.randomBytes(64).toString("hex");
    newUser.emailToken = emailToken;

    const user = await newUser.save();

    const token = jwt.sign(
      { username: user.username, id: user._id, emailToken: user.emailToken },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );
    await sendVerificationMail(user);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email Token
export const verifyEmail = async (req, res) => {

  // Check if the request has an 'Origin' header
  const url = req.get('Origin');
  console.log('Domain:', url);

  if (process.env.NODE_ENV === "production" && url !== process.env.CLIENT_URL) {
    res.status(403).json({ message: `${process.env.ACCESS_FORBIDDEN_MSG}`, url: url });
    return;
  }

  try {
    const emailToken = req.body.emailToken;
    if (!emailToken) {
      return res.status(404).json("Email token not found");
    }
    const user = await UserModel.findOne({ emailToken: emailToken });
    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await user.save();
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWTKEY, { expiresIn: "1h" });
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        isVerified: user.isVerified,
      });
    } else {
      res.status(404).json("Email verification failed, invalid token!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

// Resend Verification Email
export const resendVerificationEmail = async (req, res) => {

  // Check if the request has an 'Origin' header
  const url = req.get('Origin');
  console.log('Domain:', url);

  if (process.env.NODE_ENV === "production" && url !== process.env.CLIENT_URL) {
    res.status(403).json({ message: `${process.env.ACCESS_FORBIDDEN_MSG}`, url: url });
    return;
  }

  const { username } = req.body;
  try {
    const user = await UserModel.findOne({ username });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "Email is already verified." });
      }

      // Check if emailToken is null
      if (!user.emailToken) {
        // Generate a new email token
        const emailToken = crypto.randomBytes(64).toString("hex");
        user.emailToken = emailToken;
        await user.save();
      }

      await sendVerificationMail(user);
      res.status(200).json({ message: "Verification email resent successfully." });
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// login User
export const loginUser = async (req, res) => {

  // Check if the request has an 'Origin' header
  const url = req.get('Origin');
  console.log('Domain:', url);

  if (process.env.NODE_ENV === "production" && url !== process.env.CLIENT_URL) {
    res.status(403).json({ message: `${process.env.ACCESS_FORBIDDEN_MSG}`, url: url });
    return;
  }

  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("Wrong password");
      } else {
        if (!user.isVerified) {
          res.status(400).json("Email not verified");
        } else {
          const token = jwt.sign(
            { username: user.username, id: user._id },
            process.env.JWTKEY,
            { expiresIn: "1h" }
          );
          // Don't include the password in the response
          const userDetails = user._doc;
          delete userDetails.password;
          delete userDetails.emailToken;
          res.status(200).json({ user: userDetails, token });
        }
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Generate a new email token for password reset
export const requestPasswordReset = async (req, res) => {

  // Check if the request has an 'Origin' header
  const url = req.get('Origin');
  console.log('Domain:', url);

  if (process.env.NODE_ENV === "production" && url !== process.env.CLIENT_URL) {
    res.status(403).json({ message: `${process.env.ACCESS_FORBIDDEN_MSG}`, url: url });
    return;
  }

  const { username } = req.body;
  try {
    const user = await UserModel.findOne({ username });

    if (user) {
      // Check if emailToken is null
      if (!user.emailToken) {
        // Generate a new email token
        const emailToken = crypto.randomBytes(64).toString("hex");
        user.emailToken = emailToken;
        await user.save();
      }

      await sendPasswordResetMail(user);

      res.status(200).json({ message: "Email token for password reset sent to the user's email address." });
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Update password based on emailToken
export const updatePassword = async (req, res) => {

  // Check if the request has an 'Origin' header
  const url = req.get('Origin');
  console.log('Domain:', url);

  if (process.env.NODE_ENV === "production" && url !== process.env.CLIENT_URL) {
    res.status(403).json({ message: `${process.env.ACCESS_FORBIDDEN_MSG}`, url: url });
    return;
  }

  const { username, password, emailToken } = req.body;
  try {
    const user = await UserModel.findOne({ username, emailToken });

    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      user.password = hashedPass;
      user.isVerified = true;
      user.emailToken = null;
      await user.save();

      res.status(200).json({ message: "Password updated successfully." });
    } else {
      res.status(404).json("Invalid username or email token.");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};
