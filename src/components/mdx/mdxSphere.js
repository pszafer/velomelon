import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Viewer } from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';

const MdxSphere = (props) => {
  var url;
  const data = useStaticQuery(graphql`
    {
      jpg: allFile(filter: { extension: { eq: "jpg" } }) {
        edges {
          node {
            publicURL
            base
          }
        }
      }
    }
  `);
  if (props.children.indexOf('http') === -1) {
    url = data.jpg.edges.find((x) => x.node.base === props.children).node
      .publicURL;
  } else {
    url = props.children;
  }
  const file = url;
  return <MySphere>{file}</MySphere>;
};

const MySphere = ({ children }) => {
  const sphereDiv = useRef();

  useEffect(() => {
    new Viewer({
      container: sphereDiv.current,
      panorama: children,
    });
  });
  return <div ref={sphereDiv} id="viewer" />;
};

export default MdxSphere;
