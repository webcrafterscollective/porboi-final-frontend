// components/common/SEO.js - Advanced SEO Component
import React from 'react';
import Head from 'next/head';
import { SITE_CONFIG } from '../../lib/constants';

const SEO = ({
  title,
  description,
  canonical,
  openGraph,
  twitter,
  noindex = false,
  schema
}) => {
  const pageTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  const pageDescription = description || SITE_CONFIG.description;
  const pageUrl = canonical || SITE_CONFIG.url;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={openGraph?.title || pageTitle} />
      <meta property="og:description" content={openGraph?.description || pageDescription} />
      <meta property="og:url" content={openGraph?.url || pageUrl} />
      <meta property="og:type" content={openGraph?.type || 'website'} />
      <meta property="og:image" content={openGraph?.image || SITE_CONFIG.defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.social.twitter} />
      <meta name="twitter:title" content={twitter?.title || pageTitle} />
      <meta name="twitter:description" content={twitter?.description || pageDescription} />
      <meta name="twitter:image" content={twitter?.image || SITE_CONFIG.defaultImage} />
      
      {/* Favicon */}
      <link rel="icon" href={SITE_CONFIG.favicon} />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Schema.org JSON-LD */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
};

export default SEO;
