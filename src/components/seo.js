/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { getLocale } from '../utils/shared';
import { useStaticQuery, graphql } from 'gatsby';

const Seo = ({
  description,
  lang,
  meta,
  keywords,
  title,
  pageContext,
  ogImage,
}) => {
  const {
    file: { childImageSharp: logo },
  } = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "logo600.png" }) {
        childImageSharp {
          fav64: gatsbyImageData(width: 64, height: 64, formats: [PNG])
          fav32: gatsbyImageData(width: 32, height: 32, formats: [PNG])
          fav16: gatsbyImageData(width: 16, height: 16, formats: [PNG])
          logo: gatsbyImageData(formats: [PNG])
        }
      }
    }
  `);
  // const { localeInfo } = React.useContext(LocaleContext)
  const { fav16, fav32, fav64 } = logo;
  ogImage = ogImage || logo.logo;
  const defaultTitle = getLocale(lang).defaultTitle;
  title = title || pageContext.title;
  title = title === defaultTitle ? title : title + ' - ' + defaultTitle;
  const author = 'Velomelon';
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s`}
      link={[
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: `${fav16.images.fallback.src}`,
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: `${fav32.images.fallback.src}`,
        },
        {
          rel: 'shortcut icon',
          type: 'image/png',
          href: `${fav64.images.fallback.src}`,
        },
      ]}
      meta={[
        {
          name: `description`,
          content: description,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: 'og:image',
          content: ogImage?.images.fallback.src,
        },
        {
          name: 'og:image:width',
          content: `${ogImage.width}`,
        },
        {
          name: 'og:image:height',
          content: `${ogImage.height}`,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:creator`,
          content: author,
        },
        {
          name: 'twitter:image',
          content: ogImage?.images.fallback.src,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: description,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: [
                  `blog`,
                  `velomelon`,
                  `travel`,
                  `bicycle`,
                  pageContext.title,
                  ...(pageContext.tags ? pageContext.tags : []),
                ].join(`, `),
              }
            : []
        )
        .concat(meta)}
    />
  );
};

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
  description: ``,
};

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  ogImage: PropTypes.object,
};

export default Seo;
