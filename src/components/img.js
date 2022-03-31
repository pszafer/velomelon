import React from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';

export const Img = ({ image, alt = '', props }) => {
  return <GatsbyImage image={image} alt={alt} {...props} />;
};
