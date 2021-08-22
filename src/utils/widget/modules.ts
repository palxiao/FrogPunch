/**
 * 全局组件注册
 */
import { Button, Field, Divider, NavBar, Toast, Popup } from 'vant'

export default (Vue: Type.Object) => {
    Vue.component(Button.name, Button)
    Vue.use(Field).use(Divider).use(NavBar).use(Toast).use(Popup)
}
