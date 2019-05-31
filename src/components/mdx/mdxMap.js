import React, { createRef, Component } from 'react'
import { StaticQuery, graphql } from "gatsby"
import { Map, TileLayer, GeoJSON } from 'react-leaflet'

export default props => (
    <StaticQuery
        query={graphql`
             {
            geojsons: allFile(filter: { extension: { eq: "geojson" } }) {
                edges {
                    node{
                        publicURL
                        base
                    }
                }
            }
            }
        `}
        render={({ geojsons }) => <div className="leaf"><MyMap geojsons={geojsons.edges} {...props} /></div>}
    />
);

class MyMap extends Component {
    constructor(props) {
        super(props)
        var geos = this.props.children.replace(/\s+/g, '').split(',')
        this.urls = [];
        this.props.geojsons.forEach(item => {
            if (geos.indexOf(item.node.base) > -1){
                this.urls.push(item.node.publicURL);
            }
        })
        this.mapLayer = createRef();
        this.geoJsonLayer = createRef();
    }

    componentDidMount() {
        const requests = this.urls.map(url => fetch(url).then(res => res.json()));
        const toFeatures = responses => responses.reduce((out, response) => {
            if (!out) { return response }
            out.features.push(...response.features);
            return out;
        });
        Promise.all(requests).then(toFeatures).then(res => {
            console.log(this.geoJsonLayer.current.leafletElement)
            this.geoJsonLayer.current.leafletElement.addData(res);
            this.mapLayer.current.leafletElement.fitBounds(this.geoJsonLayer.current.leafletElement.getBounds())
            this.mapLayer.current.leafletElement.invalidateSize()
        })
    }

    onEachFeature(feature, layer) {
        console.log("dzialam")
        console.log(feature)
        if (feature.properties && feature.properties.time) {
            layer.bindPopup(feature.properties.time);
        }
    }

    render() {
        if (typeof window !== 'undefined') {
        return (
            <Map ref={this.mapLayer}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                 <GeoJSON ref={this.geoJsonLayer} onEachFeature={this.onEachFeature} />
             </Map>
         );
        }
        return null;
    }
}