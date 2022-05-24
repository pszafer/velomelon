import React, { useState, useRef } from 'react';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import { MDXProvider } from '@mdx-js/react';
import { Header } from '../components/header';
import MdxLink from '../components/mdx/mdxLink';
import MdxYoutube from '../components/mdx/mdxYoutube';
import MdxMap from '../components/mdx/mdxMap';
import MdxSphere from '../components/mdx/mdxSphere';
import Readmore from '../components/readmore';
import ReadProgressLine from '../components/progress';
import { getTranslation } from '../utils/shared';
import LocalizedLink from '../components/localizedLink';
import { Img } from '../components/img';
import MdxGrid from '../components/mdx/mdxGrid';
import Seo from '../components/seo';
import { getImage } from 'gatsby-plugin-image';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Heading,
  Box,
  Text,
} from '@chakra-ui/react';
import Carousel from '../components/carousel';
import { BackgroundHeader } from '../components/backgroundimg';

const Post = (props) => {
  const {
    data: { mdx, allFile },
    pageContext,
    location,
  } = props;
  const [currentSlide, setCurrentSlide] = useState(0);
  var albumData = [];
  // const album = React.useMemo(() => albumData, [albumData]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef();
  const handleAlbumClick = (photoAlt) => {
    const photoId = albumData.findIndex(
      ({ node: { relativePath } }) => photoAlt === relativePath
    );
    setCurrentSlide(photoId);
    onOpen();
  };
  const components = {
    a: ({ children, ...props }) => {
      return <MdxLink {...props}>{children}</MdxLink>;
    },
    gpx: ({ children, zoom = 4 }) => {
      return (
        <MdxMap url={location.href} zoom={zoom}>
          {children}
        </MdxMap>
      );
    },
    sphere: ({ children }) => {
      return <MdxSphere url={location.href}>{children}</MdxSphere>;
    },
    youtube: MdxYoutube,
    wrapper: ({ children }) => {
      return <>{children}</>;
    },
    grid: ({ children, ...props }) => {
      if (children.props && children.props.children) {
        return null;
      }
      const allImages = allFile?.edges;
      const imgNamesArray = children
        .split('-')
        .filter((x) => x.includes('./'))
        .map((x) => x.replace('./', `${pageContext.slug}/`).trim());
      const images = allImages.filter(({ node: { relativePath } }) =>
        imgNamesArray.includes(relativePath)
      );
      albumData.push(...images);

      //
      return (
        <MdxGrid
          images={images}
          handleAlbumClick={handleAlbumClick}
          slug={pageContext.slug}
          {...props}
        >
          {children}
        </MdxGrid>
      );
    },
  };
  return (
    <div className="site-wrapper">
      <Seo
        pageContext={pageContext}
        title={pageContext.title}
        description={pageContext.description}
        lang={pageContext.locale}
        ogImage={getImage(
          mdx.frontmatter.caption.childImageSharp.gatsbyImageData
        )}
      />
      <Header title={pageContext.title} description={pageContext.description} />
      <main className="site-main outer">
        <BackgroundHeader
          Tag="div"
          className="site-cover"
          title=""
          background={mdx.frontmatter.caption}
          style={{
            width: '100%',
            position: 'absolute',
          }}
        />
        <div className="inner">
          <article className="post-full post">
            <header className="post-full-header">
              <section className="post-full-meta">
                <Text
                  as="time"
                  color="green.dark"
                  textShadow="1px 1px 0 black"
                  dateTime={mdx.frontmatter.dateShort}
                >
                  {mdx.frontmatter.dateFull}
                </Text>
                <span className="date-divider">/</span>
                <ul className="tags">
                  {mdx.frontmatter.tags.map((tag, index) => (
                    <li key={tag}>
                      <LocalizedLink to={'/tag/' + tag}>
                        {getTranslation(tag, pageContext.locale)}
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </section>
              <Heading
                fontSize={{ base: '6xl', md: '8xl' }}
                as="h1"
                color="green.light"
                textShadow="3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
              >
                {mdx.frontmatter.title}
              </Heading>
            </header>
            <figure className="post-full-image">
              <Img
                image={mdx.frontmatter.caption.childImageSharp.gatsbyImageData}
              />
            </figure>
            <Box
              pos="relative"
              as="section"
              rounded="lg"
              background="white"
              pt={{ base: 12, md: 16 }}
              px={{ base: 12, md: 24 }}
              minHeight="230px"
              lineHeight="tall"
              fontSize={{ base: '3xl', md: '4xl' }}
              boxShadow="2xl"
              margin="0 auto"
              className="post-full-content"
            >
              <div className="post-content">
                <MDXProvider components={components}>
                  <MDXRenderer>{mdx.body}</MDXRenderer>
                </MDXProvider>
              </div>
            </Box>
          </article>
        </div>
      </main>
      <Readmore previous={pageContext.previous} next={pageContext.next} />
      <ReadProgressLine {...props} />
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        blockScrollOnMount={true}
      >
        <ModalOverlay />
        <ModalContent maxWidth="90vw" maxHeight="90vh" bg="gray.200">
          <ModalCloseButton />
          <ModalBody>
            <Carousel album={albumData} currentSlide={currentSlide} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Post;

export const query = graphql`
  query Post(
    $locale: String!
    $title: String!
    $dateFormat: String!
    $slug: String!
  ) {
    mdx(
      frontmatter: { title: { eq: $title } }
      fields: { locale: { eq: $locale } }
    ) {
      frontmatter {
        title
        tags
        dateFull: date(formatString: "DD MMMM YYYY", locale: $locale)
        dateShort: date(formatString: $dateFormat, locale: $locale)
        caption {
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
              placeholder: BLURRED
              formats: [AUTO, AVIF, WEBP]
            )
          }
        }
      }
      body
    }
    allFile(
      filter: {
        extension: { in: ["jpg", "png", "jpeg"] }
        relativeDirectory: { eq: $slug }
      }
    ) {
      edges {
        node {
          childImageSharp {
            id
            gatsbyImageData
          }
          relativeDirectory
          relativePath
        }
      }
    }
  }
`;
