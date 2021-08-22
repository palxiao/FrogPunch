import mutations from './mutations'
import actions from './actions'
import menus from '@/assets/data/menus'
const all = {
  state: {
    /**
     * 全局loading框，使用方式（主动关闭）：
     * this.$commit('loading', '加载框文字内容');
     * this.$commit('loading', false);
     */
    loading: null,
    online: true, // 登录状态，
    user: {
      name: localStorage.getItem('username') // 用来判断是哪种登录方式
    }, // 储存用户信息
    windowHeight: document.documentElement.clientHeight || document.body.clientHeight,
    windowWidth: document.documentElement.clientWidth || document.body.clientWidth,
    scroll: true,
    menus,
    routeFrom: null,
    timeState: null
  },
  getters: {
    windowHeight: (state: Type.Object) => {
      return state.windowHeight
    },
    windowWidth: (state: Type.Object) => {
      return state.windowWidth
    },
    scroll: (state: Type.Object) => {
      return state.scroll
    },
    menus: (state: Type.Object) => {
      return state.menus
    },
    routeFrom: (state: Type.Object) => {
      return state.routeFrom
    },
    timeState: (state: Type.Object) => {
      const h = new Date().getHours();
      return state.timeState ? state.timeState : h > 5 && h < 18 ? 'day' : 'night';
    },
    online: (state: Type.Object) => {
      return state.online
    },
    user: (state: Type.Object) => {
      return state.user
    }
  },
  mutations: {
    ...mutations
  },
  actions: {
    ...actions
  },
}
export default all
