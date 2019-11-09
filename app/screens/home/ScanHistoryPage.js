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
import BTQ_UTILS from '../../utils/BarcodeToQRUtils';
import Barcode from 'react-native-barcode-builder';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode';

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

class ScanHistoryPage extends React.Component {
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
      history: [],
      visibleModal: false,
      modalIndex: null
    }


  }


  /**
   * @method componentDidMount
   * @description This function is called component is loaded.
   */
  async componentDidMount() {
    var storage = await BTQ_UTILS.getStorage()
    if( !BTQ_UTILS.checkValid( storage ) ){
      storage = BTQ_UTILS.defaultStorage();
      await BTQ_UTILS.setStorage( storage )
    } else {
      console.log('-- history : ', storage.history)
      if( storage.history == undefined || storage.history == null ){
        storage = BTQ_UTILS.defaultStorage();
        await BTQ_UTILS.setStorage( storage );
        this.setState({
          history: []
        })
      } else {
        this.setState({
          history: storage.history
        })
      }
      
    }
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


  onShowModal( index ) {
    this.setState({
      visibleModal: true,
      modalIndex: index
    })
  }


  async onDeleteBarcode( index ) {
    var storage = await BTQ_UTILS.getStorage()
    if( !BTQ_UTILS.checkValid( storage ) ){
      storage = BTQ_UTILS.defaultStorage();
      await BTQ_UTILS.setStorage( storage )
    }
    
    var history = storage.history;
    console.log('-- history : ', history, index);
    for( var i=0; i<history.length; i++ ){
      if( i == index ){
        history.splice(i, 1)
      }
    }
    console.log('-- history splice : ', history);
    storage.history = history;

    await BTQ_UTILS.setStorage( storage )
    this.setState({
      visibleModal: false,
      history: history
    })
  }


  render() {

    var { lang, history, visibleModal, modalIndex } = this.state;
    var loading = <Text> </Text>;
    if( this.state.loading ){
      loading = <Loading type="full"/>;
    }

    var historyArr = [];
    var modalHistory = <View><Text> </Text></View>;

    for( var i=0; i<history.length; i++){
      var format = history[i].barcodeType.split('.');
      format = format[format.length-1].toUpperCase();
      format = format.replace('-', '');
      console.log('-- format : ', format, history[i].barcode);

      historyArr.push(
        <TouchableOpacity key={'history-' + i} onPress={this.onShowModal.bind(this, i)} style={{paddingVertical: 10, paddingHorizontal: 20, borderBottomColor: '#666', borderBottomWidth: 1}}>
          <Text style={{fontSize: 12, color: '#fff'}}>TYPE: {history[i].barcodeType}</Text>
          <Text style={{fontSize: 20, color: '#0f0'}}>{history[i].barcode}</Text>
          <View style={{marginTop: 10, paddingHorizontal: 0}}>
            <Barcode value={history[i].barcode} format={format} height={25} width={1} padding={5}/>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 12, color: '#999'}}>{history[i].description}</Text>
          </View>
          <View style={{position: 'absolute', width: (LW-40)/2, height: 30, top: 0, right: 20, alignItems: 'flex-end'}}>
            <View style={{backgroundColor: history[i].create=='Scanned' ? '#33a':'#a33', paddingHorizontal: 10, paddingVertical: 5, marginBottom: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
              <Text style={{fontSize: 12, color: '#fff'}}>{history[i].create}</Text>
            </View>
            <Text style={{fontSize: 12, color: '#fff', textAlign: 'right'}}>{BTQ_UTILS.getFormattedDate(history[i].time) }</Text>
          </View>
        </TouchableOpacity>
      );

      if( modalIndex == i ){
        modalHistory = 
          <View style={{}}>
            <View style={{paddingVertical: RateWH>2 ? 30:10, paddingHorizontal: 20, width: LW-40}}>
              <Text style={{fontSize: 12, color: '#fff'}}>TYPE: {history[i].barcodeType}</Text>
              <Text style={{fontSize: 20, color: '#0f0'}}>{history[i].barcode}</Text>
            </View>
            <View style={{paddingBottom: RateWH>2 ? 20:10, paddingHorizontal: 20, width: LW-40, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{width: 290, borderRadius: 10}}>
                <Barcode value={history[i].barcode} format={format} height={30} width={1}  padding={10} style={{marginBottom: 20}}/>
              </View>
            </View>
            <View style={{paddingVertical: 10, paddingHorizontal: 20, width: LW-40, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{width: 290, height: 290, borderRadius: 10, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20}}>
                <QRCode value={history[i].barcode} size={250} bgColor="#000" fgColor="#fff"/>
              </View>
            </View>
            <View style={{ paddingHorizontal: 20, width: LW-40, marginTop: 20}}>
              <Text style={styles.TextLabelStyle}>Description</Text>
              <Text style={styles.TextInputStyle}>{history[i].description}</Text>
            </View>
          </View>
          
      }
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="light-content"/>

        <View style={{position: 'absolute', left: 0, top: 0, width: LW, height: RateWH>2 ? 85:70, backgroundColor: '#000'}}>
          <View style={{width: LW, height: RateWH>2 ? 85:70, justifyContent: 'center', paddingTop: RateWH>2 ? 30:10}}>
            <Text style={{textAlign: 'center', color: '#0f0', fontSize: 20}}>History</Text>
          </View>  
          <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={{position: 'absolute', left: 20, top: RateWH>2 ? 40:25}}>
            <Icon name="angle-left" size={30} color="#0f0"></Icon>
          </TouchableOpacity>                  
        </View>

        <ScrollView style={styles.mainContent}>
          {historyArr}
        </ScrollView>

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

            { modalHistory }

            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: LW-80, marginTop: 20}}>
              <TouchableOpacity onPress={this.onDeleteBarcode.bind(this, modalIndex)} style={[styles.actionBtn, {marginRight: 20, backgroundColor: '#a33'}]}>
                <Text style={styles.actionBtnTxt}>Delete Barcode</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{this.setState({visibleModal: false})}} style={styles.actionBtn}>
                <Text style={styles.actionBtnTxt}>Close</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#222'
  },
  mainContent:{
    width: LW,
    height: LH-(RateWH>2 ? 85:70),
    marginTop: RateWH>2 ? 85:70
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
    paddingVertical: 5,
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
export default connect(mapStateToProps, mapDispatchToProps)(ScanHistoryPage);