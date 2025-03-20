<template>
  <div>
    <el-table
        :data="readerList"
        style="width: 100%"
        :default-sort = "{prop: 'readerName', order: 'descending'}"
    >
      <el-table-column
          prop="readerName"
          label="姓名"
          sortable
          width="180"
      >
      </el-table-column>
      <el-table-column
          prop="phone"
          sortable
          label="电话"
      >
      </el-table-column>
      <el-table-column
          prop="email"
          sortable
          label="邮箱"
      >
      </el-table-column>
      <el-table-column
          prop="borrowTimes"
          sortable
          label="借阅次数"
      >
      </el-table-column>
      <el-table-column
          prop="ovdTimes"
          sortable
          label="逾期次数"
      >
      </el-table-column>
      <el-table-column
          label="操作"
      >
        <template slot-scope="scope">
          <el-popconfirm
              title="确认删除该人员吗？"
              @confirm="delPerson(scope.$index, scope.row)"
          >
            <el-button
                size="mini"
                type="danger"
                slot="reference"
            >
              删除人员
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[2, 10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { delPerson } from '@/api';
import qs from 'qs';

export default {
  name: 'AdminPerson',
  computed: {
    ...mapState({
      readerList(state) {
        return state.User.readerList;
      },
      total(state) {
        return state.User.total;
      },
      page(state) {
        return state.User.page;
      },
      pageSize(state) {
        return state.User.pageSize;
      }
    })
  },
  methods: {
    delPerson(index, row) {
      console.log(index, row);
      let infoObj = { readerId: row.readerId };
      delPerson(qs.stringify(infoObj)).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.$message({
            showClose: true,
            message: "删除人员成功！",
            type: "success",
          });
        }
        this.$store.dispatch('initReaderList', { page: this.page, pageSize: this.pageSize });
      }, err => {
        console.log(err.message);
      });
    },
    handleSizeChange(newSize) {
      this.$store.dispatch('initReaderList', { page: 1, pageSize: newSize });
    },
    handleCurrentChange(newPage) {
      this.$store.dispatch('initReaderList', { page: newPage, pageSize: this.pageSize });
    }
  },
  mounted() {
    this.$store.dispatch('initReaderList', { page: 1, pageSize: 10 });
  }
};
</script>

<style lang="less" scoped>

</style>