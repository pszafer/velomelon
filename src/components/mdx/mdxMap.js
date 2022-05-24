import React, { useMemo } from 'react';
import MapWrapper from './mapWrapper';
import { graphql, useStaticQuery } from 'gatsby';

const extractUrl = ({ allFiles, children }) => {
  const replaceFn = (base) => {
    if (base.includes('_bike')) {
      return 'bike';
    } else if (base.includes('_dedo')) {
      return 'dedo';
    } else {
      return 'plane';
    }
  };
  const splitted = children.replace(/\s+/g, '').split(';');
  const test = splitted.reduce((prev, item) => {
    const type = replaceFn(item);
    const base = item.replace(`_${type}`, '');
    prev[base] = {
      base,
      type,
    };
    return prev;
  }, {});
  return allFiles.reduce((prev, item) => {
    if (test[item.node.base]) {
      prev.push({
        url: item.node.publicURL,
        type: test[item.node.base].type,
      });
    }
    return prev;
  }, []);
};

const MdxMap = (props) => {
  const data = useStaticQuery(graphql`
    {
      geojsons: allFile(filter: { extension: { eq: "geojson" } }) {
        edges {
          node {
            publicURL
            base
          }
        }
      }
    }
  `);
  const urls = useMemo(
    () =>
      extractUrl({
        allFiles: data.geojsons.edges,
        children: props.children,
      }),
    []
  );
  return (
    <div style={{ width: '100%', height: '480px' }}>
      <MapWrapper urls={urls} {...props} />
    </div>
  );
};

export default MdxMap;
