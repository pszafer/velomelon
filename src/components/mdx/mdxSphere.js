import React, { Component } from 'react'
import * as Sphere from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.min.css"


export default class MdxSphere extends Component {
    constructor(props) {
        super(props)
        this.sphereDiv = element => {
            this.photoSphereViewer = element;
        };
        this.sphereDiv.appendChild = (elem) => {
            this.subDiv.appendChild(elem)
        }
    }

    componentDidMount() {
        const PVS = Sphere({
            parent: this,
            container: this.sphereDiv,
            panorama: this.props.children,
            navbar: [
                'autorotate',
                'zoom',
                'fullscreen'
            ]
        })
    }

    render() {
        return <div ref={this.sphereDiv} id="viewer"><div ref={node => this.subDiv = node}></div></div>
    }
}