/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { getLocale } from "../utils/shared"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, keywords, title }) {
    const favicon = useStaticQuery(graphql`
        query {
            file(relativePath: { eq: "logo600.png" }) {
                childImageSharp {
                    fav64: fixed(width:64, height:64){
                        base64
                    }
                }
            }
            file(relativePath: { eq: "logo600.png" }) {
                childImageSharp {
                    fav32: fixed(width:32, height:32){
                        base64
                    }
                }
            }
            file(relativePath: { eq: "logo600.png" }) {
                childImageSharp {
                    fav16: fixed(width:16, height:16){
                        base64
                    }
                }
            }
        }
    `)
    // const { localeInfo } = React.useContext(LocaleContext)
    const defaultTitle = getLocale(lang).defaultTitle;
    title = title == defaultTitle ? title : title + ' - ' + defaultTitle;
    const metaDescription = description
    const author = "at"
    return (
        <Helmet
            htmlAttributes={{
                lang,
            }}
            title={title}
            titleTemplate={`%s`}
            link={[
                { rel: "icon", type: "image/png", sizes: "16x16", href: `${favicon.file.childImageSharp.fav16.base64}` },
                { rel: "icon", type: "image/png", sizes: "32x32", href: `${favicon.file.childImageSharp.fav32.base64}` },
                { rel: "shortcut icon", type: "image/png", href: `${favicon.file.childImageSharp.fav64.base64}` },
            ]}
            meta={[
                {
                    name: `description`,
                    content: metaDescription,
                },
                {
                    property: `og:title`,
                    content: title,
                },
                {
                    property: `og:description`,
                    content: metaDescription,
                },
                {
                    property: `og:type`,
                    content: `website`,
                },
                {
                    name: `twitter:card`,
                    content: `summary`,
                },
                {
                    name: `twitter:creator`,
                    content: author,
                },
                {
                    name: `twitter:title`,
                    content: title,
                },
                {
                    name: `twitter:description`,
                    content: metaDescription,
                },
            ]
                .concat(
                    keywords.length > 0
                        ? {
                            name: `keywords`,
                            content: keywords.join(`, `),
                        }
                        : []
                )
                .concat(meta)}
        />
    )
}

SEO.defaultProps = {
    lang: `en`,
    meta: [],
    keywords: [],
    description: ``,
}

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    keywords: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string.isRequired,
}

export default SEO
