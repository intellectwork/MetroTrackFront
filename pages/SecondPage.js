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
  const [activeLoad, setActiveLoad] = useState(" ");

  
  const { paramKey } = route.params;
  const { paramTime } = route.params;

  let tracks = [];

  useEffect(() => {
    getLocationAsync();
    hasActiveLoad();
  }, []);

  const postVechileLocation = async () => {

    try {
      await axios.get('https://nodejsclusters-57784-0.cloudclusters.net/api/tracker',{ params: { vechileId: route.params.paramKey } }).then(response => 
       {
        
         if (response.data.length>0)
          {   
           let vechilLoc = { vechileId: route.params.paramKey, latitude: latitude, longitude: longitude, published: "true" };
           axios.put('https://nodejsclusters-57784-0.cloudclusters.net/api/tracker/'+route.params.paramKey, vechilLoc);
          }
          
          else

          {
            let vechilLoc = { vechileId: route.params.paramKey, latitude: latitude, longitude: longitude, published: "true" };
            axios.post('https://nodejsclusters-57784-0.cloudclusters.net/api/tracker', vechilLoc);
          }
       });  
     
    }
    catch (e) {
      console.error('Failure!');
      console.error(e.response.status);
      throw new Error(e);
    }


  }

  const hasActiveLoad = async () => {

    try {
      axios.get('https://nodejsclusters-57784-0.cloudclusters.net/api/trip',{ params: { vechileId: route.params.paramKey } }).then(response => 
       {
         //console.log("Response data is--- " + response.data);
         setActiveLoad(response.data);
       });  

     
     
    }
    catch (e) {
      console.error('Failure!');
      console.error(e.response.status);
      throw new Error(e);
    }
  };




  const getLocationAsync = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') { setErrorMessage('Permission to access location was denied') };

    let loc = await Location.getLastKnownPositionAsync({ accuracy: 6, });

    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);

    let geocode = await Location.reverseGeocodeAsync(loc.coords);

    setGeocode(geocode);

    postVechileLocation();

    hasActiveLoad();
    
    this.forceUpdate();

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
     {
       activeLoad==="Loaded" &&
      <View style={styles.container}>
        <Text style={styles.heading}>
          {geocode[0].country} {"\n"}
          {geocode[0].region} {"\n"}
          {geocode[0].subregion}  {"\n"}
          {geocode[0].city} {"\n"}
          {geocode[0].district}  {"\n"}
          {geocode[0].street} {"\n"}
          {geocode[0].postalCode}  {"\n"}
          {geocode[0].timezone} {"\n"} 
          {geocode[0].isoCountryCode} {"\n"}
          {latitude} {"\n"}
          {longitude}
        </Text>
        <Text style={styles.textStyle}>
          This is a location of : { paramKey }  {"\n"}   
          Active load is : { activeLoad } {"\n"}
          Interval is: { route.params.paramTime } {"\n"}
        </Text>
      </View>
     
    }
     
    
      <BackgroundTask interval={route.params.paramTime} function={() => { getLocationAsync() }}></BackgroundTask>
     
      {
       activeLoad!="Loaded" && activeLoad!="Arrived" &&
      <Text style={{ textAlign: 'center', backgroundColor: 'grey', color: 'Red', fontSize:30, paddingTop:90 }}>
        You Have No Active Loads {"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}
      </Text>
      }  


    {
       activeLoad==="Arrived" &&
       <Text style={{ textAlign: 'center', backgroundColor: 'grey', color: 'blue', fontSize:30, paddingTop:90 }}>
       Vechile Delivered !!! Thank You !!! {"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}
       </Text>
     
    }



     
      <Text style={{ textAlign: 'center', backgroundColor: 'grey', color: 'lime' }}>
        MetroTransLogistics
      </Text>
   
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
