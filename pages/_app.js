import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/globals.css";
import "../styles/auth.css";
import "../styles/welcome.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { GlobalStatesProvider } from "../contexts/GlobalStates";
import ScreenContext, { ScreenProvider } from "../contexts/ScreenContext";
import { AuthProvider } from "../contexts/AuthContext";
import { MediaUtilsProvider } from "../contexts/MediaUtilsContext";
import { Toaster } from "react-hot-toast";
import { MessageProvider } from "../contexts/MessageContext";
import { useContext } from "react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <script src="/jquery-3.2.1.slim.min.js"></script>
      <script src="/bootstrap.min.js"></script>
      <script src="/popper.min.js"></script>
      <MediaUtilsProvider>
        <GlobalStatesProvider>
          <ScreenProvider>
            <AuthProvider>
              <MessageProvider>
                <Toaster position="top-right" />

                <Component {...pageProps} />
              </MessageProvider>
            </AuthProvider>
          </ScreenProvider>
        </GlobalStatesProvider>
      </MediaUtilsProvider>
    </>
  );
}
