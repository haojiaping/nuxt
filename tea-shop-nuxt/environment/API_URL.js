
// 根据环境来使用baseURL
import { isDevMode, isProdMode } from './esm'
let baseURL = ''
if (isDevMode) { // 开发环境
  // baseURL = 'http://10.10.10.188:10001/v1/'
  // baseURL = 'https://lei89987.mynatapp.cc/v1/';
  // baseURL = 'https://lei89987.mynatapp.cc/v1/';
  // baseURL = 'https://tea.izhentea.com/v1/';
  // baseURL = 'http://10.10.10.161:10001/v1/'
  // baseURL = 'https://tea.chazhenxuan.com/v1/'
  // baseURL = 'http://10.10.10.161:10001/v1/'
  baseURL = 'https://tea.chazhenxuan.com/v1/'
} else if (isProdMode) { // 正式环境
  // baseURL = 'https://tea.izhentea.com/v1/';
  baseURL = 'https://tea.chazhenxuan.com/v1/'
  // baseURL = 'http://10.10.10.161:10001/v1/'
}
export default baseURL
