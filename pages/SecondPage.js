// React Native Pass Value From One Screen to Another Using React Navigation
// https://aboutreact.com/react-native-pass-value-from-one-screen-to-another-using-react-navigation/


import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { WebView } from "react-native-webview";
import { SafeAreaView, StyleSheet, Text, View, ImageBackground, Image, Button, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { render } from 'react-dom';
import axios from 'axios';


const SecondPage = ({ route }) => {

  const [location, setLocation] = React.useState(null);
  const [geocode, setGeocode] = React.useState(" ");
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState(" ");
  const [trackconf, setTrackconf] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [isLoading, setLoading] = useState(true);
  
  const { paramKey } = route.params;
  const { paramTime } = route.params;

  let tracks = [];

  useEffect(() => {
    getLocationAsync()
  }, []);

  const postVechileLocation = async () => {

    try {
      let vechilLoc = { vechileId: route.params.paramKey, latitude: latitude, longitude: longitude, published: "true" };
      let res = await axios.post('https://metro-track-api-pr5xt.ondigitalocean.app/api/tracker', vechilLoc);
      let data = res.data;
    }
    catch (e) {
      console.error('Failure!');
      console.error(e.response.status);
      throw new Error(e);
    }


  }


  const getLocationAsync = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') { setErrorMessage('Permission to access location was denied') };

    let loc = await Location.getLastKnownPositionAsync({ accuracy: 6, });

    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);


    let geocode = await Location.reverseGeocodeAsync(loc.coords);

    setGeocode(geocode);


    postVechileLocation();

  };


  function BackgroundTask(props) {
    return (
      <View style={{ height: 10 }}>
        <WebView
          style={{ backgroundColor: 'gray' }}
          onMessage={props.function}
          source={{
            html: `<script>
                setInterval(()=>{window.ReactNativeWebView.postMessage("");}, ${props.interval})
                </script>`,
          }}
        />
      </View>
    )
  };




  return (

    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>
          {geocode[0].city} {geocode[0].isoCountryCode} {geocode[0].street} {latitude} {longitude}
        </Text>
        <Text style={styles.textStyle}>
          This is a location of : { paramKey }
        </Text>
      </View>
      <Text style={{ textAlign: 'center', backgroundColor: 'grey', color: 'lime' }}>
        MetroTransLogistics
      </Text>

      <BackgroundTask interval={route.params.paramTime} function={() => { getLocationAsync() }}></BackgroundTask>
    </SafeAreaView>

  );
};

export default SecondPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 10,
    color: 'lime'
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
    color: 'purple'
  },
  taskStyle: {
    height: 10
  },
  mapStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
