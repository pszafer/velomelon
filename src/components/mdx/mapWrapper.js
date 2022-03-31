// react
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
// openlayers
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { GeoJSON } from 'ol/format';
import { defaults as defaultsControl, FullScreen, Control } from 'ol/control';
import { Style, Stroke } from 'ol/style';
import { getDistance } from 'ol/sphere';
import { DistanceData } from './distanceData';
import { IoIosBicycle, IoIosAirplane, IoMdBus } from 'react-icons/io';
// import { toStringXY } from 'ol/coordinate';
import 'ol/ol.css';

const toFeatures = (geojsons) =>
  geojsons.reduce(
    (out, response) => {
      out[response.type].push(
        ...response.geojson.features.filter(
          (x) => x.geometry && x.geometry.type === 'LineString'
        )
      );
      return out;
    },
    { bike: [], dedo: [], plane: [] }
  );

const Legend = () => (
  <div className="legend ol-unselectable ol-control">
    <div className="legend-item bicycle">
      <IoIosBicycle />
    </div>
    <div className="legend-item plane">
      <IoIosAirplane />
    </div>
    <div className="legend-item dedo">
      <IoMdBus />
    </div>
  </div>
);

const MapWrapper = (props) => {
  // set intial state
  const { urls = [] } = props;
  const [map, setMap] = useState();
  const [geojsons, setGeoJson] = useState([]);
  const [distanceData, setdistanceData] = useState(false);

  const lineStyles = useMemo(
    () => ({
      dedo: {
        LineString: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 1,
          }),
        }),
      },
      bike: {
        LineString: new Style({
          stroke: new Stroke({
            color: 'red',
            width: 2,
          }),
        }),
      },
      plane: {
        LineString: new Style({
          stroke: new Stroke({
            color: 'yellow',
            width: 0.5,
          }),
        }),
      },
    }),
    []
  );

  // pull refs
  const mapElement = useRef();
  const legendContainer = useRef();

  // create state ref that can be accessed in OpenLayers onclick callback function
  //  https://stackoverflow.com/a/60643670
  const mapRef = useRef();
  mapRef.current = map;
  //   const legendContainer = document.createElement('div');

  const countdiistance = (geojson) => {
    let distance, fulldistance, timeBetween, elevation_up, elevation_down;
    distance = 0;
    fulldistance = 0;
    timeBetween = 0;
    elevation_up = 0;
    elevation_down = 0;
    var avg_speed = [];
    for (let key in geojson) {
      let coordinates = geojson[key].getGeometry().getCoordinates();
      let coordTimes = geojson[key].get('coordTimes');
      for (let i = 0; i < coordinates.length; ++i) {
        if (i > 0) {
          var current_distance = getDistance(
            coordinates[i - 1],
            coordinates[i]
          );
          fulldistance += current_distance;
          if (coordTimes) {
            distance += current_distance;
            let current_time = Math.floor(
              Date.parse(coordTimes[i]) - Date.parse(coordTimes[i - 1])
            );
            let curr_speed = (current_distance / (current_time / 1000)) * 3.6;
            if (curr_speed > 3) {
              var elevation_change = coordinates[i][2] - coordinates[i - 1][2];
              timeBetween += current_time;
              if (elevation_change > 0) {
                elevation_up += elevation_change;
              } else if (elevation_change < 0 && elevation_change > -50) {
                elevation_down += elevation_change * -1;
              }
              avg_speed.push((distance / (timeBetween / 1000)) * 3.6);
            }
          }
        }
      }
    }
    setdistanceData({
      avgspeed:
        Math.round(
          (avg_speed.reduce((a, b) => a + b, 0) / avg_speed.length) * 100
        ) / 100,
      distance: Math.round(fulldistance / 1000),
      elevation_up: Math.round((elevation_up / 1000) * 100) / 100,
      elevation_down: Math.round((elevation_down / 1000) * 100) / 100,
      fulltime: timeBetween,
    });
  };

  useEffect(() => {
    const fetchAll = () => {
      urls.map((item) =>
        fetch(item.url).then((res) =>
          res.json().then((res2) => {
            setGeoJson((old) => [...old, { type: item.type, geojson: res2 }]);
          })
        )
      );
    };
    fetchAll();
  }, []);

  useEffect(() => {
    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
    });

    // create map
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        // USGS Topo
        new TileLayer({
          source: new XYZ({
            url: '//{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
          }),
        }),

        initalFeaturesLayer,
      ],
      view: new View({
        projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 2,
      }),
      controls: defaultsControl().extend([
        new FullScreen(),
        new Control({
          element: legendContainer.current,
        }),
      ]),
    });

    // set map onclick handler

    // save map and vector layer references to state
    setMap(initialMap);
    ReactDOM.render(React.createElement(Legend), legendContainer.current);
  }, []);

  //   update map if features prop changes - logic formerly put into componentDidUpdate
  useEffect(() => {
    const createVectorLayer = (urls, type) => {
      const vector = new VectorSource();
      urls.forEach((item) => {
        vector.addFeatures(
          new GeoJSON().readFeatures(item, {
            featureProjection: 'EPSG:4326',
          })
        );
      });
      return new VectorLayer({
        source: vector,
        style: lineStyles[type]['LineString'],
      });
    };
    if (geojsons.length === urls.length) {
      const data = toFeatures(geojsons);
      // may be null on first render

      // set features to map
      const layer1 = createVectorLayer(data['bike'], 'bike');
      const layer2 = createVectorLayer(data['dedo'], 'dedo');
      const layer3 = createVectorLayer(data['plane'], 'plane');
      map.addLayer(layer1);
      map.addLayer(layer2);
      map.addLayer(layer3);
      //   const layers = [('bike', 'dedo', 'plane')].map((x) => {
      //     map.addLayer(layer);
      //     return layer;
      //   });
      map.getView().fit(layer1.getSource().getExtent(), map.getSize());
      map.getView().setZoom(2.5);
      countdiistance(layer1.getSource().getFeatures());
      //   featuresLayer.setSource(bikeLayer);

      //   // fit map to feature extent (with 100px of padding)
      //   //   map.getView().fit(featuresLayer.getSource().getExtent(), {
      //   //     padding: [100, 100, 100, 100],
      //   //   });
      //   map.getView().fit(bikeLayer.getSource().getExtent(), map.getSize());
      //   map.getView().setZoom(2.5);
    }
  }, [geojsons, urls, map, lineStyles]);

  // map click handler

  // render component
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        ref={mapElement}
        className="map-container"
        style={{ width: '100%', height: '80%' }}
      >
        <div ref={legendContainer} />
      </div>
      <DistanceData distanceData={distanceData} />
    </div>
  );
};

export default MapWrapper;
