import React from 'react';
import { Img } from '../img';
import { Box } from '@chakra-ui/react';

const MdxGrid = ({ children, handleAlbumClick, images, slug, ...props }) => {
  const columns = props.columns
    ? props.columns
    : images.length < 4
    ? images.length
    : 3;
  if (!children.props || !children.props.children) {
    return (
      <MasonryLayout
        columns={columns}
        gap={25}
        handleAlbumClick={handleAlbumClick}
      >
        {images.map(
          (
            {
              node: {
                childImageSharp: { gatsbyImageData },
                relativePath,
              },
            },
            i
          ) => {
            // const aspectRatio = gatsbyImageData.width / gatsbyImageData.height;
            return (
              <div
                key={`masDiv1${i}`}
                className="gatsbyRemarkImagesGrid-item"
                onClick={() => handleAlbumClick(relativePath)}
                role="button"
              >
                <Img
                  alt={relativePath}
                  image={gatsbyImageData}
                  // style={{ flex: round(aspectRatio, 2) }}
                />
              </div>
            );
          }
        )}
      </MasonryLayout>
    );
  }
  return <></>;
};

export default MdxGrid;

const MasonryLayout = ({ columns, children, handleAlbumClick }) => {
  const columnWrapper = {};
  const result = [];

  // create columns
  for (let i = 0; i < columns; i++) {
    columnWrapper[`column${i}`] = [];
  }

  // divide children into columns
  for (let i = 0; i < children.length; i++) {
    const columnIndex = i % columns;
    columnWrapper[`column${columnIndex}`].push(children[i]);
  }

  // wrap children in each column with a div
  for (let i = 0; i < columns; i++) {
    result.push(
      <div
        key={`masDiv2${i}`}
        className="gatsbyRemarkImagesGrid-column"
        style={{
          flex: 1,
        }}
      >
        {columnWrapper[`column${i}`]}
      </div>
    );
  }

  return (
    <Box mt={2} className="gatsbyRemarkImagesGrid" style={{ display: 'flex' }}>
      {result}
    </Box>
  );
};
