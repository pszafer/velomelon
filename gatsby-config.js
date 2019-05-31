module.exports = {
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // `gatsby-transformer-remark`,
    {
      resolve: `gatsby-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images-grid`,
            options: {
              gridGap: "20px"
            }
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1035,
              sizeByPixelDensity: true,
              withWebp: true,
              linkImagesToOriginal: false,
              // wrapperStyle: fluidResult => `flex:${_.round(fluidResult.aspectRatio, 2)};`,
            }
          },
          {
            resolve: `gatsby-remark-embed-video`,
            options: {
              width: 800,
              height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true //Optional: Disable insertion of <style> border: 0
            }
          },
          // {
          //   resolve: "gatsby-remark-embed-video",
          //   options: {
          //     width: 800,
          //     ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
          //     height: 400, // Optional: Overrides optional.ratio
          //     related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
          //     noIframeBorder: true //Optional: Disable insertion of <style> border: 0
          //   }
          // },
          // {
          //   resolve: "gatsby-remark-images-grid",
          //   options: {
          //     className: "myCustomClassName",
          //     gridGap: "20px",
          //     margin: "20px auto",
          //   },
          // },
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
    {
      resolve: 'gatsby-plugin-react-leaflet',
      options: {
        linkStyles: true // (default: true) Enable/disable loading stylesheets via CDN
      }
    }
  ],
}
