/** 菜单规则
 * action : up(打开组件，自动上滑)，jump(跳转页面), null(操作，点亮icon)
 * select : 控制icon选中样式，同时控制组件显示，优先级高于show
 * module : 组件模式，根据菜单循环主页面程序
 * show : 组件模式下控制是否显示组件
 * path : 跳转页面的路径信息
 */
export default [
    {
        name: '生之钟',
        icon: 'underway',
        select: true,
        module: 'lifeClock'
    },
    {
        name: '小打卡',
        icon: 'sign',
        action: 'up',
        show: true,
        module: 'clockIn'
    },
    {
        name: '小目标',
        icon: 'aim', // diamond-o
        action: 'up',
        show: false,
        module: 'target'
    },
    {
        name: '记忆森林',
        icon: 'edit',
        action: 'jump',
        path: '/notepad'
    },
    {
        name: '分析',
        icon: 'tv-o', // cluster-o
        action: 'jump',
        path: '/chart'
    },
    {
        name: '目标清单',
        icon: 'todo-list-o',
        action: 'jump',
        path: '/target'
    },
    {
        name: '思维便签',
        icon: 'debit-pay',
        action: 'jump',
        path: '/stickyNotes'
    },
    {
        name: '时光沙漏',
        icon: 'filter-o', // exchange
        action: 'jump',
        path: '/exchange'
    },
    {
        name: '设置',
        icon: 'setting-o',
        action: 'jump',
        path: '/setting'
    }
]
