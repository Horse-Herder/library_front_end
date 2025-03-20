import { initBooksList } from '@/api';
import qs from "qs";

const state = {
    booksList: [],
    total: 0, // 新增：存储书籍总数
    page: 1, // 新增：当前页码
    pageSize: 10 // 新增：每页显示数量
};

const actions = {
    initBooksList({ commit, rootState }, { page = 1, pageSize = 10 }) {
        const isAdmin = rootState.User.isAdmin; // 获取 isAdmin 状态
        const params = qs.stringify({ isAdmin: isAdmin, page, pageSize });
        initBooksList(params).then(res => {
            if (res.status == 200) {
                commit('INITBOOKSLIST', res.data);
                commit('SET_TOTAL', res.total); // 设置书籍总数
                commit('SET_CURRENT_PAGE', page); // 设置当前页码
                commit('SET_PAGE_SIZE', pageSize); // 设置每页显示数量
            }
        }, err => console.log(err.message));
    }
};

const mutations = {
    INITBOOKSLIST(state, data) {
        data = data || [];
        state.booksList = data.filter(item => {
            return item;
        });
    },
    SET_TOTAL(state, total) {
        state.total = total;
    },
    SET_CURRENT_PAGE(state, page) {
        state.currentPage = page;
    },
    SET_PAGE_SIZE(state, pageSize) {
        state.pageSize = pageSize;
    }
};

const getters = {
    // 可以根据需要添加 getter
};

export default {
    state,
    actions,
    mutations,
    getters
};