import "./index.css";
import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import ResendVerificationMail from "./Pages/ResendVerificationMail/ResendVerificationMail";
import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail";
import ResetPassword from "./Pages/ResetPassword/Reset";
import UpdatePassword from "./Pages/UpdatePassword/UpdatePassword";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Selections from "./Pages/Selections/Selections";
import { ListingContextProvider } from "./Context/listing-context";
import { ChatProvider } from "./Context/chat-context";
import NeedRoom from "./Pages/NeedRoom/NeedRoom";
import Chat from "./Pages/Chat/Chat";
import ChatMobile from "./Components/ChatMobile/ChatMobile";
import store from "./store/ReduxStore";
import { Provider } from "react-redux";
import Terms from "./Pages/Terms/Terms";
import Privacy from "./Pages/PrivacyPolicy/Privacy";
import Team from "./Pages/Team/Team";
import AboutMFC from "./Pages/AboutMFC/AboutMFC";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import secureLocalStorage from "react-secure-storage";
import setAuthToken from "./actions/setAuthToken";
import ReactGA from "react-ga4";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Hotjar from "@hotjar/browser";
const siteId = 3765543;
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);

const MeasurementId = "G-R2PCM7R0D1";
ReactGA.initialize(MeasurementId);

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.trace = () => {};
  console.group = () => {};
  console.groupEnd = () => {};
  console.groupCollapsed = () => {};
  console.time = () => {};
  console.timeEnd = () => {};
  console.timeLog = () => {};
  console.count = () => {};
  console.countReset = () => {};
  console.clear = () => {};
  console.table = () => {};
  console.assert = () => {};
  console.profile = () => {};
  console.profileEnd = () => {};
  console.dir = () => {};
  console.dirxml = () => {};
  console.timeStamp = () => {};
  console.context = () => {};
  console.memory = () => {};
  console.exception = () => {};
  console.trace = () => {};
  console.fatal = () => {};
  console.markTimeline = () => {};
  console.timeline = () => {};
  console.timelineEnd = () => {};
  console.count = () => {};
  console.countReset = () => {};
}

const router = createBrowserRouter([
  { path: "/", element: <SignIn /> },
  { path: "/signUp", element: <SignUp /> },
  { path: "/updatePassword", element: <UpdatePassword /> },
  { path: "/resetPassword", element: <ResetPassword /> },
  { path: "/resendVerificationMail", element: <ResendVerificationMail /> },
  { path: "/verifyEmail", element: <VerifyEmail /> },
  { path: "/home", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/selections", element: <Selections /> },
  { path: "/need", element: <NeedRoom /> },
  { path: "/chat", element: <ChatMobile /> },
  { path: "/chatMobile", element: <ChatMobile /> },
  { path: "/TermsAndConditions", element: <Terms /> },
  { path: "/PrivacyPolicy", element: <Privacy /> },
  { path: "/Team", element: <Team /> },
  { path: "/AboutMFC", element: <AboutMFC /> },
]);

const profile = JSON.parse(secureLocalStorage.getItem("profile"));
console.log("Profile", profile)
if (profile) {
  const token = profile?.token;
  setAuthToken(token);
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <Fragment>
        <ListingContextProvider>
          <ChatProvider>
            <RouterProvider router={router} />
          </ChatProvider>
        </ListingContextProvider>
        <ToastContainer />
      </Fragment>
    </Provider>
  </GoogleOAuthProvider>
);

reportWebVitals();
