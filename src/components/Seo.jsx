import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const metaByPath = {
  '/': {
    title: 'FRA Atlas – Claim Upload',
    description: 'Submit forest rights claims with documents. Secure, paperless workflow aligned with Forest Rights Act.'
  },
  '/multi-role-dashboard': {
    title: 'FRA Atlas – Multi‑role Dashboard',
    description: 'Unified dashboard for Field Officers, Committee Members, and Administrators with tasks, stats, and maps.'
  },
  '/interactive-web-gis-map': {
    title: 'FRA Atlas – Interactive Web GIS',
    description: 'Search, view layers, measure and analyze geospatial data for forest rights and land use.'
  },
  '/public-map-viewer': {
    title: 'FRA Atlas – Public Map Viewer',
    description: 'Explore approved rights, layers and boundaries for transparency and governance.'
  },
  '/claim-verification': {
    title: 'FRA Atlas – Claim Verification',
    description: 'Verify submitted claims with field evidence, documents and geospatial overlays.'
  },
  '/claim-upload-interface': {
    title: 'FRA Atlas – Upload Claim',
    description: 'Simple, guided flow to upload and track forest rights claims with required metadata.'
  },
  '/committee-review': {
    title: 'FRA Atlas – Committee Review',
    description: 'Collaborative committee review with discussion, voting, legal references and evidence comparison.'
  },
};

export default function Seo() {
  const { pathname } = useLocation();
  const meta = metaByPath[pathname] || { 
    title: 'FRA Atlas',
    description: 'End‑to‑end Forest Rights management: claims, verification, review, and public transparency.'
  };
  const url = typeof window !== 'undefined' ? window.location.origin + pathname : pathname;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="FRA Atlas" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="theme-color" content="#14532d" />
    </Helmet>
  );
}
