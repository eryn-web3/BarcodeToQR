import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

import LoadingPage from '../screens/home/LoadingPage';
// import ApiPage from '../screens/home/ApiPage';
import HomePage from '../screens/home/HomePage';
import ScanBarcodePage from '../screens/home/ScanBarcodePage';
import ScanHistoryPage from '../screens/home/ScanHistoryPage';
import GenerateBarcodePage from '../screens/home/GenerateBarcodePage';

const AuthStackNavigator = createStackNavigator({
  Home: LoadingPage,
  // ApiPage: ApiPage,
  HomePage: HomePage,
  ScanBarcodePage: ScanBarcodePage,
  ScanHistoryPage: ScanHistoryPage,
  GenerateBarcodePage: GenerateBarcodePage,
}, {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0
    },
    headerTintColor: 'transparent',
    headerTitleStyle:{
      textAlign: 'center',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      flexGrow:1,
      alignSelf:'center',
      marginRight: Platform.select({
        ios: 18,
        android:76
      })
    },
    headerTransparent: true, 
  }
});


export default AuthStackNavigator
