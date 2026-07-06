import Head from "next/head";

const SEO = ({ title, description, keywords, image, url }) => {
  const siteTitle = "Green World Trip";
  const defaultDescription = "Experience the best tours and travel packages with Green World Trip. Book your next domestic or international vacation today!";
  const defaultKeywords = "travel, tours, vacation, packages, green world trip, holiday, booking";
  const defaultImage = "https://via.placeholder.com/1200x630.png?text=Green+World+Trip";
  const defaultUrl = "https://www.greenworldtrip.com";

  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || defaultImage;
  const metaUrl = url || defaultUrl;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={metaUrl} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />
    </Head>
  );
};

export default SEO;
