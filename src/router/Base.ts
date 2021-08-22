export default [
    {
        path: '/',
        name: 'main',
        redirect: 'home',
        component: () => import('@/views/Ready.vue'),
        children: [{
            name: 'home',
            path: '/home',
            component: () => import(/* webpackChunkName: 'base' */ '@/views/Index.vue')
        }]
    },
    {
        path: '/notepad',
        name: 'notepad',
        redirect: 'notepad',
        component: () => import('@/views/Ready.vue'),
        children: [{
            path: '/notepad',
            component: () => import(/* webpackChunkName: 'note' */ '@/views/NotePad.vue')
        }]
    },
    {
        path: '/setting',
        name: 'setting',
        redirect: 'setting',
        component: () => import('@/views/Ready.vue'),
        children: [{
            path: '/setting',
            component: () => import(/* webpackChunkName: 'setting' */ '@/views/Setting.vue')
        }]
    },
    {
        path: '/chart',
        name: 'chart',
        redirect: 'chart',
        component: () => import('@/views/Ready.vue'),
        children: [{
            path: '/chart',
            component: () => import(/* webpackChunkName: 'chart' */ '@/views/Chart.vue')
        }]
    },
    {
        path: '/login',
        redirect: 'login',
        component: () => import('@/views/Ready.vue'),
        children: [{
            name: 'login',
            path: '/login',
            component: () => import(/* webpackChunkName: 'base' */ '@/views/Login.vue')
        }]
    },
    {
        path: '/target',
        redirect: 'target',
        component: () => import('@/views/Ready.vue'),
        children: [{
            name: 'target',
            path: '/target',
            component: () => import(/* webpackChunkName: 'target' */ '@/views/TargetList.vue')
        }]
    },
    {
        path: '/exchange',
        redirect: 'exchange',
        component: () => import('@/views/Ready.vue'),
        children: [{
            name: 'exchange',
            path: '/exchange',
            component: () => import(/* webpackChunkName: 'exchange' */ '@/views/Exchange.vue')
        }]
    },
    {
        path: '/stickyNotes',
        redirect: 'stickyNotes',
        component: () => import('@/views/Ready.vue'),
        children: [{
            name: 'stickyNotes',
            path: '/stickyNotes',
            component: () => import(/* webpackChunkName: 'StickyNotes' */ '@/views/StickyNotes.vue')
        }]
    },
]
