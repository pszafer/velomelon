import React from 'react';
import { graphql } from 'gatsby';
import { Header } from '../components/header';
import LocalizedLink from '../components/localizedLink';
import useTranslations from '../components/useTranslations';
import { getTranslation } from '../utils/shared';
import { BackgroundHeader } from '../components/backgroundimg';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Tag,
  TagLabel,
  Avatar,
  Heading,
} from '@chakra-ui/react';
const Tags = ({ data: { allMdx, captionTag }, pageContext }) => {
  const { tags } = useTranslations();
  var tagHash = {};
  allMdx.edges.map(({ node: post }) =>
    post.frontmatter.tags.forEach(
      (x) => (tagHash[x] = tagHash[x] ? tagHash[x] + 1 : 1)
    )
  );
  const tagList = Object.keys(tagHash);

  const determineSize = (tagItems) => {
    console.log(tagItems);
    if (tagItems > 16) {
      return '8xl';
    } else if (tagItems > 8) {
      return '6xl';
    } else if (tagItems > 2) {
      return '3xl';
    }
    return 'xl';
  };
  return (
    <div className="site-wrapper">
      <Header title={pageContext.title} description={pageContext.description} />
      <main className="site-main outer">
        <BackgroundHeader
          Tag="div"
          className="site-cover"
          title=""
          background={captionTag}
          style={{
            // Defaults are overwrite-able by setting one or each of the following:
            width: '100%',
            // height: '100%',
            position: 'absolute',
          }}
        />
        <div className="inner">
          <article className="post-full post">
            <header className="post-full-header">
              <Heading size="5xl" as="h1" className="post-full-title">
                {tags}
              </Heading>
            </header>
            <section className="post-full-content">
              <div className="post-content">
                <ul className="allTags">
                  {tagList.map((x) => (
                    <li key={x}>
                      <LocalizedLink to={'/tag/' + x}>
                        <Tag
                          size={determineSize(tagHash[x])}
                          colorScheme="red"
                          borderRadius="full"
                        >
                          <Avatar
                            src="https://bit.ly/sage-adebayo"
                            size="xs"
                            name="Segun Adebayo"
                            ml={-1}
                            mr={2}
                          />
                          <TagLabel>
                            {getTranslation(x, pageContext.locale)}
                          </TagLabel>
                        </Tag>
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
};

function determineCssClass(tagItems) {
  console.log(tagItems);
  if (tagItems > 16) {
    return 'tagclass-16';
  } else if (tagItems > 8) {
    return 'tagclass-8';
  } else if (tagItems > 2) {
    return 'tagclass-4';
  }
  return 'tagclass-2';
}

export default Tags;

export const query = graphql`
  query Tags($locale: String!) {
    allMdx(
      filter: { fields: { locale: { eq: $locale }, isHidden: { eq: false } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            tags
            caption {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 500)
              }
            }
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
    captionTag: file(relativePath: { eq: "tag_caption.jpg" }) {
      childImageSharp {
        fluid(quality: 90, maxWidth: 4160) {
          ...GatsbyImageSharpFluid_withWebp
        }
        gatsbyImageData(quality: 90, width: 4160)
      }
    }
  }
`;
