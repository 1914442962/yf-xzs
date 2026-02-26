import { reactive } from 'vue'
import store from '@/store'
import dayjs from 'dayjs'


const addRouters = async({ _this, title, data }) => {
    const { fullPath, hash, matched, meta, name, params, path, query, redirectedFrom } = _this

    let conponentObj = {
        fullPath,
        hash,
        matched,
        meta,
        name,
        params,
        path,
        query,
        redirectedFrom,
        keyid: String(dayjs(new Date()).valueOf())
    }
    if (data) {
        conponentObj.data = data
    }
    if (title) {
        conponentObj.title = title
    }
    await store.dispatch('cache/addCache', conponentObj)
    await store.commit('cache/setCurTabKeyStore', conponentObj.keyid)
}
export default addRouters