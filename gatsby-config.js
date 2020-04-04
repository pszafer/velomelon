const { round } = require(`lodash`)

module.exports = {
  siteMetadata: {
    siteUrl: `https://velomelon.com`,
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          // {
          //   resolve: `gatsby-remark-images-grid`,
          //   options: {
          //     gridGap: "20px",
          //     className: "gatsbyRemarkImagesGrid"
          //   }
          // },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1035,
              showCaptions: ['alt', 'title'],
              // sizeByPixelDensity: true,
              withWebp: true,
              linkImagesToOriginal: false,
              wrapperStyle: f => `flex:${round(f.aspectRatio, 2)};`,
            }
          }
        ]
      }
    },
    `gatsby-remark-images-modal`,
    // `gatsby-mdx`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/config/translations`,
        name: `translations`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/assets`,
        name: `assets`,
      },
    },
    `gatsby-transformer-json`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-sitemap`
  ],
}
