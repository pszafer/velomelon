import React from 'react';
import { IoMdTrendingUp, IoMdTrendingDown, IoIosTimer } from 'react-icons/io';
import useTranslations from '../useTranslations';
import { FaRuler } from 'react-icons/fa';

const timeConversion = (millisec) => {
  var seconds = (millisec / 1000).toFixed(0);
  var minutes = (millisec / (1000 * 60)).toFixed(0);
  var hours = (millisec / (1000 * 60 * 60)).toFixed(0);
  var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0);
  if (seconds < 60) {
    return seconds + ' Sec';
  } else if (minutes < 60) {
    return minutes + ' Min';
  } else if (hours < 24) {
    return {
      data: hours,
      units: 'hours',
    };
  } else {
    return {
      data: days,
      units: 'days',
    };
  }
};

export const DistanceData = ({ distanceData }) => {
  const trs = useTranslations();
  const time = timeConversion(distanceData.fulltime);
  const timespan = (
    <>
      {time.data} <span>{trs[time.units]}</span>
    </>
  );
  if (distanceData) {
    return (
      <div className="map-stat-grid">
        <div className="map-grid-element">
          <div className="map-grid-element-data">
            {Math.round(distanceData.distance * 100) / 100} <span>km</span>
          </div>
          <div className="map-grid-element-data map-grid-element-info">
            {trs.distance} <FaRuler />
          </div>
          <div className="map-grid-element-data">
            {Math.round(distanceData.distance * 0.6)} <span>mi</span>
          </div>
        </div>
        <div className="map-grid-element">
          <div className="map-grid-element-data">{timespan}</div>
          <div className="map-grid-element-data map-grid-element-info">
            {trs.saddletime} <IoIosTimer />
          </div>
          <div className="map-grid-element-data"></div>
        </div>
        <div className="map-grid-element">
          <div className="map-grid-element-data">
            {distanceData.avgspeed} <span>{trs.kmh}</span>
          </div>
          <div className="map-grid-element-data map-grid-element-info">
            {trs.avgspeed}
          </div>
          <div className="map-grid-element-data">
            {Math.round(distanceData.avgspeed * 0.6)} <span>{trs.mph}</span>
          </div>
        </div>
        <div className="map-grid-element">
          <div className="map-grid-element-data">
            {distanceData.elevation_up} <span>km</span>
          </div>
          <div className="map-grid-element-data map-grid-element-info">
            {trs.elevation_up} <IoMdTrendingUp />
          </div>
          <div className="map-grid-element-data">
            {Math.round(distanceData.elevation_up * 0.6)} <span>mi</span>
          </div>
        </div>
        <div className="map-grid-element">
          <div className="map-grid-element-data">
            {distanceData.elevation_down} <span>km</span>
          </div>
          <div className="map-grid-element-data map-grid-element-info">
            {trs.elevation_down} <IoMdTrendingDown />
          </div>
          <div className="map-grid-element-data">
            {Math.round(distanceData.elevation_down * 0.6)} <span>mi</span>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
};
