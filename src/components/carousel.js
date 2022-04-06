import React, { useCallback, useEffect, useState } from 'react';
import { Box, Flex, useMediaQuery, HStack, Button } from '@chakra-ui/react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Img } from './img';
import Logo from './logo';
const PlaceHolder = () => (
  <img
    alt="Blur"
    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"
    layout="fill"
  />
);

const Slide = ({ imgSrc, inView, name }) => {
  return (
    <Flex
      h="86vh"
      justify="center"
      minW="100%"
      mx={4}
      overflow="hidden"
      position="relative"
    >
      {inView ? (
        <>
          <Box pos="absolute" left="1rem" top="2rem" opacity="0.9" zIndex={1}>
            <Logo className="floating-header-logo" logoType="600" />
          </Box>
          <Img alt={name} image={imgSrc} objectFit="contain" />
        </>
      ) : (
        <PlaceHolder />
      )}
    </Flex>
  );
};

const Carousel = ({ album, currentSlide }) => {
  const [slidesInView, setSlidesInView] = useState(new Set());
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    skipSnaps: false,
    startIndex: currentSlide,
    inViewThreshold: 0.3,
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  const leftRightHelper = useCallback(
    (event) => {
      if (emblaApi) {
        if (event.keyCode === 39) {
          //right
          emblaApi.scrollNext();
        } else if (event.keyCode === 37) {
          //left
          emblaApi.scrollPrev();
        }
      }
    },
    [emblaApi]
  );

  useEffect(() => {
    document.addEventListener('keydown', leftRightHelper, false);
    return () =>
      document.removeEventListener('keydown', leftRightHelper, false);
  }, [leftRightHelper]);

  const findSlidesInView = useCallback(() => {
    if (!emblaApi) return;

    setSlidesInView((slidesInView) => {
      if (slidesInView.length === emblaApi.slideNodes().length) {
        emblaApi.off('select', findSlidesInView);
      }
      const inView = emblaApi
        .slidesInView(true)
        .filter(
          (index) =>
            !slidesInView.has(index) ||
            !slidesInView.has(index - 1) ||
            !slidesInView.has(index + 1)
        );
      const viewed = inView[0];
      if (viewed >= 0) {
        slidesInView.add(viewed);
        if (viewed - 1 > 0) {
          slidesInView.add(viewed - 1);
        }
        if (viewed + 1 < emblaApi.slideNodes().length) {
          slidesInView.add(viewed + 1);
        }
        return new Set(slidesInView);
      }
      return slidesInView;
    });
  }, [emblaApi, setSlidesInView]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    findSlidesInView();
    emblaApi.on('select', onSelect);
    emblaApi.on('select', findSlidesInView);
  }, [emblaApi, onSelect, findSlidesInView]);

  return (
    <Box
      ref={emblaRef}
      alignItems="center"
      justify="center"
      overflow="hidden"
      p={4}
      w={'100%'}
      mt={2}
    >
      <Flex as="figure">
        {album.map(
          (
            {
              node: {
                childImageSharp: { gatsbyImageData },
                relativePath,
              },
            },
            sid
          ) => (
            <Slide
              key={`slide${sid}`}
              imgSrc={gatsbyImageData}
              name={relativePath}
              inView={slidesInView.has(sid)}
            />
          )
        )}
      </Flex>
      {isLargerThan800 ? (
        <HStack justify="center" mt={4}>
          <Button
            onClick={scrollPrev}
            variant="images"
            disabled={!prevBtnEnabled}
          >
            <ArrowBackIcon />
          </Button>
          <Button
            onClick={scrollNext}
            variant="images"
            disabled={!nextBtnEnabled}
          >
            <ArrowForwardIcon />
          </Button>
        </HStack>
      ) : null}
    </Box>
  );
};

export default Carousel;
