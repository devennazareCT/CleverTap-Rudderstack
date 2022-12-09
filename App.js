

import React, { Component } from 'react';
import { NativeModules, Linking } from 'react-native';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  Button,
  StatusBar, FlatList, Image
} from 'react-native';
//Add Below imports for rudderstack
import rudderClient from '@rudderstack/rudder-sdk-react-native';
import clevertap from "@rudderstack/rudder-integration-clevertap-react-native";

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const CleverTap = require('clevertap-react-native');
const CleverTapReact = NativeModules.CleverTapReact;


class App extends React.Component {

 systemtracking=false;
  constructor(props) {
    super(props);
    this.state = {
      banner: [
        { name: "test", url: "https://miro.medium.com/max/2400/1*-E4MADl7p4Wabx0lI4_KnQ.png" }


      ],
      //STEP 1 - Declare empty object for rudderstack config
      config : {}
    };
    console.log('initial props:', props);
    if (props.UIApplicationLaunchOptionsRemoteNotificationKey) {
      Alert.alert(JSON.stringify(props.UIApplicationLaunchOptionsRemoteNotificationKey.aps.alert.title));
    }

  }

  componentDidMount() {
    //CleverTap.registerForPush();
    Linking.addEventListener('url', this._handleOpenUrl);
    CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, (event) => { this._handleCleverTapEvent(CleverTap.CleverTapPushNotificationClicked, event); });
    CleverTap.initializeInbox();
    CleverTap.registerForPush();




    //STEP 2 - fetch clevertap id and passed into the   rudderClient.putAnonymousId(res) function
    CleverTap.getCleverTapID((err, res) => {
      console.log('CleverTapID', res, err);
      //@Step 3 pass the above clevertap id as the objectid for Ruddestack
      rudderClient.putAnonymousId(res)
      //STEP 4 - Initialize your config for rudderstack
      this.setState({
        config : {
          dataPlaneUrl : "https://clevertapmvsw.dataplane.rudderstack.com/", 
          logLevel: 3,
          recordScreenViews:false,
          trackAppLifecycleEvents:true,
          withFactories: [clevertap]
        }
      })
      console.log("SETUP SUCCESSFULLL")
      //STEP 5 - Initialize your key and pass the above config as below -- 
      rudderClient.setup("2IfcVJvRRqyCL7ko84EMYVaqm7P", this.state.config);
      console.log("SETUP END")

     
  });
    



    // this handles the case where a deep link launches the application
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('launch url', url);
        this._handleOpenUrl({ url });
      }
    }).catch(err => console.error('launch url error', err));

    // check to see if CleverTap has a launch deep link
    // handles the case where the app is launched from a push notification containing a deep link
    CleverTap.getInitialUrl((err, url) => {
      if (url) {
        console.log('CleverTap launch url-------', url);
        this._handleOpenUrl({ url }, 'CleverTap');
      } else if (err) {
        console.log('CleverTap launch url', err);
        // Alert.alert(err);
      }
    });

    this.getdisplayUnit()

  }


  _handleOpenUrl(event, from) {
    console.log('handleOpenUrl', event.url, from);
    Alert.alert(event.url);
  }

  _handleCleverTapEvent(eventName, event) {
    console.log("Push Notification Clicked ", eventName);
    console.log("Payload ", event);
    Alert.alert(eventName);
  }


  updateUserProfile() {
   CleverTapReact.onUserLogin({ 'Name': 'RUDDERSTACK10', 'Identity': 'rudderstack10', 'Email': 'rudderstack10@ct.com', 'custom1': '007' });
  
  // rudderClient.identify("rudderstack12", {
  //   name: "Name Surname",
  //   email: "email12@clevertap.com",
  //   phone: "+919869357512",
  //   gender: "F",
  //   city: "Mumbai",
  //   region: "Malad",
  //   country: "India",
  //   "MSG-email": true,
  //   "MSG-sms": true,
  //   "MSG-push":true,
  // })  
  
  Alert.alert('Profile Pushed');
  }

  updateUserProfile2() {
    // CleverTapReact.setDebugLevel(0);
   CleverTapReact.onUserLogin({ 'Name': 'RUDDERSTACk11', 'Identity': 'rudderstack11', 'Email': 'rudderstack11@ct.com', 'custom1': '007' });
   
  //  rudderClient.identify("rudderstack13", {
  //   name: "Name Surname",
  //   email: "email13@clevertap.com",
  //   phone: "+919869357513",
  //   gender: "F",
  //   city: "Mumbai",
  //   region: "Malad",
  //   country: "India",
  //   "MSG-email": true,
  //   "MSG-sms": true,
  //   "MSG-push":true,
  // })

   
   Alert.alert('Profile Pushed');
  }
  pushEvent() {
    CleverTap.recordEvent('Product Liked', { 'productName': 'React Native', 'productId': '1234' });
    CleverTap.recordEvent('test');
    rudderClient.track("Checked Out", {
      Clicked_Rush_delivery_Button: true,
      total_value: 2000,
      revenue: 2000,
    });
    Alert.alert('Event Pushed');
  }


  getdisplayUnit() {
    CleverTap.addListener(CleverTap.CleverTapDisplayUnitsLoaded, (data) => {
      console.log(JSON.stringify(data))
    });
  }

  showInBox() {
    CleverTap.showInbox();
  }
  pushNotification() {
    CleverTap.recordEvent('Reactnativepush');

  }
  pushNotificationImage() {
    CleverTap.recordEvent('ReactnativepushImage');

  }
  inapp() {
    CleverTap.recordEvent('ReactNInapp');

  }
  render() {
    return (
      <>
        <StatusBar />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={{ borderWidth: 20, height: 300, backgroundColor: '#fff', borderBottomEndRadius: 50 }}>

              <FlatList
                horizontal
                data={this.state.banner}
                renderItem={({ item }) =>
                  <View style={{ backgroundColor: '#fff', borderBottomEndRadius: 30 }}>
                    <Image
                      source={{ uri: item.url }}
                      style={{
                        width: 360,
                        height: 300,
                        borderWidth: 0,
                        borderColor: '#d35647',
                        resizeMode: 'contain',
                        margin: 1, borderBottomEndRadius: 50
                      }}
                    />
                    <Text style={{ fontSize: 40 }}>{item.name}</Text>
                  </View>

                }

              />
            </View>

            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Profile 1 </Text>
                <Text style={styles.sectionDescription}>
                  Use the below button to create a user profile using onUserLogin method
                </Text>
                <View style={styles.multiButtonContainer}>

                  <Button
                    onPress={this.updateUserProfile}
                    title="Login"
                    color="#fff"
                  />

                </View>
              </View>


              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}> Profile 2 </Text>
                <Text style={styles.sectionDescription}>
                  Use the below button to create a user profile using onUserLogin method
                </Text>
                <View style={styles.multiButtonContainer}>

                  <Button
                    onPress={this.updateUserProfile2}
                    title="Login"
                    color="#fff"
                  />

                </View>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Push Event</Text>
                <Text style={styles.sectionDescription}>
                  Use the below button to push event <Text style={styles.highlight}>Reactnative</Text> to the user's Profile
                </Text>
                <View style={styles.multiButtonContainer}>

                  <Button
                    onPress={this.pushEvent}
                    title="Push Event"
                    color="#fff"
                  />
                </View>
              </View>



              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>App Inbox</Text>
                <Text style={styles.sectionDescription}>
                  Use the below button to open <Text style={styles.highlight}>App Inbox</Text>
                </Text>
                <View style={styles.multiButtonContainer}>

                  <Button
                    onPress={this.showInBox}
                    title="App Inbox"
                    color="#fff"
                  />
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Push Notification</Text>
                <Text style={styles.sectionDescription}>
                  Use the below button to receive a <Text style={styles.highlight}>Push Notification</Text>
                </Text>
                <View style={styles.multiButtonContainer}>

                  <Button
                    onPress={this.pushNotification}
                    title="Push Notification"
                    color="#fff"
                  />
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Push Notification with Image</Text>
                <Text style={styles.sectionDescription}>
                  Use the below button to receive a <Text style={styles.highlight}>Push Notification with Image</Text>
                </Text>
                <View style={styles.multiButtonContainer}>

                  <Button
                    onPress={this.pushNotificationImage}
                    title="Push with Image"
                    color="#fff"
                  />
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>In App</Text>
                <Text style={styles.sectionDescription}>
                  Use the below button to receive an <Text style={styles.highlight}>In App Popup</Text>
                </Text>
                <View style={styles.multiButtonContainer}>

                  <Button
                    onPress={this.inapp}
                    title="In app"
                    color="#fff"
                  />
                </View>
              </View>

            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
    //};
  }
}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  multiButtonContainer: {
    margin: 20,
    backgroundColor: '#FF0000'
  }
});

export default App;
