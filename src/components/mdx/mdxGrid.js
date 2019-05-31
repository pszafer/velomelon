import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import styled from 'styled-components';
// import { Dialog } from '@reach/dialog';
// import '@reach/dialog/styles.css';
import MdxImg from "./mdxImg";

// import visit from "unist-util-visit-parents"

// const class = str =>  { "grid" }
// Only use <LocalizedLink /> for internal links
const MdxGrid = ({ className, children }) => {
    return <div className="grid" style={{ width: "100%" }}>{children}</div>;
}

export default MdxGrid;

function exportSpan(children){
    let out = []
    React.Children.map(children, (child, i) => {
        if (child.props && child.props.originalType == "p") {
            React.Children.map(child.props.children, (secChild, j) => {
                if (secChild.props && secChild.props.originalType == "span"){
                    out.push(<MdxImg key={`zoomimg+` + i + j}>{secChild}</MdxImg>)
                }
            })
        }
    })
    return out
}

const LightboxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
`;

const PreviewButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
`;

class Lightbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLightbox: false,
            selectedImage: null,
        };
    }

    render() {
        const { selectedImage, showLightbox } = this.state;
        let images = [];
        React.Children.map(this.props.children, (child, i) => {
            if (child.props && child.props.originalType == "p") {
                React.Children.map(child.props.children, (image, j) => {
                    if (image.props && image.props.originalType == "span") {
                        images.push(image)
                    }
                })
            }
        })
        console.log("wieksza dupa")
        images.map(image => (console.log(image)))
        return (
            <Fragment>
                <LightboxContainer>
                    {images.map(image => (
                        <PreviewButton
                            // key={image.node.childImageSharp.fluid.src}
                            type="button"
                            onClick={() => this.setState({ showLightbox: true, selectedImage: image })}
                        >
                            {image}
                        </PreviewButton>
                    ))}
                </LightboxContainer>
                {showLightbox && (
                    <Dialog>
                        <Img fluid={selectedImage.node.childImageSharp.fluid} />
                        <button type="button" onClick={() => this.setState({ showLightbox: false })}>
                            Close
          </button>
                    </Dialog>
                )}
            </Fragment>
        );
    }
}