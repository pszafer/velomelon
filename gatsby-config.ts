import type { GatsbyConfig } from "gatsby"
import { round } from "lodash"
import path from "path"

// import rehypeAutolinkHeadings from "rehype-autolink-headings"
const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `https://velomelon.com`,
  },
  plugins: [
    {
      resolve: '@chakra-ui/gatsby-plugin',
      options: {
        /**
         * @property {boolean} [resetCSS=true]
         * if false, this plugin will not use `<CSSReset />
         */
        resetCSS: true,
        /**
         * @property {boolean} [isUsingColorMode=true]
         * if false, this plugin will not use <ColorModeProvider />
         */
        isUsingColorMode: false,
      },
    },
    
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `dominantColor`,
          quality: 50,
          breakpoints: [750, 1080, 1366, 1920],
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {},
          avifOptions: {},
        }
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        rehypePlugins: [
          // Generate heading ids for rehype-autolink-headings
          require("rehype-slug"),
          [
            require('rehype-autolink-headings'),
            {
              behavior: 'wrap',
            },
          ],
        ],
        gatsbyRemarkPlugins: [
          // {
          //   resolve: `gatsby-remark-images-grid`,
          //   options: {
          //     gridGap: "20px",
          //     className: "gatsbyRemarkImagesGrid"
          //   }
          // },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1035,
              showCaptions: ['alt', 'title'],
              // sizeByPixelDensity: true,
              withWebp: true,
              linkImagesToOriginal: false,
              wrapperStyle: (f) => `flex:${round(f.aspectRatio, 2)};`,
            },
          },
        ],
      },
    },
    // `gatsby-remark-images-modal`,
    // `gatsby-mdx`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve('config/translations'),
        name: `translations`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve('blog'),
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve('assets'),
        name: `assets`,
      },
    },
    `gatsby-transformer-json`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sitemap`,
    'gatsby-plugin-netlify'
  ]
}
export default config
