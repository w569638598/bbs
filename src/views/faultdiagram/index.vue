<template>
  <div class="x6Page">
    <v-card>
      <v-btn color="teal" class="ma-2 white--text" @click="addEvent" small>
        新增
        <v-icon right dark> mdi-plus </v-icon>
      </v-btn>
      <v-btn small color="error" @click="delSome"
        >删除<v-icon right dark> mdi-delete </v-icon></v-btn
      >
      <v-data-table
        class="elevation-1"
        :headers="headers"
        :items="dataSource"
        :options.sync="options"
        :server-items-length="totalDesserts"
        :loading="loading"
        show-select
        @pagination="pagination"
        @item-selected="selectItem"
        @toggle-select-all="selectAll"
      >
        <template v-slot:[`item.rowIndex`]="{ index }">
          <span>{{ index + 1 }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="handleEdit(item)"> 编辑 </v-icon>
          <v-icon small @click="deleteItem(item.id)"> 删除 </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      class="x6Dialog"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>故障树</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!-- <v-btn dark text @click="save"> 保存 </v-btn> -->
          </v-toolbar-items>
        </v-toolbar>
        <component
          :is="editor"
          ref="x6"
          :params="componentParams"
          @save="save"
        ></component>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import editor from "./editor.vue";
import { getList, add, del, put, delSome } from "@/api/faultdiagram";
import tabMixin from "@/mixins/table";
export default {
  mixins: [tabMixin],
  data() {
    return {
      dialog: false,
      editor: editor,
      headers: [
        { text: "#", value: "rowIndex", sortable: false },
        { text: "故障树名称", value: "name", sortable: false },
        { text: "备注", value: "remarks", sortable: false },
        { text: "操作", value: "actions", width: 120, sortable: false },
      ],
      options: {
        itemsPerPage: 10,
        page: 1,
      },
      dataSource: [],
      totalDesserts: null,
      loading: false,

      componentParams: {
        eventType: "",
      },
    };
  },
  components: {
    editor,
  },
  watch: {
    // 不知道啥情况，不重置一下好像组件不重新渲染，走缓存了。不是很懂。
    dialog(a, b) {
      this.editor = a ? editor : "";
    },
  },
  mounted() {},
  methods: {
    formatDate() {
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      const day = date.getDate();
      const h = date.getHours();
      const hours = h > 9 ? h : "0" + h;
      const m = date.getMinutes();
      const min = m > 9 ? m : "0" + m;
      const s = date.getSeconds();
      const sec = s > 9 ? s : "0" + s;
      return (
        year + "-" + month + "-" + day + " " + hours + ":" + min + ":" + sec
      );
    },
    // 编辑事件触发弹窗
    handleEdit(item) {
      if(!this.isMobile()) return;
      this.dialog = true;
      this.componentParams = { eventType: "edit", data: item };
    },
    // 批量删除
    delSome() {
      delSome({ ids: this.selected.join(",") }).then((res) => {
        if (res.success) {
          this.$message.success("删除成功");
        }
        this.getData();
      });
    },
    // 单个删除
    deleteItem(id) {
      del({ id }).then((res) => {
        if (res.success) {
          this.$message.success("删除成功");
        }
        this.getData();
      });
    },
    // 保存事件  编辑保存和新建保存
    save() {
      // 触发获取绑定可修改的数据
      this.$refs.x6.handleItem();
      // 触发导出获取节点数据函数
      this.$refs.x6.handleExport(async (state, data, item) => {
        this.dialog = state;
        let params;
        if (this.componentParams.eventType === "add") {
          params = {
            createBy: localStorage.getItem("pro__Login_Userinfo").username,
            createTime: this.formatDate(),
            minderdata: JSON.stringify({ ...data }),
            name: item.name,
            remarks: item.remarks,
            sysOrgCode: localStorage.getItem("pro__Login_Userinfo").orgCode,
          };
          await add(params).then((res) => {
            if (res.success) {
              this.$message.success("导出成功");
            }
          });
        } else {
          params = {
            id: this.componentParams.data.id,
            name: item.name,
            remarks: item.remarks,
            minderdata: JSON.stringify({ ...data }),
          };
          await put(params).then((res) => {
            if (res.success) {
              this.$message.success("修改成功");
            }
          });
        }
        this.getData();
      });
    },
    // 新建事件
    addEvent() {
      if(!this.isMobile()) return;
      this.dialog = true;
      this.componentParams = { eventType: "add" };
    },
    isMobile() {
      if (window.innerWidth < 1000) {
        this.$message.error("移动端暂不支持操作");
        return false;
      }
      return true
    },
    pagination() {
      this.getData();
    },
    getData() {
      this.loading = true;
      getList({
        pageNo: this.options.page,
        pageSize: this.options.itemsPerPage,
      }).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.totalDesserts = res.result.total;
        } else {
          this.$message.error(res.message);
        }
        this.loading = false;
      });
    },
  },
};
</script>
<style lang='sass'>
.layout .graph-main-container
  height: 100% !important
  width: 100% !important
</style>
