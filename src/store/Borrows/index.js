import {initBorrowslist,initBorrows} from '@/api'
import qs from "qs";
// import {initBorrowslist} from '@/api'


const state = {
    // 管理员接收所有记录
  borrowsList:[],
    //读者只接收自己的借阅记录   
  borrows:[]
}

// readerName:'',
// bookName:'',
// date:'',
// content:'',
// prise:0

const actions = {
    initBorrowsList({commit}, {info, page = 1, pageSize = 10}) {
        initBorrowslist({info, page , pageSize  }).then(res=>{
            console.log(res);
            
        commit('INITBORROWSLIST',res.data)
        commit('INITBORROWSLISTTOATL',res.total)
        commit('INITBORROWSLISTPAGE',res.page)
        commit('INITBORROWSLISTPAGESIZE',res.pageSize)
        },err=>console.log(err.message))
    },
    // initBorrows({commit},data,{ page , pageSize  }){
    //     console.log('borrow',data);
    //     initBorrows(qs.stringify({data, page, pageSize })).then(res=>{
    //         console.log(res);
    //     commit('INITBORROWS',res.data)
    //     },err=>{
    //         console.log(err.message);
    //     })
    // },
}

const mutations = {
    INITBORROWSLIST(state,data){
        // 管理员保存借书记录的数组
        state.borrowsList = data
    },
    INITBORROWSLISTTOATL(state,total){
        state.borrowsList.total = total
    },
    INITBORROWSLISTPAGE(state,page){
        state.borrowsList.page = page
    },
    INITBORROWSLISTPAGESIZE(state,pageSize){
        state.borrowsList.pageSize = pageSize
    },









    INITBORROWS(state,data){
        // 读者保存自己的记录
        state.borrows = data
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