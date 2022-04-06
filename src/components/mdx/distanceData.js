import React from 'react';
import { IoMdTrendingUp, IoMdTrendingDown, IoIosTimer } from 'react-icons/io';
import useTranslations from '../useTranslations';
import { FaRuler } from 'react-icons/fa';
import { Center, Grid, GridItem, Icon } from '@chakra-ui/react';

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
      <>
        <Grid
          templateAreas={`"d1 time1 avg1 ele1 eld1" "d2 time2 avg2 ele2 eld2" "d3 time2 avg3 ele3 eld3"`}
          columns={5}
          fontSize="xl"
          lineHeight="shorter"
          textAlign="center"
        >
          <GridItem area="d1" borderWidth="1px">
            {Math.round(distanceData.distance * 100) / 100} km
          </GridItem>
          <GridItem area="d2" borderWidth="1px" backgroundColor="gray.100">
            {trs.distance} <Icon as={FaRuler} />
          </GridItem>
          <GridItem area="d3" borderWidth="1px">
            {Math.round(distanceData.distance * 0.6)} mi
          </GridItem>
          <GridItem area="time1" borderWidth="1px">
            {timespan}
          </GridItem>
          <GridItem area="time2" borderWidth="1px" backgroundColor="gray.100">
            <Center height="100%">
              {trs.saddletime} <Icon as={IoIosTimer} />
            </Center>
          </GridItem>
          <GridItem area="avg1" borderWidth="1px">
            {distanceData.avgspeed} {trs.kmh}
          </GridItem>
          <GridItem area="avg2" borderWidth="1px" backgroundColor="gray.100">
            {trs.avgspeed}
          </GridItem>
          <GridItem area="avg3" borderWidth="1px">
            {Math.round(distanceData.avgspeed * 0.6)} {trs.mph}
          </GridItem>
          <GridItem area="ele1" borderWidth="1px">
            {distanceData.elevation_up} km
          </GridItem>
          <GridItem area="ele2" borderWidth="1px" backgroundColor="gray.100">
            {trs.elevation_up} <Icon as={IoMdTrendingUp} />
          </GridItem>
          <GridItem area="ele3" borderWidth="1px">
            {Math.round(distanceData.elevation_up * 0.6)} mi
          </GridItem>
          <GridItem area="eld1" borderWidth="1px">
            {distanceData.elevation_down} <span>km</span>
          </GridItem>
          <GridItem area="eld2" borderWidth="1px" backgroundColor="gray.100">
            {trs.elevation_down} <Icon as={IoMdTrendingDown} />
          </GridItem>
          <GridItem area="eld3" borderWidth="1px">
            {Math.round(distanceData.elevation_down * 0.6)} mi
          </GridItem>
        </Grid>
      </>
    );
  }
  return <></>;
};
