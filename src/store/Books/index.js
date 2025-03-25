import {initBooksList} from '@/api'

const state = {
   booksList:[],
    currentPage: 1,
    pageSize: 10,
    total: 0,
}

const actions = {
    initBooksList({ commit }, { name, page, limit }) {
        initBooksList({name, page, limit }).then(res => {
            if (res.status === 200 && res.error_code === 1) {
                commit('INITIALISATION', res.data)
                commit('SET_TOTAL', res.total) // 假设后端返回了总记录数
            }
        }, err => console.log(err.message))
    }
}

const mutations = {

    INITIALISATION(state, data) {
        state.booksList = data || []
    },
    SET_TOTAL(state, total) {
        state.total = total
    },
    SET_CURRENT_PAGE(state, page) {
        state.currentPage = page
    },
    SET_PAGE_SIZE(state, size) {
        state.pageSize = size
    }

}

const getters = {
    booksList: state => state.booksList,
    currentPage: state => state.currentPage,
    pageSize: state => state.pageSize,
    total: state => state.total,
}

export default {
    state,
    actions,
    mutations,
    getters
}