import React from "react"
import posed from 'react-pose';
import Img from 'gatsby-image'

const Frame = posed.div({
    init: {
        applyAtEnd: { display: 'none' },
        opacity: 0,
        // "z-index": -1
    },
    zoom: {
        applyAtStart: { display: 'block' },
        opacity: 1,
        // "z-index": 351
    }
});

const transition = {
    duration: 400,
    ease: [0.08, 0.69, 0.2, 0.99]
};

const Image = posed.span({
    init: {
        position: 'static',
        width: 'auto',
        height: 'auto',
        transition,
        flip: true,
        cursor: "zoom-in"
        // "z-index": -1
    },
    zoom: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transition,
        flip: true,
        cursor: 'zoom-out',
        display: 'block',
        // maxWidth: '100%',
        // margin: 'auto'
        // "z-index": 352
    }
});

class MdxImg extends React.Component {
    state = { isZoomed: false };

    zoomIn() {
        // document.getElementById("floating-header").classList.remove("floating-active");
        window.addEventListener('scroll', this.zoomOut);
        this.setState({ isZoomed: true });

    }

    zoomOut = () => {
        // document.getElementById("floating-header").classList.add("floating-active");
        window.removeEventListener('scroll', this.zoomOut);
        this.setState({ isZoomed: false });

    };

    toggleZoom = () => (this.state.isZoomed ? this.zoomOut() : this.zoomIn());

    render() {
        const { isZoomed } = this.state;
        // const { imageWidth, imageHeight, ...props } = this.props;
        const pose = isZoomed ? 'zoom' : 'init';
        // console.log(this.props.children)
        // const picture = this.props.children.props.children[3];
        return (
            <a
                // style={{ width: "100%" }}
                onClick={this.toggleZoom}
            >
                <Frame pose={pose} className="frame" />
                {/* <Image pose={pose} {...props} /> */}
                <Image pose={pose}>{this.props.children}</Image>

            </a>
        );
    }
}

export default MdxImg;
