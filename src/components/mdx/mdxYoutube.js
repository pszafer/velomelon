import React from 'react';
import { Box } from '@chakra-ui/react';
// Only use <LocalizedLink /> for internal links
const MdxYoutube = ({ children }) => (
  <Box
    pos="relative"
    height={0}
    width="90%"
    overflow="hidden"
    maxWidth="100%"
    my={2}
    pb="55%"
  >
    <iframe
      src={`https://www.youtube.com/embed/${children}`}
      allowFullScreen="allowFullScreen"
      title="children"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      frameBorder="0"
    ></iframe>
  </Box>
);

export default MdxYoutube;
