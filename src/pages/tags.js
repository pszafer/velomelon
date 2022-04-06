import React from 'react';
import { graphql } from 'gatsby';
import { Header } from '../components/header';
import LocalizedLink from '../components/localizedLink';
import useTranslations from '../components/useTranslations';
import { getTranslation } from '../utils/shared';
import { BackgroundHeader } from '../components/backgroundimg';
import { Box, Tag, TagLabel, Heading } from '@chakra-ui/react';
import { TagCloud } from 'react-tagcloud';

const Tags = ({ data: { allMdx, captionTag }, pageContext }) => {
  const { tags } = useTranslations();
  var tagHash = {};
  allMdx.edges.map(({ node: post }) =>
    post.frontmatter.tags.forEach(
      (x) => (tagHash[x] = tagHash[x] ? tagHash[x] + 1 : 1)
    )
  );

  const tagList = Object.keys(tagHash).map((value) => {
    return {
      value,
      count: tagHash[value] * 2,
    };
  });

  const customRenderer = (tag, size, color) => {
    return (
      <LocalizedLink
        to={'/tag/' + tag.value}
        key={tag.value}
        margin={4}
        padding={2}
        fontSize={`${size * 2}px`}
      >
        <Tag
          size="lg"
          fontSize={`${size * 2}px`}
          color="gray.600"
          backgroundColor={color}
          borderRadius="full"
          padding={8}
          textTransform="capitalize"
        >
          <TagLabel>{getTranslation(tag.value, pageContext.locale)}</TagLabel>
        </Tag>
      </LocalizedLink>
    );
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
            width: '100%',
            position: 'absolute',
          }}
        />
        <div className="inner">
          <article className="post-full post">
            <header className="post-full-header">
              <Heading
                fontSize="8xl"
                as="h1"
                color="green.light"
                textShadow="3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
              >
                {tags}
              </Heading>
            </header>
            <Box
              pos="relative"
              as="section"
              rounded="lg"
              background="white"
              padding="70px 100px 0"
              minHeight="230px"
              lineHeight="tall"
              fontSize="4xl"
              boxShadow="2xl"
              margin="0 auto"
              className="post-full-content"
            >
              <div className="post-content">
                <TagCloud
                  minSize={12}
                  maxSize={35}
                  tags={tagList}
                  renderer={customRenderer}
                  colorOptions={{
                    alpha: 0.5,
                    luminosity: 'dark',
                    format: 'rgba',
                  }}
                />
                {/* <ul className="allTags">
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
                </ul> */}
              </div>
            </Box>
          </article>
        </div>
      </main>
    </div>
  );
};

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
        gatsbyImageData(quality: 90, width: 4160)
      }
    }
  }
`;
