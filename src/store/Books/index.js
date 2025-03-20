import {initBooksList} from '@/api'
import qs from "qs";
const state = {
   booksList:[],
}

const actions = {
    initBooksList({commit}){
        initBooksList().then(res=>{
            console.log(res);
            
            if(res.status == 200)
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