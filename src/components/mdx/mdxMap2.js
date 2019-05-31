import React, { createRef } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";

export default class MyMap extends React.Component {
    constructor() {
        super();
        this.state = {
            lat: 51.9377277,
            lng: 15.4417371,
            zoom: 9
        };
        this.url =
            "https://gist.githubusercontent.com/pszafer/d15c0294b1a9f6a4869daefe7e1c9f17/raw/104ee0ce5a67036911c483fd8f2a4f287f85c329/geojsonData.geojson";
        this.mapLayer = createRef();
        this.geoJsonLayer = createRef();
    }

    componentDidMount() {
        fetch(this.url)
            .then(res => res.json())
            .then(res => {
                this.geoJsonLayer.current.leafletElement.addData(res);
                this.mapLayer.current.leafletElement.fitBounds(
                    this.geoJsonLayer.current.leafletElement.getBounds()
                );
                this.mapLayer.current.leafletElement.invalidateSize();
            });
    }

    render() {
        const position = [this.state.lat, this.state.lng];
        return (
            <Map
                length={4}
                zoom={15}
                style={{ height: "560px" }}
                ref={this.mapLayer}
                center={position}
                className="mapDiv"
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON ref={this.geoJsonLayer} />
            </Map>
        );
    }
}
