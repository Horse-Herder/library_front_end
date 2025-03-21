import {initCommentsList} from '@/api'


const state = {
  commentsList:[]
}

// readerName:'',
// bookName:'',
// date:'',
// content:'',
// prise:0

const actions = {
    initCommentsList({commit}){
        initCommentsList().then(res=>{
            console.log(res);
        commit('INITCOMMENTSLIST',res.data)
        },err=>console.log(err.message))
    }
}

const mutations = {
    INITCOMMENTSLIST(state,data){
        // 保存评论区数组
        state.commentsList = data || []
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