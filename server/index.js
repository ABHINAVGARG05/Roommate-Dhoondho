import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport"
import session from "express-session"
import cors from 'cors';
import http from 'http';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import AuthRoute from './Routes/AuthRoute.js'
import PostRoutes from './Routes/PostRoute.js'
import UserRoute from './Routes/UserRoute.js'
import RoomRoute from './Routes/RoomRoute.js'
import RoommateRoute from './Routes/RoommateRoute.js'
import ServerMsgRoute from './Routes/ServerMsgRoute.js'
import {initSocketIO} from './Middlewares/socketIO.js'

import { CORSProtection } from './Middlewares/CORS_Protection.js'
import { verifyJWT_withuserId, verifyJWTForGetRequest } from './Middlewares/verifyJWT.js';

import "./Controllers/Auth.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// if(process.env.NODE_ENV === "production") {
//   console.log(
//     "%cDear Developer,\n" +
//     "Thanks for stopping by the console log. If you've stumbled upon any bugs, please report them at %chttps://sdeysocial.canny.io/issue%c. Together, let's keep this code shipshape for our fellow VITians.\n" +
//     "Best Regards,\n" +
//     "MFC VIT Team\n\n"+
//     "    .---.\n" +
//     "   |o_o |\n" +
//     "   |:_/ |\n" +
//     "  //   \\ \\\n" +
//     " (|     | )\n" +
//     "/'\_   _/`\\\n" +
//     " \___)=(___/",
//     "color: yellow; font-weight: bold;",
//     "color: yellow; text-decoration: underline;",
//     "color: yellow; font-weight: bold;",
//   );

//   console.log = () => {}
//   console.error = () => {}
//   console.debug = () => {}
// }

// Routes
const app = express();
const server = http.createServer(app)

initSocketIO(server);


// Middleware
app.use(express.json())
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())
dotenv.config();

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(process.env.PORT, () =>
      console.log(`Listening at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error));

  // Static Route
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");
  app.use(express.static(__dirname + "public"));
  app.get('/', (req, res) => {
    return res.render('index');
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, 
        maxAge: 1000 * 60 * 60,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // usage of routes
  app.use('/auth', CORSProtection, AuthRoute)
  app.use('/user', CORSProtection, verifyJWTForGetRequest, UserRoute)
  app.use('/room', CORSProtection, verifyJWTForGetRequest, RoomRoute)
  app.use('/roommate', CORSProtection, verifyJWTForGetRequest, RoommateRoute)
  app.use('/server-messages', CORSProtection, ServerMsgRoute)
  app.use('/post',PostRoutes)