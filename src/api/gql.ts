import fetch from '@/utils/axios'
import Query from '@/utils/query';

export const getRecord = (need: string[], params: Type.Object) => fetch('graphql', {
    query: Query.unite('getRecord', need, params)
})

export const getNote = (need: string[], params: Type.Object) => fetch('graphql', {
    query: Query.unite('getNote', need, params)
})

export const getTargetRecord = (need: string[], params: Type.Object) => fetch('graphql', {
    query: Query.unite('getTargetRecord', need, params)
})
