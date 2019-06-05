import React, { createRef, Component } from 'react'
import { StaticQuery, graphql } from "gatsby"
import { LeafletPolyline } from "react-leaflet-polyline"
// import { DistanceMarkers } from "react-leaflet-distance-marker"
import * as L from 'leaflet';
// import L from 'leaflet'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
// import { getDistance, isGeoJSON, toArray } from 'geojson-tools'
// import "https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"

// exports.onRenderBody = function (_ref, options) {
//     var setHeadComponents = _ref.setHeadComponents;
//     if (options.linkStyles === false) return false;
//     var link = React.createElement('link', {
//         key: 'leaflet',
//         rel: 'stylesheet',
//         href: 'https://unpkg.com/leaflet@1.5.1/dist/leaflet.css',
//         integrity: 'sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==',
//         crossOrigin: ''
//     });
//     setHeadComponents([link]);
// };


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
        var geos = {}
        this.props.children.replace(/\s+/g, '').split(';').forEach(item => {
            let type = "bike"
            let base = item;
            if (item.indexOf("_bike") > -1){
                base = item.replace("_bike", "");
            } else if (item.indexOf("_car") > -1) {
                type = "car";
                base = item.replace("_car", "");
            } else if (item.indexOf("_plane") > -1) {
                type = "plane";
                base = item.replace("_plane", "");
            }
            geos[base] = {
                base: base,
                type: type
            }
        })
        this.urls = [];
        this.props.geojsons.forEach(item => {
            if (geos[item.node.base]){
                this.urls.push(item.node.publicURL);
            }
        })
        this.mapLayer = createRef();
        this.geoJsonLayer = createRef();
        this.distancemarkers = createRef();
    }

    dist3d(a, b) { //return in meters
        return Math.sqrt(Math.pow(this.dist2d(L.latLng(a[1], a[0]), L.latLng(b[1], b[0])), 2) + Math.pow(Math.abs(b[2] - a[2]) || 0, 2));
    }

    dist2d(a, b) {
        const R = 6371e3;
        let dLat = this._deg2rad(b.lat - a.lat);
        let dLon = this._deg2rad(b.lng - a.lng);
        let r = Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
            Math.cos(this._deg2rad(a.lat)) *
            Math.cos(this._deg2rad(b.lat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        return R * (2 * Math.atan2(Math.sqrt(r), Math.sqrt(1 - r)));
    }
    _deg2rad(deg) {
        return deg * Math.PI / 180;
    }

    calculateDistance(coordinates){
        var distance = 0;
        for (let i=1; i<coordinates.length; ++i){
            distance += this.dist3d(coordinates[i-1], coordinates[i])
        }
        return distance;
    }


    componentDidMount() {
        const requests = this.urls.map(url => fetch(url).then(res => res.json()));
        const toFeatures = responses => responses.reduce((out, response) => {
            if (!out) { return response }
            // console.log("licze")
            // console.log(response.features[0].geometry)
            // console.log(isGeoJSON(response, true))
            // console.log(toArray(response.features))
            // out.features[0].geometry.coordinates.push(...response.features[0].geometry.coordinates)
            // response.features[0].geometry.coordinates
            // console.log(getDistance(response.features[0].geometry.getDistance))
            out.features.push(...response.features);
            return out;
        });
        Promise.all(requests).then(toFeatures).then(res => {
            this.geoJsonLayer.current.leafletElement.addData(res);
            this.mapLayer.current.leafletElement.fitBounds(this.geoJsonLayer.current.leafletElement.getBounds())
            this.mapLayer.current.leafletElement.invalidateSize()
            // console.log(res.features)
            var distance = 0;
            res.features.forEach(item => {
                if (item.properties.coordTimes && item.properties.coordTimes.length == item.geometry.coordinates.length){

                }
                distance += this.calculateDistance(item.geometry.coordinates)
            })
            console.log((distance/1000))
            L.polylineDecorator(this.geoJsonLayer.current.leafletElement.getLayers().filter((e, i) => i % 2 === 0), {
                patterns: [
                    { offset: '60%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 11, polygon: false, pathOptions: { color: 'orange', stroke: true } }) }
                    // { offset: 0, repeat: 250, symbol: L.Symbol.arrowHead({ pixelSize: 10, pathOptions: { fillOpacity: 1, color: 'red',weight: 0 } }) }
                ]
            }).addTo(this.mapLayer.current.leafletElement);
        })
    }

    onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.time) {
            layer.bindPopup(feature.properties.time);
        }
        // console.log("shit")
        // console.log(this.leaflet.map)
        // const polyline = L.polyline([52.4063367, 16.8344105,], { color: 'yellow' }).addTo(this.leaflet.map);
        // this.distancemarkers.addDistanceMarkers()
        // L.polylineDecorator(layer, {
        //     patterns: [
                // {
                //     offset: 0 + '%',
                //     repeat: 0,
                //     symbol: L.Symbol.marker({
                //         rotate: true,
                //         markerOptions: {
                //             icon: L.icon({
                //                 iconUrl: 'https://raw.githubusercontent.com/bbecquet/Leaflet.PolylineDecorator/master/example/icon_plane.png',
                //                 iconAnchor: [16, 16]
                //             })
                //         },
                //         pathOptions: { stroke: true }
                //     })
                // }
        //         { offset: 25, repeat: 30, symbol: Leaflet.symbol.arrowHead({ pixelSize: 15, pathOptions: { fillOpacity: 1, weight: 0 } }) }
        //     ]
        // }).addTo(this.mapLayer);
    }

    render() {
        if (typeof window !== 'undefined') {
            const showDistanceMarkers = true
            const positions = [[0,0]]
            const trackColor = 'red'
            const distanceMarkers = {
                showAll: 13,
                offset: 1000, // 1000 for kilometers, 1609.344 for miles
                cssClass: showDistanceMarkers === true
                    ? 'dist-marker'
                    : 'dist-marker-hidden',
                iconSize: [24, 24]
            }
            return (
                <Map ref={this.mapLayer}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <GeoJSON ref={this.geoJsonLayer} onEachFeature={this.onEachFeature} />
                    {/* <LeafletPolyline color={'red'}
                        positions={[[45.9205, 0.4394], [45.9205, 0.9228], [45.9205, 2.5488], [45.9205, 3.3837]]} /> */}
                    {/* <DistanceMarkers ref={this.distancemarkers} /> */}

                </Map>
            );
        }
        return null;
    }
}