import fetch from '../utils/axios'

export const login = (params: Type.Object) => fetch('api/user/login', params, 'post')

export const gql = (params: Type.Object) => fetch('graphql', params)

export const eventList = (params: Type.Object) => fetch('api/event/list', params)

export const eventAdd = (params: Type.Object) => fetch('api/event/add', params, 'post')

export const eventDelete = (id: number) => fetch('api/event/delete', { id }, 'post')

export const recordAdd = (params: Type.Object) => fetch('api/record/add', params, 'post')

export const recordList = (params: Type.Object) => fetch('api/record/list', params)

export const recordOne = (params: Type.Object) => fetch('api/record/one', params)

export const recordDelete = (params: Type.Object) => fetch('api/record/delete', params, 'post')
