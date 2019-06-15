import React from "react"
import { graphql } from "gatsby"
import { Header } from "../components/header"
import LocalizedLink from "../components/localizedLink"
import useTranslations from "../components/useTranslations"
import BackgroundImage from 'gatsby-background-image'

const Tags = ({ data: { allMdx, captionTag }, pageContext }) => {
    // useTranslations is aware of the global context (and therefore also "locale")
    // so it'll automatically give back the right translations
    const { tags } = useTranslations()
    var tagHash = {};
  allMdx.edges.map(({ node: post }) => post.frontmatter.tags.forEach(x => tagHash[x] = tagHash[x] ? tagHash[x] + 1 : 1))
  const tagList = Object.keys(tagHash)
    return (
        <div className="site-wrapper">
            <Header
                title={pageContext.title}
                description={pageContext.description}
            />
            <main className="site-main outer">
                <BackgroundImage Tag="div"
                  className="site-cover"
                  title=""
                  fluid={captionTag.childImageSharp.fluid}
                  style={{
                    // Defaults are overwrite-able by setting one or each of the following:
                    width: '100%',
                    // height: '100%',
                    position: 'absolute'
                  }}
                />
                <div className="inner">
                    <article className="post-full post">
                        <header className="post-full-header">
                            <h1 className="post-full-title">{tags}</h1>
                        </header>
                        <section className="post-full-content">
                            <div className="post-content">
                                <ul className="allTags">
                                    {(tagList.map(x =>
                                        <li key={x}>
                                            <span className={"post-card-tags tagcloud " + determineCssClass(tagHash[x])  }>
                                                <LocalizedLink to={"/tag/"+x}>{x}</LocalizedLink>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </article>
                </div>
            </main>
        </div>
    )
}

function determineCssClass(tagItems){
  console.log(tagItems);
    if (tagItems > 16) {
        return "tagclass-16"
    } else if (tagItems > 8){
        return "tagclass-8"
    } else if (tagItems > 2) {
        return "tagclass-4"
    }
    return "tagclass-2"
}

export default Tags

export const query = graphql`
  query Tags($locale: String!) {
    allMdx(
      filter: { fields: { locale: { eq: $locale } isHidden: { eq: false } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
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
    captionTag: file(relativePath: { eq: "tag_caption.jpg" }) {
      childImageSharp {
        fluid(quality: 90, maxWidth: 4160){
          ...GatsbyImageSharpFluid_withWebp
        }
      }
  	}
  }
`