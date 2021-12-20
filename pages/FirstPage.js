// React Native Pass Value From One Screen to Another Using React Navigation
// https://aboutreact.com/react-native-pass-value-from-one-screen-to-another-using-react-navigation/


import React, { useState, useEffect } from 'react';
import {  SafeAreaView,  StyleSheet,  View,  Text,  TextInput,  Button } from 'react-native';
import axios from 'axios';

  const FirstPage = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [tracktime, setTracktime] = React.useState(null);
  const trackerConfApiUrl = "https://nodejsclusters-57784-0.cloudclusters.net/api/trackerconf";
  

  useEffect(() => {

    try {
      axios.get(trackerConfApiUrl).then(function (response) { setTracktime(response.data[0].tracktime)})
    }
    catch (e) {
      console.error('Failure!');
      console.error(e.response.status);
      throw new Error(e);
    }
  }, []);


  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.heading}>
          This application tracks your route for better delivery
        </Text>
        <Text style={styles.textStyle}>
          Please insert code which was provided by MetroTransLogistics
        </Text>
        {/*Input to get the value from the user*/}
        <TextInput
          value={userName}
          onChangeText={(username) => setUserName(username)}
          placeholder={'Enter Code'}
          style={styles.inputStyle}
        />
        {/* On click of the button we will send the data as a Json
          From here to the Second Screen using navigation */}
        <Button
          title="Go Next"
          //Button Title
          onPress={() =>
            navigation.navigate('SecondPage', {
              paramKey: userName,
              paramTime: tracktime,
            })
          }
        />
      </View>
      <Text style={{textAlign: 'center', color: 'grey'}}>
        www.intellectwork.com
      </Text>
    </SafeAreaView>
  );
};

export default FirstPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 10,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  inputStyle: {
    width: '80%',
    height: 44,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#DBDBD6',
  },
});
