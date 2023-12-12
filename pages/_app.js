import Footer from '../components/Footer';
import Header from '../components/Header';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export default function App({ Component, pageProps }) {
  return (
    <>
    <script src="/jquery-3.2.1.slim.min.js"></script>
    <script src="/bootstrap.min.js"></script>
    <script src="/popper.min.js"></script>
      <Header/>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
