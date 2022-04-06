import { extendTheme } from '@chakra-ui/react';
const theme = () => {
  return {
    styles: {
      global: {
        body: {
          bg: 'gray.100',
        },
      },
    },
    colors: {
      background: 'yellow',
      green: {
        dark: 'rgb(27, 137, 7)',
        light: 'rgba(39, 255, 0, 0.7)',
      },
    },
  };
};

export default extendTheme(theme());
