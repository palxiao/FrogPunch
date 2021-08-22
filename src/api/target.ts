import fetch from '../utils/axios'

const prefix = 'api/'

export const getList = (params: Type.Object) => fetch(prefix + 'target/list', params)

export const addUpdate = (params: Type.Object) => fetch(prefix + 'target/addUpdate', params, 'post')

export const del = (params: Type.Object) => fetch(prefix + 'target/delete', params, 'post')

export const addEvent = (params: Type.Object) => fetch(prefix + 'target/bind_event', params, 'post')

export const delEvent = (params: Type.Object) => fetch(prefix + 'target/delete_event', params, 'post')
