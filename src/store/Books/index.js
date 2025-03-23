import {initBooksList} from '@/api'
import qs from "qs";
const state = {
   booksList:[],
}

const actions = {
    initBooksList({commit, rootState}){
        const isAdmin = rootState.User.isAdmin; // 获取 isAdmin 状态
        console.log()
        initBooksList(qs.stringify({ isAdmin: isAdmin })).then(res=>{

            console.log(res);
            if(res.status == 200)
                commit('INITBOOKSLIST',res.data)
        },err=>console.log(err.message))
    }
}

const mutations = {
  
    INITBOOKSLIST(state,data){
        state.booksList  = data || []
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