import Taro from '@tarojs/taro-h5';
import Nerv from "nervjs";
const REM_LAYOUT_DELAY = 500;
function delay() {
  return new Promise(resolve => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      setTimeout(() => {
        resolve();
      }, REM_LAYOUT_DELAY);
      return;
    }
    resolve();
  });
}
function delayQuerySelector($scope, selectorStr) {
  const selector = Taro.createSelectorQuery().in($scope);
  return new Promise(resolve => {
    delay().then(() => {
      selector.select(selectorStr).boundingClientRect().exec(res => {
        resolve(res);
      });
    });
  });
}
export { delay, delayQuerySelector };