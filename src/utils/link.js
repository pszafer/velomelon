import React from 'react';
import GatsbyLink from 'gatsby-link';
import { Link as CharkaLink } from '@chakra-ui/react';

const Link = (props) => {
  const isExternalLink = props.to.startsWith('http');
  if (!isExternalLink) {
    return (
      <CharkaLink
        sx={{
          _hover: {
            textDecoration: 'none',
          },
          _focus: {
            outline: 0,
          },
        }}
        as={GatsbyLink}
        {...props}
      >
        {props.children}
      </CharkaLink>
    );
  }
  return (
    <a target="_blank" href={props.to} {...props} rel="noopener noreferrer">
      {props.children}
    </a>
  );
};

export default Link;
