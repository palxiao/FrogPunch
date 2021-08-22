import fetch from '../utils/axios'

export const list = (params: Type.Object) => fetch('api/event/list', params)

export const add = (params: Type.Object) => fetch('api/event/add', params, 'post')

export const del = (id: number) => fetch('api/event/delete', { id }, 'post')
