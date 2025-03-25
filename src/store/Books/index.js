import {initBooksList} from '@/api'
import qs from "qs";
import da from "element-ui/src/locale/lang/da";

const state = {
   booksList:[],
}

const actions = {
    initBooksList({commit }){
        initBooksList().then(res=>{
            if(res.status === 200 && res.error_code === 1)
                commit('INITBOOKSLIST',res.data)
        },err=>console.log(err.message))
    }
}

const mutations = {

    INITBOOKSLIST(state,data){
        data = data || []
        state.booksList = data.filter(item=>{
            return item
        })
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