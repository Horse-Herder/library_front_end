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
      height="600"
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
    <!-- 分页组件 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addReserve, searchBook, changeBookInfo,delBook } from "@/api";
import qs from "qs";
export default {
  name: "SearchBooks",
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
      // page: 1,
      // pageSize: 10,
      // total: 0
    };
  },
  methods: {
    bookReserve(index, row) {
      this.loading = true;
      console.log(index, row);
      let readerId = this.readerId;
      let bookId = row.bookId;
      let date = this.$moment().format("YYYY-MM-DD HH:mm:ss");
      let reserveObj = { readerId, bookId, date, status: "已预约" };
      console.log(reserveObj);
      //  添加预约记录
      addReserve(qs.stringify(reserveObj)).then(
        (res) => {
          this.loading = false;
          console.log(res);
          if (res.error_code=== 0 ) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "error",
            });
          } else if (res.status === 200 && res.error_code=== 1 ) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "success",
            });
          }

          this.$store.dispatch("initReserve", { readerId: this.readerId });
        },
        (err) => {
          this.loading = false;
          console.log(err.message);
        }
      );
    },
    searchBook(e) {
      this.loading = true;
      const { page, pageSize } = this;

      const params = qs.stringify({ isAdmin: this.isAdmin,name: this.name, page: page, pageSize });
      searchBook(params).then(
          (res) => {
            this.loading = false;
            e.target.blur();
            this.flag = 1;
            this.searchBooks = res.data;
            console.log(res);
            if (res.error_code === 0 || res.status !== 200) {
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
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      if (this.flag === 0) {
        this.$store.dispatch('initBooksList', { page: this.page, pageSize: newSize });
      } else {
        this.searchBook({ target: { blur: () => {} } });
      }
    },
    handleCurrentChange(newPage) {
      this.page = newPage;
      if (this.flag === 0) {
        this.$store.dispatch('initBooksList', { page: newPage, pageSize: this.pageSize });
      } else {
        this.searchBook({ target: { blur: () => {} } });
      }
    },
    changeBookAuthor(row) {
      console.log(row);
      var bookId = row.bookId;
      var status = 2;
      this.$prompt("请输入ISBN", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.author,
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "你修改的ISBN是: " + value,
          });
          // 修改的信息
          var infoObj = { bookId, value, status };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res);
              this.$store.dispatch('initBooksList', { page: this.page, pageSize: this.pageSize });
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
    changeBookPosition(row) {
      console.log(row);
      var bookId = row.bookId;
      var status = 3;
      this.$prompt("请输入位置", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.position,
      })
        .then(({ value }) => {
          // 修改的信息
          var infoObj = { bookId, value, status };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res);
              if (res.status == 0) {
                this.$message({
                  type: "error",
                  message: res.msg,
                });
              } else {
                this.$message({
                  type: "success",
                  message: "你修改的位置是: " + value,
                });
              }
              this.$store.dispatch('initBooksList', { page: this.page, pageSize: this.pageSize });
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
    changeCurrentAmount(row){
        console.log(row);
      var bookId = row.bookId;
      var status = 4;
      this.$prompt("请输入库存", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.amount,
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "你修改当前库存是: " + value,
          });
          let difference = value - row.amount
          // 修改的信息
          var infoObj = { bookId, value, status, difference };
          changeBookInfo(qs.stringify(infoObj)).then(
            (res) => {
              console.log(res);
              this.$store.dispatch('initBooksList', { page: this.page, pageSize: this.pageSize });
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
      console.log(row);
      var bookId = row.bookId;
      var status = 5;
      this.$prompt("请输入出版社", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.press,
      })
          .then(({ value }) => {
            this.$message({
              type: "success",
              message: "你修改的出版社是: " + value,
            });
            // 修改的信息
            var infoObj = { bookId, value, status };
            changeBookInfo(qs.stringify(infoObj)).then(
                (res) => {
                  console.log(res);
                  this.$store.dispatch('initBooksList', { page: this.page, pageSize: this.pageSize });
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
    changeISBN(row) {
      console.log(row);
      var bookId = row.bookId;
      var status = 6;
      this.$prompt("请输入ISBN", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.isbn,
      })
          .then(({ value }) => {
            this.$message({
              type: "success",
              message: "你修改的ISBN是: " + value,
            });
            // 修改的信息
            var infoObj = { bookId, value, status };
            changeBookInfo(qs.stringify(infoObj)).then(
                (res) => {
                  console.log(res);
                  this.$store.dispatch('initBooksList', { page: this.page, pageSize: this.pageSize });
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
    changeBookStatus(row) {
      console.log("修改状态:", row);
      var bookId = row.bookId;

      let value = row.status; // 1: 上线，0: 未上线
      let status = 7; // 1: 上线，0: 未上线
      var infoObj = { bookId, value, status};

      // 发送请求修改状态
      changeBookInfo(qs.stringify(infoObj))
          .then((res) => {
            console.log(res);
            if (res.status == 200 && res.error_code == 1) {
              this.$message({
                type: "success",
                message: "状态更新成功",
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg || "状态更新失败",
              });
            }
            // 刷新图书列表
            this.$store.dispatch('initBooksList', { page: this.page, pageSize: this.pageSize });
          })
          .catch((err) => {
            console.log(err.message);
            this.$message({
              type: "error",
              message: "请求失败：" + err.message,
            });
          });
    },
    delBook(row){
      console.log(row);
      let bookId = row.bookId;
      delBook(qs.stringify({bookId})).then(res=>{
        console.log(res);
        if(res.status == 200 && res.error_code == 1){
          this.$message({
            type: "success",
            message: res.msg,
          });
          this.$store.dispatch('initBooksList', { page: this.page, pageSize: this.pageSize });
          this.$store.dispatch("initReserveList");
        }else{
          this.$message({
            type: "error",
            message: res.msg || "删除失败，请重试",
          });
        }

    },err=>{
      console.log(err.message);
    })

    }
  },
  computed: {
    ...mapState({
      booksList(state) {
        return state.Books.booksList;
      },
      readerId(state) {
        return state.User.readerInfo.readerId;
      },
      isAdmin(state) {
        return state.User.isAdmin;
      },
      currentPage(state) {
        return state.Books.currentPage;
      },
      pageSize(state) {
        return state.Books.pageSize;
      },
      total(state) {
        return state.Books.total;
      }
    }),
  },
  mounted() {
    this.$store.dispatch('initBooksList', { page: this.page, pageSize: this.pageSize });
    console.log(this.searchBooks);
  },
};
</script>

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