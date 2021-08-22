/**
 * 全局过滤器
 */

export default (Vue: Type.Object) => {

    // 格式化 钱省略到小数后两位
    Vue.filter('money', (value: string | number, unit: string) => {
        if (!unit) { unit = '' }
        return parseFloat(value + '').toFixed(2) + unit
    })

    // 空null强制替换占位符
    Vue.filter('notNull', (value: string, custom: string) => {
        let result;
        custom ? result = custom : result = ' ';
        if (value === '' || value === null) {
            return result
        } else { return value }
    })

    // 字符串裁切
    Vue.filter('substring', (str: string, length: number) => {
        if (str) {
            return str.substring(0, length)
        }
        return '';
    })

}
