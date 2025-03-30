import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider, createTheme } from "@mui/material";
import ChatList from "./Components/Chat/ChatList";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF8C00",
      light: "#FFA500",
      dark: "#FF6B00",
    },
  },
});

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Routes>
              <Navbar />
              <NavTabs />
              <Footer />
            </Routes>
            <ChatList />
          </div>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
