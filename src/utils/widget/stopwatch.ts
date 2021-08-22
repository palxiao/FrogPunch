import store from '@/store'
let iCount: any
let d: number
let h: number
let m: number
let s: number
let ms: number
let nowDate: number
let between: number
let time: string
const stopwatch = (beginDate: number) => {
    const nowClockIn = store.getters.clockIn
    store.commit('changeClockIn', 0)
    clearInterval(iCount)
    if (nowClockIn !== 0) { return }
    if (!beginDate) { return }

    iCount = setInterval(() => {
        nowDate = new Date().getTime();
        between = nowDate - beginDate; // 顺时增加
        s = between / 1000;

        if (s > 0) {
            d = Math.floor(s / 3600 / 24);
            h = Math.floor(s / 3600) - d * 24;
            m = Math.floor(s / 60) - d * 24 * 60 - h * 60;
            s =
                Math.floor(s) - d * 24 * 3600 - h * 3600 - m * 60;
            ms =
                Math.floor(between) -
                d * 24 * 3600 * 1000 -
                h * 3600 * 1000 -
                m * 60 * 1000 -
                s * 1000;
        } else {
            d = h = m = s = 0
            ms =
                Math.floor(between) -
                d * 24 * 3600 * 1000 -
                h * 3600 * 1000 -
                m * 60 * 1000 -
                s * 1000;
        }
        h > 0 ? time = h + ':' : time = ''
        m > 0 ? time += (m + '').padStart(2, '0') + ':' : time += ''
        time += (s + '').padStart(2, '0') + ':' + (ms + '').padStart(3, '0')
        store.commit('changeClockIn', time)
        // if (s == 3) {
        //     clearInterval(iCount)
        // }
    }, 10);
}

export default stopwatch
