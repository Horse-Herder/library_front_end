import { initReaderList } from '@/api'

const state = {
    adminName: '',
    readerInfo: {
        readerId: '',
        readerName: '',
        readerPhone: '',
    },
    readerList: [],
    isAdmin: false,
    total: 0
}

const actions = {
    setAdminInfo({ commit }, data) {
        commit('SETADMININFO', data)
    },
    setReaderInfo({ commit }, data) {
        commit('SETREADERINFO', data)
    },
    initReaderList({ commit }, { page, pageSize }) {
        initReaderList({ page, pageSize }).then(res => {
            console.log(res);
            commit('INITREADERLIST', res.data)
            commit('SETREADERTOTAL', res.total)
            commit('SETREADERPAGE', page)
            commit('SETREADERTPAGESIZE', pageSize)
        }, err => console.log(err.message))
    }
}

const mutations = {
    SETADMININFO(state, data) {
        // 保存管理员用户名
        state.adminName = data.userName
        state.isAdmin = data.isAdmin
    },
    SETREADERINFO(state, data) {
        // 保存读者用户名
        console.log(data);
        let { readerId, readerName, readerPhone, borrowTimes, ovdTimes, email } = data
        state.readerInfo = { readerId, readerName, readerPhone, borrowTimes, ovdTimes, email }
        state.isAdmin = data.isAdmin
    },
    INITREADERLIST(state, data) {
        state.readerList = data
    },
    SETREADERTOTAL(state, total) {
        state.total = total
    },

    SETREADERPAGE(state, page) {
        state.page = page;
    },
    SETREADERTPAGESIZE(state, pageSize) {
        state.pageSize = pageSize;
    }
}

const getters = {

}

export default {
    state,
    actions,
    mutations,
    getters
}