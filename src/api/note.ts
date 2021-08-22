import fetch from '../utils/axios'

export const add = (params: Type.Object) => fetch('api/note/add', params, 'post')

export const del = (id: number) => fetch('api/note/delete', { id }, 'post')
