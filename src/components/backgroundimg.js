import React from 'react';
import { getImage } from 'gatsby-plugin-image';
import { convertToBgImage } from 'gbimage-bridge';
import BackgroundImage from 'gatsby-background-image';

export const BackgroundHeader = ({
  children,
  className,
  background,
  ...props
}) => {
  const image = getImage(background);
  const bgImage = convertToBgImage(image);

  return (
    <BackgroundImage Tag="header" className={className} {...props} {...bgImage}>
      {children}
    </BackgroundImage>
  );
};
