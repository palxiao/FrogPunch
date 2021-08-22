import mutations from './mutations'
import actions from './actions'
import presetTags from '@/assets/data/presetTags'
const all = {
  state: {
    clockIn: 0,
    executing: '',
    taskTags: [],
    now: new Date()
  },
  getters: {
    clockIn: (state: Type.Object) => {
      return state.clockIn
    },
    taskTags: (state: Type.Object) => {
      return state.taskTags.length > 0 ? state.taskTags : presetTags
    },
    executing: (state: Type.Object) => {
      return state.executing
    },
    nowObj: (state: Type.Object) => {
      const firstYday: any = new Date(state.now.getFullYear() + '/' + 1 + '/' + 1)
      const firstMday: any = new Date(state.now.getFullYear() + '/' + (state.now.getMonth() + 1) + '/' + 1)
      const yearDay = ((state.now - firstYday) / 1000 / 60 / 60 / 24).toFixed(0)
      const monthDay = (state.now.getDate() - firstMday.getDate() + 1)
      const weekDay = state.now.getDay() === 0 ? 7 : state.now.getDay()
      return {
        yearDay,
        monthDay,
        weekDay,
        month: new Date(state.now.getFullYear(), state.now.getMonth(), 0).getDate()
      }
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
