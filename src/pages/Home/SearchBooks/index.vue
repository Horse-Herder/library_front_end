<template>
  <div>
    <el-input
      placeholder="请输入您要搜索的书名/作者"
      prefix-icon="el-icon-search"
      @keyup.enter.native="searchBook"
      @blur="clear"
      v-model="name"
    >
    </el-input>
    <el-table
      :data="flag == 0 ? booksList : searchBooks"
      height="650"
      style="width: 100%"
      v-loading.fullscreen.lock="loading"
      element-loading-text="正在处理..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="图书名称：">
              <span>{{ props.row.bookName }}</span
              >&nbsp;<el-button
                v-show="isAdmin"
                @click="changeBookName(props.row)"
                type="text"
                style="float: right"
                size="mini"
                icon="el-icon-edit"
                >修改</el-button
              >
            </el-form-item>
            <el-form-item label="出版社：">
              <span>{{ props.row.press }}</span
              >&nbsp;<el-button
                v-show="isAdmin"
                @click="changePress(props.row)"
                type="text"
                style="float: right"
                size="mini"
                icon="el-icon-edit"
            >修改</el-button
            >
            </el-form-item>
            <el-form-item label="ISBN：">
              <span>{{ props.row.isbn }}</span
              >&nbsp;<el-button
                v-show="isAdmin"
                @click="changeISBN(props.row)"
                type="text"
                style="float: right"
                size="mini"
                icon="el-icon-edit"
            >修改</el-button
            >
            </el-form-item>
            <el-form-item label="图书作者：">
              <span>{{ props.row.author }}</span
              >&nbsp;<el-button
                v-show="isAdmin"
                @click="changeBookAuthor(props.row)"
                type="text"
                style="float: right"
                size="mini"
                icon="el-icon-edit"
                >修改</el-button
              >
            </el-form-item>
            <el-form-item label="书籍位置：">
              <span>{{ props.row.position }}</span
              >&nbsp;<el-button
                v-show="isAdmin"
                @click="changeBookPosition(props.row)"
                type="text"
                style="float: right"
                size="mini"
                icon="el-icon-edit"
                >修改</el-button
              >
            </el-form-item>
               <el-form-item label="当前库存：">
              <span>{{ props.row.amount }}</span>
              &nbsp;<el-button
                v-show="isAdmin"
                @click="changeCurrentAmount(props.row)"
                type="text"
                style="float: right"
                size="mini"
                icon="el-icon-edit"
                >修改</el-button
              >
            </el-form-item>
            <el-form-item label="状态：">
              <el-switch
                  v-show="isAdmin"
                  v-model="props.row.status"
                  style="float: right"
                  active-text="上线"
                  inactive-text="未上线"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeBookStatus(props.row)"
              >
              </el-switch>
            </el-form-item>

            <el-form-item label="总库存："
              >&nbsp;&nbsp; <span>{{ props.row.totalAmount }}</span
              >
              
            </el-form-item>
         
            <el-form-item label="借阅次数：">
              <span>{{ props.row.borrowedTimes }}</span>
                <el-popconfirm
                  title="确认删除该书籍吗？"
                  v-if="isAdmin"
                  style="float: right;"
                  @confirm="delBook(props.row)"
                >
                  <el-button  size="mini" type="danger" slot="reference" 
                    >删除书籍</el-button
                  >
                </el-popconfirm>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="图书名称" sortable prop="bookName">
      </el-table-column>
      <el-table-column sortable label="出版社" prop="press">
      </el-table-column>
      <el-table-column sortable label="图书作者" prop="author">
      </el-table-column>
      <el-table-column sortable label="书号" prop="isbn">
      </el-table-column>
      <el-table-column sortable label="书籍位置" prop="position">
      </el-table-column>
      <el-table-column sortable label="当前库存" prop="amount">
      </el-table-column>
     <el-table-column label="操作" v-if="!isAdmin">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="bookReserve(scope.$index, scope.row)"
            >预约</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Pagination
        :currentPage="currentPage"
        :total="total"
        :pageSize="pageSize"
        @update:currentPage="updateCurrentPage"
        @update:pageSize="updatePageSize"
    />
  </div>
</template>
// ... existing code ...
<script>
import { mapState } from "vuex";
import { addReserve, searchBook, initBooksList, changeBookInfo, delBook } from "@/api";
import qs from "qs";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "SearchBooks",
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      name: "",
      flag: 0,
      borrowInfo: {
        borrowDate: "",
        realDate: "",
      },
      searchBooks: [],
    };
  },
  methods: {
    bookReserve(index, row) {
      this.loading = true;
      const { bookId } = row;
      const date = this.$moment().format("YYYY-MM-DD HH:mm:ss");
      const reserveObj = { readerId: this.readerId, bookId, date, status: "已预约" };
      addReserve(qs.stringify(reserveObj)).then(
        (res) => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.msg,
            type: res.error_code === 0 ? "error" : "success",
          });
          this.$store.dispatch("initReserve", { readerId: this.readerId });
        },
        (err) => {
          this.loading = false;
          console.log(err.message);
        }
      );
    },
    searchBook(e, page = this.page, limit = this.pageSize) {
      this.loading = true;
      initBooksList({ name: this.name, page, limit }).then(
        (res) => {
          this.loading = false;
          if (res.error_code === 1 || res.status === 200) {
            e.target.blur();
            this.flag = 1;
            this.searchBooks = res.data;
          } else {
            this.$message({
              showClose: true,
              message: "未找到相关书籍！",
              type: "error",
            });
          }
        },
        (err) => {
          this.loading = false;
          console.log(err.message);
        }
      );
    },
    clear() {
      this.flag = 0;
      this.searchBooks = [];
    },
    promptChange(row, field, label, status) {
      const { bookId } = row;
      this.$prompt(`请输入${label}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row[field],
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: `你修改的${label}是: ${value}`,
          });
          const infoObj = { bookId, value, status };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              this.$store.dispatch('initBooksList', { page: 1, limit: 10 });
              this.$store.dispatch("initReserveList");
            },
            (err) => {
              console.log(err.message);
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    changeBookAuthor(row) {
      this.promptChange(row, 'author', '图书作者', 2);
    },
    changeBookPosition(row) {
      this.promptChange(row, 'position', '书籍位置', 3);
    },
    changeCurrentAmount(row) {
      const { bookId, amount } = row;
      this.$prompt("请输入库存", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: amount,
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: `你修改当前库存是: ${value}`,
          });
          const difference = value - amount;
          const infoObj = { bookId, value, status: 4, difference };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              this.$store.dispatch('initBooksList', { page: 1, limit: 10 });
              this.$store.dispatch("initReserveList");
            },
            (err) => {
              console.log(err.message);
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    changePress(row) {
      this.promptChange(row, 'press', '出版社', 5);
    },
    changeISBN(row) {
      this.promptChange(row, 'isbn', 'ISBN', 6);
    },
    changeBookStatus(row) {
      const { bookId, status } = row;
      const infoObj = { bookId, value: status, status: 7 };
      changeBookInfo(qs.stringify(infoObj))
        .then((res) => {
          this.$message({
            type: res.status === 200 && res.error_code === 1 ? "success" : "error",
            message: res.msg || "状态更新失败",
          });
          this.$store.dispatch('initBooksList', { page: 1, limit: 10 });
        })
        .catch((err) => {
          console.log(err.message);
          this.$message({
            type: "error",
            message: `请求失败：${err.message}`,
          });
        });
    },
    delBook(row) {
      const { bookId } = row;
      delBook(qs.stringify({ bookId })).then(res => {
        this.$message({
          type: res.status === 200 && res.error_code === 1 ? "success" : "error",
          message: res.msg || "删除失败，请重试",
        });
        this.$store.dispatch('initBooksList', { page: 1, limit: 10 });
        this.$store.dispatch("initReserveList");
      }, err => {
        console.log(err.message);
      });
    },
    updateCurrentPage(page) {
      this.$store.commit('SET_CURRENT_PAGE', page);
      this.searchBook({ target: { blur: () => {} } }, page, this.pageSize);
    },
    updatePageSize(size) {
      this.$store.commit('SET_PAGE_SIZE', size);
      this.searchBook({ target: { blur: () => {} } }, this.currentPage, size);
    }
  },
  computed: {
    ...mapState({
      booksList: state => state.Books.booksList,
      currentPage: state => state.Books.currentPage,
      pageSize: state => state.Books.pageSize,
      total: state => state.Books.total,
      readerId: state => state.User.readerInfo.readerId,
      isAdmin: state => state.User.isAdmin,
    }),
  },
  mounted() {
    this.searchBook({ target: { blur: () => {} } }, 1, 10);
  },
};
</script>
// ... existing code ...

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>