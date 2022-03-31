import React from 'react';
import { graphql } from 'gatsby';
import { Header } from '../components/header';
import LocalizedLink from '../components/localizedLink';
import { Img } from '../components/img';
import getTagTranslation from '../utils/getTagTranslation';
import Footer from '../components/footer';

const Index = ({ data: { allMdx }, pageContext }) => {
  return (
    <div className="site-wrapper">
      <Header title={pageContext.title} description={pageContext.description} />
      <main className="site-main outer">
        <div className="inner">
          <div className="post-feed">
            {allMdx.edges.map(({ node: post }) => (
              <article
                key={`${post.frontmatter.title}-${post.fields.locale}`}
                className="post-card post"
              >
                <LocalizedLink
                  alt={post.frontmatter.title}
                  className="post-card-image-link"
                  to={`/${post.parent.relativeDirectory}`}
                >
                  <Img
                    className="post-card-image"
                    image={
                      post.frontmatter.caption.childImageSharp.gatsbyImageData
                    }
                  />
                </LocalizedLink>
                <div className="post-card-content">
                  <LocalizedLink
                    alt={post.frontmatter.title}
                    className="post-card-content-link"
                    to={`/${post.parent.relativeDirectory}`}
                  >
                    <header className="post-card-header">
                      <span className="post-card-tags">
                        {post.frontmatter.tags.map((tag, index) =>
                          getTagTranslation(
                            tag,
                            pageContext.locale,
                            index,
                            post.frontmatter.tags.length
                          )
                        )}
                      </span>
                      <h2 className="post-card-title">
                        {post.frontmatter.title}
                      </h2>
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
      <Footer
        currentPage={pageContext.currentPage}
        numPages={pageContext.numPages}
      />
    </div>
  );
};

export default Index;

export const query = graphql`
  query Index(
    $locale: String!
    $dateFormat: String!
    $skip: Int!
    $limit: Int!
  ) {
    allMdx(
      filter: { fields: { locale: { eq: $locale }, isHidden: { eq: false } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          frontmatter {
            title
            caption {
              childImageSharp {
                gatsbyImageData(quality: 90, width: 500)
              }
            }
            date(formatString: $dateFormat)
            tags
          }
          excerpt(pruneLength: 280)
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
`;
