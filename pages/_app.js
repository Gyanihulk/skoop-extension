import Footer from '../components/Footer';
import Header from '../components/Header';

import '../styles/globals.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStatesProvider } from '../contexts/GlobalStates';
import { ScreenProvider } from '../contexts/ScreenContext';
import { AuthProvider } from '../contexts/AuthContext';



export default function App({ Component, pageProps }) {
  return (
    <>
    <script src="/jquery-3.2.1.slim.min.js"></script>
    <script src="/bootstrap.min.js"></script>
    <script src="/popper.min.js"></script>
    <GlobalStatesProvider>
      <ScreenProvider>
        <AuthProvider>

            <Header/>
            <Component {...pageProps} />
            <Footer />

        </AuthProvider>
      </ScreenProvider>
      </GlobalStatesProvider>
    </>
  );
}
