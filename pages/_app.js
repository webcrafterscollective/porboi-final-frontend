// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/common/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WebsiteLoader from '../components/common/WebsiteLoader';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true); // Start true for initial load
  const router = useRouter();

  useEffect(() => {
    // Set a minimum time for the initial loader animation to be visible
    const initialLoadTimer = setTimeout(() => {
      setLoading(false);
    }, 1800); // 1.8 seconds for the animation to complete gracefully

    const handleStart = (url) => url !== router.asPath && setLoading(true);
    const handleComplete = (url) => {
      if (url === router.asPath) {
        // Add a small delay to prevent the loader from flashing on very fast page loads
        setTimeout(() => setLoading(false), 500);
      }
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      clearTimeout(initialLoadTimer);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  
  return (
    <>
      <WebsiteLoader isLoading={loading} />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp;
