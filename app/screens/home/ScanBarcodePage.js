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
  StatusBar,
  AsyncStorage,
  WebView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CircularTimer from 'react-native-circular-timer';
import BTQ_UTILS from '../../utils/BarcodeToQRUtils'
import Camera, { RNCamera } from 'react-native-camera';
import Barcode from 'react-native-barcode-builder';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// language
import __T from '../../translate/lang';

// custom component
import Loading from '../../components/common/Loading';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// constant
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;
import config from '../../constants/config';

class ScanBarcodePage extends React.Component {
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
      loading: false,
      lang: this.props.lang.lang,
      torchOn: false,
      visibleModal: false,
      barcode: '',
      barcodeType: '',
      description: ''
    }

    this.handleTourch = this.handleTourch.bind(this);
    this.onSaveBarcode = this.onSaveBarcode.bind(this);
  }


  /**
   * @method componentWillMount
   * @description This function is called component is loaded.
   */
  async componentWillMount() {
     
  }


  /**
   * @method componentWillReceiveProps
   * @description This function is called when props is passed to this element
   * @param props
   */
  async componentWillReceiveProps( nextProps ) {
    var lang = nextProps.lang.lang;
    console.log('-- ArithmeticPage componentWillReceiveProps lang : ', lang)
    this.setState({
      lang: lang,
    })
  }


  onBarCodeRead = (e) => {
    // Alert.alert("Barcode value is"+e.data ,"Barcode type is"+e.type);
    var formats = ["CODE39","CODE128","CODE128A","CODE128B","CODE128C","EAN13","EAN8","EAN5","EAN2","UPC","UPCE","ITF14","ITF","MSI","MSI10","MSI11","MSI1010","MSI1110","pharmacode","codabar","GenericBarcode"];
    var format = e.type.split('.');
    format = format[format.length-1].toUpperCase();
    format = format.replace('-', '');

    if( !formats.includes( format ) ) return
    if( this.state.visibleModal == true ) return;

    this.setState({
      visibleModal: true,
      barcode: e.data,
      barcodeType: e.type
    })
  }


  handleTourch(value) {
    if (value === true) {
        this.setState({ torchOn: false });
    } else {
        this.setState({ torchOn: true });
    }
  }


  async onSaveBarcode(){
    var { barcode, barcodeType, description } = this.state;

    var storage = await BTQ_UTILS.getStorage()
    if( !BTQ_UTILS.checkValid( storage ) ){
      storage = BTQ_UTILS.defaultStorage();
    } 

    var history = {
      time: new Date(),
      barcode: barcode,
      barcodeType: barcodeType,
      description: description,
      create: 'Scanned'
    }    

    storage.history.push( history );
    console.log('-- storage.history : ', storage.history);
    BTQ_UTILS.setStorage( storage );

    this.setState({
      visibleModal: false
    })
  }


  onChangeDescription(description){
    this.setState({
      description: description
    })
  }


  render() {

    var { lang, visibleModal, barcode, barcodeType } = this.state;
    var loading = <Text> </Text>;
    if( this.state.loading ){
      loading = <Loading type="full"/>;
    }

    var format = barcodeType.split('.');
    format = format[format.length-1].toUpperCase();
    format = format.replace('-', '');
    var modalHistory = 
      <View style={{}}>
        <View style={{paddingVertical: RateWH>2 ? 30:10, paddingHorizontal: 20, width: LW-40}}>
          <Text style={{fontSize: 12, color: '#fff'}}>TYPE: {barcodeType}</Text>
          <Text style={{fontSize: 20, color: '#0f0'}}>{barcode}</Text>
        </View>
        <View style={{paddingBottom: RateWH>2 ? 20:10, paddingHorizontal: 20, width: LW-40, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: 290, borderRadius: 10}}>
            <Barcode value={barcode} format={format} height={30} width={1}  padding={10} style={{marginBottom: 20}}/>
          </View>
        </View>
        <View style={{paddingVertical: 10, paddingHorizontal: 20, width: LW-40, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: 290, height: 290, borderRadius: 10, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20}}>
            <QRCode value={barcode} size={250} bgColor="#000" fgColor="#fff"/>
          </View>
        </View>
      </View>

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="light-content"/>
        
        <View style={{position: 'absolute', left: 0, top: 0, width: LW, height: RateWH>2 ? 85:70, backgroundColor: '#000'}}>
          <View style={{width: LW, height: RateWH>2 ? 85:70, justifyContent: 'center', paddingTop: RateWH>2 ? 30:10}}>
            <Text style={{textAlign: 'center', color: '#0f0', fontSize: 20}}>Scan Barcode</Text>
          </View>  
          <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={{position: 'absolute', left: 20, top: RateWH>2 ? 40:25}}>
            <Icon name="angle-left" size={30} color="#0f0"></Icon>
          </TouchableOpacity>                  
        </View>

        <View style={styles.mainContent}>
          <RNCamera
            style={styles.preview}
            FlashMode={this.state.torchOn ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
            onBarCodeRead={this.onBarCodeRead}
            ref={cam => this.camera = cam}
          >
            <View style={{width: LW, padding: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)'}}>
              <Text style={{color: '#fff', fontSize: 16}}>Please scan your barcode</Text>
            </View>
            
          </RNCamera>
          {/* <View style={styles.bottomOverlay}>
            <TouchableOpacity onPress={() => this.handleTourch(this.state.torchOn)}>
              <Image style={styles.cameraIcon}
              source={this.state.torchOn === true ? require('../../assets/images/flasher_on.png') : require('../../assets/images/flasher_off.png')} />
            </TouchableOpacity>
          </View>           */}
        </View>

        <Modal
          isVisible={visibleModal}
          backdropColor="rgba(0, 0, 0, 0.9)"
          backdropOpacity={1}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
          
          <View style={styles.mainContainer}>
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{width: 120, height: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0', borderBottomLeftRadius: 3, borderBottomEndRadius: 3}}>
                <Text style={{fontSize: 14, color: '#000'}}>Barcode -> QR</Text>
              </View>
            </View>
            <KeyboardAwareScrollView style={{}}>
              { modalHistory }

              <View style={{width: LW-80, marginLeft: 20,  marginTop: 10}}>
                <Text style={styles.TextLabelStyle}>Description</Text>
                <TextInput
                  style={styles.TextInputStyle}
                  placeholder=''
                  placeholderTextColor="#666666"
                  underlineColorAndroid="#ffffff00"
                  autoCorrect={false}
                  onChangeText={(text) => this.onChangeDescription(text)}
                /> 
              </View>
              
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: LW-80, marginTop: 20, marginLeft: 20}}>
                <TouchableOpacity onPress={this.onSaveBarcode} style={[styles.actionBtn, {marginRight: 20, backgroundColor: '#3a3'}]}>
                  <Text style={styles.actionBtnTxt}>Save Barcode</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.setState({visibleModal: false})}} style={styles.actionBtn}>
                  <Text style={styles.actionBtnTxt}>Close</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </View>
          
          
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: LW, 
    height:LH, 
    flex: 1,
    backgroundColor: Colors.mainBkColor
  },
  mainContent:{
    width: LW,
    height: LH-(RateWH>2 ? 85:70),
    marginTop: RateWH>2 ? 85:70,
    backgroundColor: '#222'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cameraIcon: {
    margin: 5,
    height: 40,
    width: 40
  },
  bottomOverlay: {
    position: "absolute",
    width: "100%",
    flex: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  mainContainer: {
    backgroundColor: "#444",
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    color: '#fff',
  },
  actionBtn: {
    backgroundColor: '#222', 
    width: (LW-100)/2,
    height: RateWH>2 ? 50:40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  actionBtnTxt: {
    fontSize: 16,
    color: '#fff'
  },
  TextInputStyle: {
    borderBottomColor: '#0f0',
    borderBottomWidth: 1,
    paddingVertical: 10,
    width: LW-80,
    color: '#fff',
    fontSize: 16
  },
  TextLabelStyle: {    
    color: '#0f0',
    fontSize: 12
  }
});

function mapStateToProps(state) {
  return {
    lang: state.lang,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ScanBarcodePage);