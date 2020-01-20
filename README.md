<h1 align="center">QRCode.Taro</h1>

Taro 二维码组件，根据QRcode.js封装


## 安装

```bash
  
  npm install qrcode.taro -S

```

```bash
  
  yarn add qrcode.taro -S

```

## API

### props

|参数      |说明               |类型                |默认值      |
|----------|-------------------|--------------------|------------|
|`renderAs`|  渲染类型         |  canvas \| svg |  canvas    |
|`value`   | 生成二维码码的内容|  `sring`             |  test      | 
|`size`    | 生成二维码的尺寸  |  `number`            |  128       |
|`bgColor` | 二维码背景颜色    |  `string`            |  #fff     |
|`fgColor` | 二维码前景颜色    |  `string`            |  #000      |


## 使用

### 使用的文件

```javascript
  
  import QRcode from 'qrcode.taro'

  const App = () => (
    <>
      <QRcode />
    </>
  );

```

### 修改 `config/index.js`

```javascript
  const config = {
    ...
    h5: {
      ...
      esnextModules: ['qrcode.taro'],
    },
  }

```

### 注意事项

  使用前请确保项目中已经安装了Taro相关的库，主要有如下：

  - `@tarojs/taro`

  - `nervjs`

  - `@tarojs/components`
 
  - `qr.js`




