import React from "react"
import { graphql } from "gatsby"
import { Header } from "../components/header"
import LocalizedLink from "../components/localizedLink"
import useTranslations from "../components/useTranslations"
import Img from 'gatsby-image'

const Tags = ({ data: { allMdx, rawData }, pageContext }) => {
    return (
        <div className="site-wrapper">
            <Header
                title={pageContext.title}
                description={pageContext.description}
            />
            <main className="site-main outer">
                <div className="inner">
                    <div className="post-feed">
                        {allMdx.edges.map(({ node: post }) => (
                            <article key={`${post.frontmatter.title}-${post.fields.locale}`} className="post-card post">
                                <LocalizedLink alt={post.frontmatter.title} className="post-card-image-link" to={`/${post.parent.relativeDirectory}`}>
                                    <Img className="post-card-image" fluid={post.frontmatter.caption.childImageSharp.fluid} />
                                </LocalizedLink>
                                <div className="post-card-content">
                                    <LocalizedLink alt={post.frontmatter.title} className="post-card-content-link" to={`/${post.parent.relativeDirectory}`}>
                                        <header className="post-card-header">
                                            <span className="post-card-tags">TAGS</span>
                                            <h2 className="post-card-title">{post.frontmatter.title}</h2>
                                        </header>
                                        <section className="post-card-excerpt">
                                            <p>{post.excerpt}</p>
                                        </section>
                                    </LocalizedLink>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Tags

export const query = graphql`
  query Tags($locale: String!, $dateFormat: String!, $tag: String!) {
    rawData: allFile(filter: { sourceInstanceName: { eq: "translations" } }) 
    {
        edges {
        node {
          EN: childrenEnJson {
            text
            translation
          }
          PL: childrenPlJson {
            text
            translation
          }
        }
      }
    }
    allMdx(
      filter: {
                fields:{ locale: {eq:$locale } }
                frontmatter: {tags: {in: [$tag]}}
            }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            caption {
              childImageSharp {
                fluid(quality: 90, maxWidth: 700) {
              ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            date(formatString: $dateFormat)
          }
          excerpt(pruneLength:280)
          fields {
            locale
          }
          parent {
            ... on File {
              relativeDirectory
            }
          }
        }
      }
    }
  }
`