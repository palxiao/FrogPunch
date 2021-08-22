/**
 * 同步操作 store.commit() 调用
 */
export default {
    changeClockIn(state: Type.Object, data: any) {
        state.clockIn = data
    },
    exec(state: Type.Object, data: string) {
        state.executing = data
    },
    updateTags(state: Type.Object, data: Type.Object) {
        state.taskTags = data
    },
}
