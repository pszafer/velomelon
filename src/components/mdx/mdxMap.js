import React, { createRef, Component } from 'react'
import ReactDOM from 'react-dom';

import { StaticQuery, graphql } from "gatsby"
import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ'
import Point from 'ol/geom/Point.js';
import Vector from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { getDistance } from 'ol/sphere'
import { Stroke, Style as olStyle, Icon } from "ol/style";
import { defaults as defaultControls, FullScreen, Control } from 'ol/control';
import { IoIosBicycle, IoIosAirplane, IoMdBus, IoMdTrendingUp, IoMdTrendingDown, IoIosTimer } from 'react-icons/io'
import { FaRuler } from 'react-icons/fa'
import useTranslations from "../useTranslations"

import "ol/ol.css"

var lineStyles = {
    'dedo': {
        'LineString': new olStyle({
            stroke: new Stroke({
                color: 'blue',
                width: 1
            })
        })
    },
    'bike': {
        'LineString': new olStyle({
            stroke: new Stroke({
                color: 'red',
                width: 2
            })
        })
    },
    'plane': {
        'LineString': new olStyle({
            stroke: new Stroke({
                color: 'yellow',
                width: 0.5
            })
        })
    }
};

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
        render={({ geojsons }) => <div style={{ width: "100%"}}><MyMap geojsons={geojsons.edges} {...props} /></div>}
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
            } else if (item.indexOf("_dedo") > -1) {
                type = "dedo";
                base = item.replace("_dedo", "");
            } else if (item.indexOf("_plane") > -1) {
                type = "plane";
                base = item.replace("_plane", "");
            }
            if (base.length > 1){
                geos[base] = {
                    base: base,
                    type: type
                }    
            }
        })
        this.urls = [];
        this.props.geojsons.forEach(item => {
            if (geos[item.node.base]){
                this.urls.push({ url: item.node.publicURL, type: geos[item.node.base].type});
            }
        })
        this.state = { distanceData: false }
        this.map, this.bikeLayer;
        this.setMapRef = element => {
            this.mapRef = element;
        }
        this.legendContainer;
        this.legendRef = createRef();
        this.handleZoom = this.handleZoom.bind(this);
    }

    setLegend() {
        ReactDOM.render(
            React.createElement(Legend),
            this.legendContainer
        );
    }

    create_map(target){
        this.legendContainer = document.createElement('div');
        this.setLegend();
        var map = new Map({
            target: target,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: '//{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: new View({
                center: [0, 0],
                zoom: 2,
                projection: 'EPSG:4326'
            }),
            controls: defaultControls().extend([
                new FullScreen(),
                new Control({
                    element: this.legendContainer
                })
            ])
        });
        return map;
    }

    styleFunction(feature){
        var geometry = feature.getGeometry();
        var styles = [
            lineStyles['bike']['LineString']
        ];
        let coords = geometry.getCoordinates();
        let start = coords[0]
        let end = coords[coords.length - 1]
        let dx = end[0] - start[0];
        let dy = end[1] - start[1];
        styles.push(new olStyle({
            geometry: new Point(end),
            image: new Icon({
                src: '/static/arrow-c6bee897cd0f5c7fa2b5b3e5ff26f3a9.png',
                anchor: [0.75, 0.5],
                rotateWithView: true,
                rotation: -Math.atan2(dy, dx)
            })
        }));

        return styles;
    }

    createVectorLayer(geojson, type) {
        let vector = new Vector()
        geojson.forEach(item => {
            vector.addFeatures((new GeoJSON()).readFeatures(item, { featureProjection: 'EPSG:4326' }));
        })
        return new VectorLayer({
            source: vector,
            style: lineStyles[type]['LineString']
        })
    }


    countdiistance(geojson) {
        let distance, fulldistance, timeBetween, elevation_up, elevation_down;
        distance = fulldistance = timeBetween = elevation_up = elevation_down = 0;
        var avg_speed = [];
        for (let key in geojson) {
            let coordinates = geojson[key].getGeometry().getCoordinates();
            let coordTimes = geojson[key].get("coordTimes");
            for (let i = 0; i < coordinates.length; ++i) {
                if (i > 0) {
                    var current_distance = getDistance(coordinates[i - 1], coordinates[i]);
                    fulldistance += current_distance;
                    if (coordTimes){
                        distance += current_distance;
                        let current_time = Math.floor((Date.parse(coordTimes[i]) - Date.parse(coordTimes[i - 1])));
                        let curr_speed = current_distance / (current_time / 1000) * 3.6;
                        if (curr_speed > 3) {
                            var elevation_change = coordinates[i][2] - coordinates[i - 1][2];
                            timeBetween += current_time;
                            if (elevation_change > 0) {
                                elevation_up += elevation_change;
                            } else if (elevation_change < 0 && elevation_change > -50) {
                                elevation_down += (elevation_change * -1);
                            }
                            avg_speed.push((distance / (timeBetween / 1000)) * 3.6);
                        }
                    }
                }
            }
        }
        this.setState({
            distanceData: {
                avgspeed: Math.round((avg_speed.reduce((a, b) => a + b, 0) / avg_speed.length) * 100) / 100,
                distance: Math.round(fulldistance / 1000),
                elevation_up: Math.round((elevation_up / 1000) * 100) / 100,
                elevation_down: Math.round((elevation_down / 1000) * 100) / 100,
                fulltime: timeBetween
            }
        })

    }


    componentDidMount() {
        const mapDOMNode = ReactDOM.findDOMNode(this.mapRef);
        this.map = this.create_map(mapDOMNode);
        this.map.on('moveend', this.handleZoom);

        const requests = this.urls.map(item => fetch(item.url).then(res => res.json().then(res2 => { return { type: item.type, geojson: res2}})));
        const toFeatures = responses => responses.reduce((out, response) => {
            out[response.type].push(...response.geojson.features.filter(x => x.geometry && x.geometry.type == "LineString"))
            return out;
        }, { 'bike': [], 'dedo': [], 'plane': [] } );
        Promise.all(requests).then(toFeatures).then(res => {
            this.bikeLayer = this.createVectorLayer(res.bike, "bike");
            this.map.addLayer(this.createVectorLayer(res.dedo, "dedo"));
            this.map.addLayer(this.createVectorLayer(res.plane, "plane"));
            this.map.addLayer(this.bikeLayer);
            this.map.getView().fit(this.bikeLayer.getSource().getExtent(), this.map.getSize());
            this.map.getView().setZoom(2.5);
            this.countdiistance(this.bikeLayer.getSource().getFeatures());
        })
        return;
    }

    handleZoom(){
        if (this.bikeLayer) {
            if (this.map.getView().getZoom() < 6) {
                this.bikeLayer.setStyle(lineStyles['bike']['LineString']);
            }
            else {
                this.bikeLayer.setStyle(this.styleFunction);
            }
        }
    }

    render() {
        const styles = { height: '100%', width: '100%' }
        return (
            <>
                <div style={styles} className="ol">
                    <div style={styles} ref={this.setMapRef}></div>
                </div>
                <DistanceData distanceData={this.state.distanceData} />
            </>
        );
    }
}

function DistanceData(props) {
    const distanceData = props.distanceData;
    const trs = useTranslations();
    const time = timeConversion(distanceData.fulltime)
    const timespan = <>{time.data} <span>{trs[time.units]}</span></>;
    if (distanceData) {
        return (<div className="map-stat-grid">
                    <div className="map-grid-element">
                            <div className="map-grid-element-data">{Math.round(distanceData.distance * 100) / 100} <span>km</span></div>
                <div className="map-grid-element-data map-grid-element-info">{trs.distance} <FaRuler /></div>
                <div className="map-grid-element-data">{Math.round(distanceData.distance * 0.6)} <span>mi</span></div>
                    </div>
                    <div className="map-grid-element">
                <div className="map-grid-element-data">{timespan}</div>
                <div className="map-grid-element-data map-grid-element-info">{trs.saddletime} <IoIosTimer /></div>
                <div className="map-grid-element-data"></div>
                    </div>
                    <div className="map-grid-element">
                <div className="map-grid-element-data">{distanceData.avgspeed} <span>{trs.kmh}</span></div>
                <div className="map-grid-element-data map-grid-element-info">{trs.avgspeed}</div>
                <div className="map-grid-element-data">{Math.round(distanceData.avgspeed * 0.6)} <span>{trs.mph}</span></div>    
                    </div>
                    <div className="map-grid-element">
                            <div className="map-grid-element-data">{distanceData.elevation_up} <span>km</span></div>
                <div className="map-grid-element-data map-grid-element-info">{trs.elevation_up} <IoMdTrendingUp/></div>
                            <div className="map-grid-element-data">{Math.round(distanceData.elevation_up * 0.6)} <span>mi</span></div>
                    </div>
            <div className="map-grid-element">
                <div className="map-grid-element-data">{distanceData.elevation_down} <span>km</span></div>
                <div className="map-grid-element-data map-grid-element-info">{trs.elevation_down} <IoMdTrendingDown /></div>
                <div className="map-grid-element-data">{Math.round(distanceData.elevation_down * 0.6)} <span>mi</span></div>
            </div>
                </div>)
    }
    return <></>;
}

class Legend extends Component {
    render() {
        return (<div className="legend ol-unselectable ol-control">
            <div className="legend-item bicycle"><IoIosBicycle /></div>
            <div className="legend-item plane"><IoIosAirplane /></div>
            <div className="legend-item dedo"><IoMdBus /></div>
        </div>)
    }
}

function timeConversion(millisec) {
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = (millisec / (1000 * 60)).toFixed(0);
    var hours = (millisec / (1000 * 60 * 60)).toFixed(0);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0);
    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return hours + " Hrs";
    } else {
        return {
            data: days,
            units: 'days'
        }
    }
}