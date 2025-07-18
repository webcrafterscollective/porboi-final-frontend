// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/common/Layout';

function MyApp({ Component, pageProps }) {
  // Check if the component has a custom layout
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;