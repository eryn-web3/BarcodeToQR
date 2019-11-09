import { Dimensions, Platform, StatusBar } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const statusHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const headerHeight = 50;

export default {
  window: {
    width,
    height,
    homeMenuHeight: 78
  },
  statusHeight: statusHeight,
  headerHeight: headerHeight,
  isSmallDevice: width < 375,

};
