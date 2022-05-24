import React from 'react';
import { graphql } from 'gatsby';
import { Header } from '../components/header';
import LocalizedLink from '../components/localizedLink';
import getTagTranslation from '../utils/getTagTranslation';
import { Img } from '../components/img';
import { Flex, Tag, TagLabel, Heading } from '@chakra-ui/react';

const TagList = ({ data: { allMdx }, pageContext }) => {
  return (
    <div className="site-wrapper">
      <Header title={pageContext.title} description={pageContext.description} />
      <main className="site-main outer">
        <div className="inner">
          <Flex textAlign="center" alignItems="center" mt={12}>
            <Tag
              size="lg"
              fontSize="6xl"
              mx="auto"
              color="gray.300"
              backgroundColor="green.dark"
              borderRadius="full"
              padding={8}
              textTransform="capitalize"
            >
              <TagLabel>
                #{getTagTranslation(pageContext.tag, pageContext.locale, 1, 1)}
              </TagLabel>
            </Tag>
          </Flex>
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
                      <Heading as="h2" fontSize="3xl" mt={0}>
                        {post.frontmatter.title}
                      </Heading>
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
  );
};

export default TagList;

export const query = graphql`
  query TagList($locale: String!, $dateFormat: String!, $tag: String!) {
    rawData: allFile(filter: { sourceInstanceName: { eq: "translations" } }) {
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
        fields: { locale: { eq: $locale } }
        frontmatter: { tags: { in: [$tag] } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            tags
            caption {
              childImageSharp {
                gatsbyImageData(
                  layout: FULL_WIDTH
                  placeholder: BLURRED
                  formats: [AUTO, AVIF, WEBP]
                )
              }
            }
            date(formatString: $dateFormat)
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
