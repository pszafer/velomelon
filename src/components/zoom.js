import React from "react"

export default class Zoom extends React.Component {
    zoom = null

    componentDidMount() {
        import('medium-zoom').then(mediumZoom => {
            this.zoom = mediumZoom.default('.post-content .gatsby-resp-image-wrapper')
            console.log(this.zoom)
            console.log("zoom?")
        })
    }

    componentWillUnmount() {
        if (this.zoom) {
            this.zoom.detach()
        }
    }

    render() {
        return (
        <>
        </>
        );
  }
}