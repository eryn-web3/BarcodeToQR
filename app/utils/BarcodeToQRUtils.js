import Countries from '../constants/Countries'
import config from '../constants/config'
import {
  AsyncStorage
} from 'react-native'

const LOG_LEVEL = 12  // 5: error, 4: important, 3: start-end, 2: medium, 1: low
/**
 * @class Utils
 * @description util class
 */
class BarcodeToQRUtils {

  /**
   * @method constructor
   * @description This is constructor function
   */
  constructor() {
    
  }


  /**
   * @method copyObject
   * @description this function is to copy each key and value to new object.
   * @param obj 
   */
  copyObject( newObj, oldObj ) {
    for (var prop in oldObj) {
      if (oldObj.hasOwnProperty(prop)) {
        newObj[prop] = oldObj[prop];
      }
    }
  }


  /**
   * @method littleToBigEndian
   * @description this function is to convert little-endian hex string to big-endian.
   * @param leHexStr 
   */
  littleToBigEndian( leHexStr ) {
    var beHexStr = ''
    for( var i=0; i<leHexStr.length; i=i+2){
      var str = leHexStr.slice(i,i+2);
      beHexStr = str + beHexStr
    }
    return beHexStr;
  }


  /**
   * @method textEllipsis
   * @description This function is to get coin from symbol string.
   * @param text 
   * @param length
   * @return ellipsis
   */
  textEllipsis (text, length) {
    var ret = text;
    if( text.length > length ){
      ret = text.slice(0,length) + '...';
    }

    return ret;
  }


  /**
   * @method textEllipsis
   * @description This function is to get coin from symbol string.
   * @param text 
   * @param length
   * @return ellipsis
   */
  floatLimitText (fVal, length) {
    var ret = '' + fVal;
    if( ret.length > length ){
      ret = ret.slice(0,length);
    }

    return ret;
  }


  /**
   * @method getCountry
   * @description get country info.
   * @param - code: country code (ex: 'IT')
   * @returns country info
   */
  getCountry( code ) {
    for( var i=0; i<Countries.length; i++ ){
      if( Countries[i].code == code ) return Countries[i]
    }
    return ''
  }




  /**
   * @method defaultStorage
   * @description return default storage object.
   */
  defaultStorage() {
    return {
      history: []
    }
  }


  /**
   * @method getStorage
   * @description return storage object.
   */
  async getStorage() {
    var storage = await AsyncStorage.getItem('@barcodetoqr');
    storage = JSON.parse(storage);
    if( !this.checkValid( storage ) ){
      return null
    }
    return storage;
  }


  /**
   * @method setStorage
   * @description set storage.
   */
  async setStorage(storage) {
    await AsyncStorage.setItem('@barcodetoqr', JSON.stringify( storage ));
  }


  /**
   * @method getFormattedDate
   * @description to get formatted date string.
   * @param - date: javascript date object
   * @returns formatted date string
   *          (ex: '21-05-2019')
   */
  getFormattedDate(timestamp) {
    var date = new Date(timestamp);
    var month = date.getMonth() + 1;
    if( month<10 ) month = '0' + month
    var day = date .getDate();
    if( day<10 ) day = '0' + day
    var year = date .getFullYear();

    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var mins = date.getMinutes()+1 < 10 ? '0' + date.getMinutes() : date.getMinutes();
    
    return month + "/" + day + '/' + year + ' ' + hours + ':' + mins;
  }


  /**
   * @method checkValid
   * @description check value is valid or not.
   */
  checkValid( val ){
    try{
      if( val != undefined && val != null && val != '' && val != false && val != 'null' ) return true;
      return false;
    } catch(e) {
      return false;
    }    
  }
  

  log(){
    var level = arguments[0]
    if( level < LOG_LEVEL ) return;

    var args = [];
    for( var i=1; i<arguments.length; i++ ){
      args.push( arguments[i] );
    }
    console.log( args );
  }
}

export default new BarcodeToQRUtils()