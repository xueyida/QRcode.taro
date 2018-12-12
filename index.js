import Taro, { Component } from '@tarojs/taro';
import { View }  from '@tarojs/components';
import QRCodeSVG from './QRCodeSVG';
import QRCodeCanvas from './QRCodeCanvas';


class QRCode extends Component {
  state={
    defaultProps:{
      size: 128,
      level: 'L',
      bgColor: '#FFFFFF',
      fgColor: '#000000',
      renderAs: 'canvas',
      value: 'test'
    }
  }
  render(){
    const { defaultProps } = this.state;
    const { renderAs } = this.props;
    const props = {
      ...defaultProps,
      ...this.props,
    }
    return (
      <View>
        {
          renderAs === 'svg' ? (
            <QRCodeSVG {...props} />
          ) : (
            <QRCodeCanvas {...props} />
          )
        }
      </View>
    );
  }
}




export default QRCode;
