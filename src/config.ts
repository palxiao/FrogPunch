/*
 * @Author: ShawnPhang
 * @Date: 2021-07-03 20:46:04
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-08-21 23:16:28
 * @site: book.palxp.com / blog.palxp.com
 */
/**
 *   0 本地服务器   1 线上服务器
 */
const isProduction = process.env.NODE_ENV === 'production'
const environment: number = isProduction ? 1 : 0

let apiUrl!: string
if (environment === 0) {
  apiUrl = 'http://localhost:9999'
} else {
  apiUrl = '${api_url}'
}

export default {
  VERSION: '1.2.1',
  APP_COPYRIGHT: '',
  API_URL: apiUrl,
  IMG_URL: '',
  // login: 'http://  /login',
  // wx_redirectUri: 'http://localhost:8080'
  // wx_redirectUri: 'http://192.168.2.130:8080'
}
