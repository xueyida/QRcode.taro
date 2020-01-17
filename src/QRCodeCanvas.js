import Taro from '@tarojs/taro';
import Nerv from "nervjs";
import AtComponent from './common/component';
import QRCodeImpl  from 'qr.js/lib/QRCode';
import ErrorCorrectLevel  from 'qr.js/lib/ErrorCorrectLevel';


class QRCodeCanvas extends AtComponent {


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

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  update() {
    const {value, size, level, bgColor, fgColor} = this.props;
    const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
    qrcode.addData(this.convertStr(value));
    qrcode.make();

    if (this._canvas != null) {
      const canvas = this._canvas;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }
      const cells = qrcode.modules;
      if (cells === null) {
        return;
      }
      const tileW = size / cells.length;
      const tileH = size / cells.length;
      const scale = window.devicePixelRatio || 1;
      canvas.height = canvas.width = size * scale;
      ctx.scale(scale, scale);

      cells.forEach(function(row, rdx) {
        row.forEach(function(cell, cdx) {
          ctx && (ctx.fillStyle = cell ? fgColor : bgColor);
          const w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
          const h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
          ctx &&
            ctx.fillRect(
              Math.round(cdx * tileW),
              Math.round(rdx * tileH),
              w,
              h
            );
        });
      });
    }
  }

  render() {
    const {
      size,
      style,
      ...otherProps
    } = this.props;
    const canvasStyle = {height: size, width: size, ...style};
    return (
      <canvas
        style={canvasStyle}
        height={size}
        width={size}
        ref={(ref) =>
          (this._canvas = ref)
        }
        {...otherProps}
      />
    );
  }
}



module.exports = QRCodeCanvas;
