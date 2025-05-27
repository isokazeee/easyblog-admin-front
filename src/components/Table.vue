<script setup>
import { ref } from "vue";

const emit = defineEmits(["rowSelected", "rowClick"]);
const props = defineProps({
  dataSource: Object,
  showPagination: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object,
    default: {
      exHeight: 0,
      showIndex: false,
    },
  },
  columns: Array,
  fetch: Function,
  initFetch: {
    type: Boolean,
    default: true,
  },
});

const radioSelectRowIndex = ref(null);

const topHeight = 60 + 20 + 40 + 42;
const tableHeight = ref(
  props.options.tableHeight
    ? props.options.tableHeight
    : window.innerHeight - topHeight - props.options.exHeight
);

const dataTable = ref(null);

const handleRowClick = (row) => {
  emit("rowClick", row);
};

const handleSelectionChange = (row) => {
  emit("rowSelected", row);
};

const handlePageSizeChange = (size) => {
  props.dataSource.pageSize = size;
  props.dataSource.pageNo = 1;
  props.fetch();
};

const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  props.fetch();
};

const setCurrentRow = (rowKey, rowValue) => {
  let row = props.dataSource.list.find((item) => item[rowKey] == rowValue);
  dataTable.value.setCurrentRow(row);
};

// 暴露
defineExpose({
  setCurrentRow,
});

// init
const init = () => {
  if (props.initFetch && props.fetch) {
    props.fetch();
  }
};

init();
setTimeout(() => {
  console.log("dataInTable", props.dataSource.list);
}, 1000);
</script>

<template>
  <div>
    <el-table
      ref="dataTable"
      :data="dataSource.list || []"
      :height="tableHeight"
      :stripe="options.stripe"
      :border="options.border"
      header-row-class-name="table-header-row"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <!-- selection 选择框 -->
      <el-table-column
        v-if="options.selectType && options.selectType == 'checkbox'"
        type="selection"
        width="50"
        :align="center"
      />
      <!-- 序号 -->
      <el-table-column
        v-if="options.showIndex"
        label="index"
        type="index"
        width="60"
        :align="center"
      />
      <!-- 数据 -->
      <template v-for="(column, index) in columns">
        <template v-if="column.scopedSlots">
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :align="column.align || 'left'"
          >
            <template #default="scope">
              <slot :name="column.scopedSlots" :index="scope.$index" :row="scope.row"> </slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :align="column.align || 'left'"
            :fixed="column.fixed"
          />
        </template>
      </template>
    </el-table>

    <!--  分页 -->
    <div class="pagination" v-if="showPagination">
      <el-pagination
        v-if="dataSource.totalCount"
        background
        :total="dataSource.totalCount"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="dataSource.pageSize"
        :current-page.sync="dataSource.pageNo"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNoChange"
        style="text-align: right"
      />
    </div>
  </div>
</template>

<style scoped>
.pagination {
  padding-top: 10px;
}
.el-pagination {
  justify-content: right;
}

.el-table__body tr.current-row > td.el-table__cell {
  background-color: #e6f0f9;
}

.el-table__body tr:hover > td.el-table__cell {
  background-color: #e6f0f9 !important;
}
</style>
