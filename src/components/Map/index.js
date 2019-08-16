import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Image, StatusBar } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import getPixelSize from '../../utils';

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';

import {
  Back,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall
} from './styles';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

Geocoder.init('API_KEY');

export default function Maps() {
  const [region, setRegion] = useState();
  const [destination, setDestination] = useState();
  const [duration, setDuration] = useState();
  const [location, setLocation] = useState();

  const mapView = useRef();

  useEffect(() => {
    async function getLocation() {
      await Geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          getAddress(latitude, longitude);
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134
          });
        },
        () => {},
        {
          timeout: 2000,
          enableHighAccuracy: true,
          maximumAge: 1000
        }
      );
    }
    getLocation();
  }, []);

  async function getAddress(latitude, longitude) {
    const response = await Geocoder.from({ latitude, longitude });
    const address = response.results[0].formatted_address;
    const getlocation = address.substring(0, address.indexOf(','));
    setLocation(getlocation);
  }

  function handleLocationSelected(data, { geometry }) {
    const { location: { lat: latitude, lng: longitude } } = geometry;
    setDestination({
      latitude,
      longitude,
      title: data.structured_formatting.main_text
    });
  }

  function handleBack() {
    setDestination(null);
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" barStyle="dark-content"/>
      <MapView
        style={{ flex: 1 }}
        region={region}
        showsUserLocation
        loadingEnabled
        ref={mapView}
      >
        { destination && (
          <>
            <Directions
              origin={region}
              destination={destination}
              onReady={(result) => {
                setDuration(Math.floor(result.duration));
                mapView.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(350)
                  }
                });
              }}
            />
            <Marker
              coordinate={destination}
              anchor={{ x: 0, y: 0 }}
              image={markerImage}
            >
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>

            <Marker
              coordinate={region}
              anchor={{ x: 0, y: 0 }}
            >
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </>
        )}
      </MapView>
      { destination
        ? (
          <>
            <Back onPress={handleBack}>
              <Image source={backImage} />
            </Back>
            <Details duration={duration} />
          </>
        )
        : <Search onLocationSelected={handleLocationSelected} /> }
    </View>
  );
}
