class Query {
    public static unite(name: string, need: any, params: Type.Object) {
        params.token = localStorage.getItem('token')
        let newParams: string = ''
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const item = params[key];
                newParams += '\n' + key + ':"' + item + '"';
            }
        }
        let newNeed: string = ''
        need.forEach((item: string) => {
            newNeed += '\n' + item;
        });
        return '{' + name + '(params:{' + newParams + '}){' + newNeed + '}}'
    }
}
export default Query
