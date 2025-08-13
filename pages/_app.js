// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/common/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WebsiteLoader from '../components/common/WebsiteLoader';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setLoading(true);
    const handleComplete = (url) => url === router.asPath && setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Initial load simulation
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Increased duration for the new animation

    return () => {
      clearTimeout(timer);
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
