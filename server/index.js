import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import RoomRoute from './Routes/RoomRoute.js'
import RoommateRoute from './Routes/RoommateRoute.js'
import path from 'path';

if(process.env.NODE_ENV === "production") {
  console.log(
    "%cDear Developer,\n" +
    "Thanks for stopping by the console log. If you've stumbled upon any bugs, please report them at %chttps://sdeysocial.canny.io/issue%c. Together, let's keep this code shipshape for our fellow VITians.\n" +
    "Best Regards,\n" +
    "MFC VIT Team\n\n"+
    "    .---.\n" +
    "   |o_o |\n" +
    "   |:_/ |\n" +
    "  //   \\ \\\n" +
    " (|     | )\n" +
    "/'\_   _/`\\\n" +
    " \___)=(___/",
    "color: yellow; font-weight: bold;",
    "color: yellow; text-decoration: underline;",
    "color: yellow; font-weight: bold;",
  );

  // console.log(
  //   "  __  __ ______ _____  __      _______ _______ \n" +
  //   " |  \\/  |  ____/ ____| \\ \\    / /_   _|__   __|\n" +
  //   " | \\  / | |__ | |       \\ \\  / /  | |    | |   \n" +
  //   " | |\\/| |  __|| |        \\ \\/ /   | |    | |   \n" +
  //   " | |  | | |   | |____     \\  /   _| |_   | |   \n" +
  //   " |_|  |_|_|    \\_____|     \\/   |_____|  |_|   \n" +
  //   "                                               \n" +
  //   "                                               "
  // );

  console.log(
    "                                                                                           \n" +
    "                                  .:==+*###%%%%%##**+=-:.                                  \n" +
    "                            .=+#%@@@@@@@@@@%%%%%@@@@@@@@@@@#+-.                            \n" +
    "                        :=#@@@@@@#+=-:.             .:+#%@@@@@@@#+:                        \n" +
    "         .+#+        -*@@@@@*=:                      #@@@@@@@@@@@@@@*-.                    \n" +
    "        -@@@@*    -#@@@@#=:         .:.               -=+*#@@@@@@@@@@@@#=.                 \n" +
    "       :@@@@@@. -@@@@@+.        :*%@@@@%                   -%@@@@%-+%@@@@@#:               \n" +
    "       #@@%@@@*#@@@#=.      .=#@@@@@@@%=                 +@@@@@@@@=  .:+%@@@#= ::          \n" +
    "      =@@% +@@@@@#=-=====-=#@@@@@@@@%-                    =*%@@@@@*-     :*@@@@@@%-        \n" +
    "     .@@@+  =%@@@@@@@@@@@@@@@*-%@@@=                         .-+%@@@@#+.   .#@@@@@@+       \n" +
    "     *@@@:    -*#*+-:::::-=-  #@@@:                               -*@@@@#-   :%@@@@@%.     \n" +
    "     %@@@.                    @@@%=                                  -*@@@%:  :@@@@@@*     \n" +
    "     @@@@                     :@@@@%:                                  .@@@@.  =@@@@@@.    \n" +
    "    -@@@%                       -#@@@%%##*+.                            .#@@@:  :::@@@%    \n" +
    "   +@@@#                          :+#%@@@@@@.                          %@@@@@%     *@@@:   \n" +
    "  *@@@+                              :+#@@@=                           *@@@@@@     .@@@+   \n" +
    " #@@%.                             =%@@@@+.                            :@@@%*-      *@@@%:  \n" +
    "*@@@%*:                          -@@@%+:                                %@@*        -@@@@*  \n" +
    "@@@@@@+                          -@@@=                                  #@@*        .@@@@%  \n" +
    "=@@@@%                            *@@%                                . #@@*         %@@@@% \n" +
    " .@@@:                     :*%%%#**@@@                              =@@%%@@+          -@@@   \n" +
    " +@@#                     =@@@%@@@@@@%                              =@@@@@@=          =@@%   \n" +
    " %@@*                     #@@%.   .:-.                              -@@@@@@.          %@@*   \n" +
    " @@@+                     .#@@@*-           .::::.                  -@@@@@*          :@@@-  \n" +
    " %@@*                       :#@@@%+:    :+#@@@@@@@@#=               -@@@=.           *@@%   \n" +
    " *@@#                         -%@@@@@@@@@@@@@#**#@@@@@:             +@@@.            @@@-   \n" +
    " :@@@                           .=#@@@@@%*=.    .=%@@@%             #@@%            #@@%   \n" +
    "  %@@+                                       :=#@@@@@@*         =%@%@@+           #@@@-   \n" +
    "  =@@@=                                  :=*@@@@@+:::.        :#@@@@@@@.          =@@@+    \n" +
    "   #@@@:                       -*####%%@@@@@@#+:            .*@@@@@@@#.          -@@@*     \n" +
    "    %@@%                       +@@@@@@%#*+-.              :*@@@@@@@@*           -@@@%      \n" +
    "    :@@@@.                       =%@@@%*=:            .-*@@@@*::%@#:           -@@@+       \n" +
    "     :@@@%                         :#@@@@@@%*=--::-=*%@@@@@*.                 -@@@*        \n" +
    "      .%@@%:                         .-+#@@@@@@@@@@@@@@%*-.                  -@@@*         \n" +
    "        *@@@=                              :-===++==-:                     :%@@@=          \n" +
    "         -@@@@=                                                           +@@@%.           \n" +
    "           *@@@%-                                                       =%@@%+             \n" +
    "            .+@@@%=                                                  .=%@@@=               \n" +
    "              .#@@@@*.                                              +@@@@#                 \n" +
    "                :*@@@@#=.                                       .:*@@@@#:                  \n" +
    "                   =*@@@@@*=.                                :+%@@@@#-.                    \n" +
    "                      :+%@@@@@%*+-:.                  .:-+*%@@@@%*-                        \n" +
    "                          :=*%@@@@@@@@%##***++***##%%@@@@@@@#+-.                           \n" +
    "                               .:=+*#%%@@@@@@@@@@@@@%#*+=:.                                \n" +
    "                                             .                                            \n"
  );

  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
}

// Routes
const app = express();


// Middleware
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
    app.listen(process.env.PORT, () =>
      console.log(`Listening at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error));

  // Static Route
  app.set('view engine', 'ejs');
  app.set('views', path.resolve('./views'));
  app.get('/', (req, res) => {
    return res.render('index');
  });

  // usage of routes
  app.use('/auth', AuthRoute)
  app.use('/user', UserRoute)
  app.use('/room', RoomRoute)
  app.use('/roommate', RoommateRoute)