import fetch from '../utils/axios'

export const add = (params: Type.Object) => fetch('api/user/add', params, 'post')

export const fingerLogin = (params: Type.Object) => fetch('api/user/fingerLogin', params, 'post')

export const fingerRegister = (params: Type.Object) => fetch('api/user/fingerRegister', params, 'post')

export const fingerBind = (params: Type.Object) => fetch('api/user/bindFinger', params, 'post')

export const getUser = (params: Type.Object) => fetch('api/user/get', params)

export const updateUser = (params: Type.Object) => fetch('api/user/update', params, 'post')

/** 便签 */

export const getMemoList = (params: Type.Object) => fetch('api/memo/list', params)

export const updateMemo = (params: Type.Object) => fetch('api/memo/update', params, 'post')
