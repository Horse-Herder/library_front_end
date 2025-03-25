<template>
  <el-pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    @current-change="handleCurrentPageChange"
    @size-change="handlePageSizeChange"
    layout="total, sizes, prev, pager, next, jumper"
  />
</template>

<script>
export default {
  name: "CommonPagination",
  props: {
    total: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
  },
  methods: {
    handleCurrentPageChange(newPage) {
      this.$emit("update:currentPage", newPage);
    },
    handlePageSizeChange(newSize) {
      this.$emit("update:pageSize", newSize);
    },
  },
};
</script>