import React, { Component } from 'react'
import { useStaticQuery, graphql } from "gatsby"
import * as Sphere from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.min.css"


export default props => {
    var url;
    if (props.children.indexOf('http') == -1){
        const data = useStaticQuery(graphql`
                {
                jpg: allFile(filter: { extension: { eq: "jpg" } }) {
                    edges {
                        node{
                            publicURL
                            base
                        }
                    }
                }
                }
            `)
        url = data.jpg.edges.find(x => x.node.base === props.children).node.publicURL;
    }
    else {
        url = props.children;
    }
    const file = url;
    return (<MySphere>{file}</MySphere>)
}

class MySphere extends Component {
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