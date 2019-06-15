import React from "react"
import { graphql } from "gatsby"
import { Header } from "../components/header"
import LocalizedLink from "../components/localizedLink"
import useTranslations from "../components/useTranslations"
import Img from 'gatsby-image'

const Index = ({ data: { allMdx }, pageContext }) => {
  // useTranslations is aware of the global context (and therefore also "locale")
  // so it'll automatically give back the right translations
  const { hello, subline } = useTranslations()
  allMdx.edges.map(({ node: post }) => {
    if (!post.frontmatter.caption){
      console.log("dupa")
      console.log(post);
    }
  })
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
                      <span className="post-card-tags">
                        {post.frontmatter.tags.join(', ')}
                      </span>
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

function logPost(post){
  if (!post.frontmatter.caption){
    console.log(post)
  }
}

export default Index

export const query = graphql`
  query Index($locale: String!, $dateFormat: String!) {
    allMdx(
      filter: { fields: { locale: { eq: $locale } isHidden: { eq: false } } }
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
            tags
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