/**
 * 同步操作 store.commit() 调用
 */
import { Toast } from 'vant'
export default {
    loading(state: Type.Object, data: any) {
        Toast.clear();
        let msg = ''
        if (typeof data === 'string') {
            msg = data
        } else {
            Toast.clear();
            return false
        }
        Toast.loading({
            duration: 0,       // 持续展示 toast
            loadingType: 'spinner',
            message: msg
        });
    },
    changeScroll(state: Type.Object, data: boolean) {
        state.scroll = data
    },
    updateMenu(state: Type.Object, params: Type.Object) {
        const data = state.menus[params.index]
        if (typeof data.select !== 'undefined') {
            data.select = !data.select;
        }
        if (data.module && typeof data.select === 'undefined') {
            state.menus.forEach((item: Type.Object) => {
                if (typeof item.show !== 'undefined') { item.show = false }
            });
            if (typeof data.show !== 'undefined') { state.menus[params.index].show = true }
        }
    },
    changeRoute(state: Type.Object, from: string) {
        state.routeFrom = from;
    },
    changeOnline(state: Type.Object, status: string) {
        state.online = status;
    },
    changeUser(state: Type.Object, name: string) {
        state.user.name = name;
        state.user = Object.assign({}, state.user)
        localStorage.setItem('username', name);
    }
}
