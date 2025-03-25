<template>
  <el-pagination
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
  ></el-pagination>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.$emit('update:currentPage', page);
    },
    handleSizeChange(size) {
      this.$emit('update:pageSize', size);
    }
  }
};
</script>
