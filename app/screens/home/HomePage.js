import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  Linking,
  Modal,
  StatusBar,
  AsyncStorage,
  WebView,
  Alert
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import BTQ_UTILS from '../../utils/BarcodeToQRUtils'

// language
import __T from '../../translate/lang';

// custom component
import Loading from '../../components/common/Loading';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LangActions from '../../actions/lang';

// constant
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Countries from '../../constants/Countries';
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;
import config from '../../constants/config';

class HomePage extends React.Component {
  static navigationOptions = {
    header: null,
  };

  timer: null

  /**
   * @method constructor
   * @description This is constructor function
   */
  constructor(props) {
    super(props);

    this.state = {
      hash: '',
      loading: false,
      plate: 'Scan a plate',
      lang: config.defalutCountry,
      visibleLanguageModal: false,
    }

    this.onClickLanguage = this.onClickLanguage.bind(this);
  }


  /**
   * @method componentWillMount
   * @description This function is called component is loaded.
   */
  async componentWillMount() {
        
    Linking.getInitialURL().then(url => {
      BTQ_UTILS.log(1, 'HomePage initialize url : ', url);
      if( url != undefined && url != null && url != '' )
        this.navigate(url);
    });

    var setLanguage = this.props.actions.LangActions.setLanguage;
    setLanguage(config.defalutCountry);
  }


  componentDidMount() { // B
    SplashScreen.hide();    
    
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
      BTQ_UTILS.log(1, 'HomePage componentDidMount ios');
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }


  /**
   * @method componentWillUnmount
   * @description This function is called component is unmount.
   */
  componentWillUnmount() { // C
    Linking.removeEventListener('url', this.handleOpenURL);
  }


  handleOpenURL = (event) => { // D

    console.log('----- handleOpenURL event : ', event);
    this.navigate(event.url);
  }


  navigate = (url) => { // E
    const { navigate } = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
  
    BTQ_UTILS.log(13, '------- HomePage navigate route : ', route);
    if( route.indexOf('home/restore/') > -1 ){      
      var hash = route.replace('home/restore/', '');
      BTQ_UTILS.log(13, '------- HomePage navigate hash : ', hash);
      clearTimeout(this.timer);
      this.setState({
        hash: hash,
        isHash: true
      });
      return;
    }
  }


  /**
   * @method onClickLanguage
   * @description call when user click language on Language modal
   */
  selectLanguage( country ){
    var setLanguage = this.props.actions.LangActions.setLanguage;
    setLanguage(country.code);

    this.setState({
      visibleLanguageModal: false,
      lang: country.code
    })
  }


  /**
   * @method onClickLanguage
   * @description show language modal
   */
  onClickLanguage() {
    this.setState({visibleLanguageModal: true})
  }


  render() {

    var { lang, visibleLanguageModal } = this.state;
    console.log('-- HomePage render lang : ', lang);

    var loading = <Text> </Text>;
    if( this.state.loading ){
      loading = <Loading type="full"/>;
    }

    var country = BTQ_UTILS.getCountry(lang);

    var languageElems = [];
    for( var i=0; i<Countries.length; i++ ){
      languageElems.push( <TouchableOpacity key={'c'+i} style={styles.dialogElem} onPress={this.selectLanguage.bind( this, Countries[i] )}>
        {Countries[i].flag}
        <Text style={styles.dialogElemText}>{Countries[i].language}</Text>
      </TouchableOpacity>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="light-content"/>
        <View style={{position: 'absolute', left: 0, top: 0, width: LW, height: LH, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../../assets/images/bk.jpg')} style={{width: LW, height: LW/1125*2436}}/>
        </View>
        <View style={styles.titleSec}>
          <Text style={styles.titleTxt}>Barcode To QR</Text>
        </View>
        <View style={styles.btnsSec}>
          <TouchableOpacity style={styles.btnElem} onPress={()=>{this.props.navigation.navigate('ScanBarcodePage')}}>
            <Text style={styles.btnElemTxt}>Scan Barcode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnElem} onPress={()=>{this.props.navigation.navigate('GenerateBarcodePage')}}>
            <Text style={styles.btnElemTxt}>Generate Barcode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnElem} onPress={()=>{this.props.navigation.navigate('ScanHistoryPage')}}>
            <Text style={styles.btnElemTxt}>History</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: LW, 
    height:LH, 
    flex: 1,
    backgroundColor: '#222'
  },
  titleSec:{
    marginTop: RateWH>2 ? 150 : 120,
    textAlign: "center",
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleTxt:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0f0',
    textAlign: 'center'
  },
  btnsSec: {
    width: LW-100,
    marginHorizontal: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: RateWH>2 ? 100 : 80
  },
  btnElem: {
    width: (LW-100),
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555',
    borderRadius: 10,
    marginVertical: 10,
  },
  btnElemTxt:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
});

function mapStateToProps(state) {
  return {
    lang: state.lang,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      LangActions: bindActionCreators(LangActions, dispatch),
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);