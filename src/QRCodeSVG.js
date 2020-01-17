import Taro from '@tarojs/taro';
import Nerv from "nervjs";
import AtComponent from './common/component';
import QRCodeImpl from 'qr.js/lib/QRCode';
import ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel';

class QRCodeSVG extends AtComponent {

  convertStr(str){
    let out = '';
    for (let i = 0; i < str.length; i++) {
      let charcode = str.charCodeAt(i);
      if (charcode < 0x0080) {
        out += String.fromCharCode(charcode);
      } else if (charcode < 0x0800) {
        out += String.fromCharCode(0xc0 | (charcode >> 6));
        out += String.fromCharCode(0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        out += String.fromCharCode(0xe0 | (charcode >> 12));
        out += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
        out += String.fromCharCode(0x80 | (charcode & 0x3f));
      } else {
        // This is a surrogate pair, so we'll reconsitute the pieces and work
        // from that
        i++;
        charcode =
          0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        out += String.fromCharCode(0xf0 | (charcode >> 18));
        out += String.fromCharCode(0x80 | ((charcode >> 12) & 0x3f));
        out += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
        out += String.fromCharCode(0x80 | (charcode & 0x3f));
      }
    }
    return out;
  }


  render() {
    const {value, size, level, bgColor, fgColor, ...otherProps} = this.props;
    const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
    qrcode.addData(this.convertStr(value));
    qrcode.make();

    const cells = qrcode.modules;
    if (cells === null) {
      return;
    }
   
    const ops = [];
    cells.forEach(function(row, y) {
      let start = null;
      row.forEach(function(cell, x) {
        if (!cell && start !== null) {
     
          ops.push(`M${start} ${y}h${x - start}v1H${start}z`);
          start = null;
          return;
        }

        if (x === row.length - 1) {
          if (!cell) {
         
            return;
          }
          if (start === null) {
            // Just a single dark module.
            ops.push(`M${x},${y} h1v1H${x}z`);
          } else {
            // Otherwise finish the current line.
            ops.push(`M${start},${y} h${x + 1 - start}v1H${start}z`);
          }
          return;
        }

        if (cell && start === null) {
          start = x;
        }
      });
    });
    // const 
    return (
      <svg
        shapeRendering='crispEdges'
        height={size}
        width={size}
        viewBox={`0 0 ${cells.length} ${cells.length}`}
        {...otherProps}
      >
        <path fill={bgColor} d={`M0,0 h${cells.length}v${cells.length}H0z`} />
        <path fill={fgColor} d={ops.join('')} />
      </svg>
    );
  }
}



module.exports = QRCodeSVG;
