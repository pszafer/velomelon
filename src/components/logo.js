import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Img } from './img';
import { Box } from '@chakra-ui/react';
const Logo = ({ className, alt, logoType, logo }) => {
  const { logo600 } = useStaticQuery(
    graphql`
      query {
        logo600: file(relativePath: { eq: "logo600.png" }) {
          childImageSharp {
            gatsbyImageData(height: 28, layout: FIXED)
          }
        }
      }
    `
  );
  if (!logo) {
    logo = logo600.childImageSharp.gatsbyImageData;
  }
  if (logoType === 'svg') {
    return <img className={className} src={logo} alt={alt} />;
  } else {
    return (
      <Box className={className} maxWidth="40">
        <Img image={logo} />
      </Box>
    );
  }
};

export default Logo;
