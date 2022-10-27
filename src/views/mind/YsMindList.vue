<template>
  <v-card class="lmind-table mt-0">
    <div class="searchBox">
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field v-model="params.realname" label="创建人"></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="params.depart_name"
            label="创建部门"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
         <v-menu
            v-model="params.start_menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            content-class="selectmenu"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="params.create_time"
                label="日期"
                clearable
                readonly
                v-bind="attrs"
                v-on="on"
              >
                <v-icon slot="append">mdi-calendar</v-icon>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="params.create_time"
              locale="zh-cn"
              no-title
              scrollable
              @input="params.start_menu = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn
            depressed
            color="primary"
            @click="search"
            style="margin-top: 12px"
          >
            查询<v-icon right dark> mdi-magnify </v-icon>
          </v-btn>
          
        </v-col>
      </v-row>
      <div class="btnBox">
        <v-btn @click="handleAdd" color="primary">
            新增<v-icon right>fa fa-plus</v-icon>
          </v-btn>
      </div>
    </div>

    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="dataSource"
      item-key="id"
      :options.sync="options"
      :server-items-length="totalDesserts"
      :loading="loading"
      show-select
      @pagination="pagination"
    >
      <template v-slot:[`item.rowIndex`]="{ index }">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="handleEditMinder(item)">
          编辑
        </v-icon>
        <v-icon small @click="deleteItem(item)"> 删除 </v-icon>
      </template>
    </v-data-table>
    <minde-editor
      ref="minderEditor"
      :key="key"
      :minderData="minderData"
      :id="currentData.id"
      @ok="loadData"
    ></minde-editor>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> 确定删除吗? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" small text @click="handleDel">
            确认
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" small text @click="dialog = false">
            取消
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { VDataTable } from "vuetify/lib";
import { getAction, deleteAction, jsonApi, isAdmin } from "@/api/manage";
import MindeEditor from "./modules/MindeEditor";
export default {
  name: "YsMindList",
  components: {
    VDataTable,
    MindeEditor,
  },
  data() {
    return {
      params: {
        realname: "",
        depart_name: "",
        create_time: ""
      },
      calories: "",
      dataSource: [],
      totalDesserts: 0,
      options: {
        itemsPerPage: 10,
        page: 1,
      },
      url: {
        list: "/mind/ysMind/list",
        delete: "/mind/ysMind/delete",
        deleteBatch: "/mind/ysMind/deleteBatch",
        exportXlsUrl: "/mind/ysMind/exportXls",
        importExcelUrl: "mind/ysMind/importExcel",
        edit: "/mind/ysMind/edit",
        add: "/mind/ysMind/add",
        queryById: "/mind/ysMind/queryById",
      },
      loading: true,
      minderData: {},
      currentData: {},
      key: "1",
      dialog: false,
      isAdmin: null,
    };
  },
  computed: {
    headers() {
      return [
        { text: "#", value: "rowIndex", sortable: false },
        { text: "LMind名称", value: "name", sortable: false },
        { text: "创建人", value: "realname", sortable: false },
        { text: "创建部门", value: "depart_name", sortable: false },
        { text: "创建时间", value: "createTime", sortable: false },
        // { text: "备注", value: "remarks", sortable: false },
        { text: "操作", value: "actions", width: 120, sortable: false },
      ];
    },
  },
  created() {
    isAdmin().then((res) => {
      this.isAdmin = res.result;
      this.loadData();
    });
  },
  methods: {
      search(){
        this.options.page = 1
        this.loadData()
      },
    loadData() {
      if (this.isAdmin === null) return;
      this.loading = true;
      let params = {
        "[]": {
          count: this.options.itemsPerPage,
          page: this.options.page - 1,
          query: 2,
          join: "&/Sys_user/username@,&/Sys_depart/org_code@",
          Ys_mind: {
            "@order": "create_time-",
            "is_new|{}": "=1,=null",
          },
          Sys_user: {
            "@column": "realname,org_code",
            "username@": "/Ys_mind/create_by",
          },
          Sys_depart: {
            "@column": "depart_name",
            "org_code@": "/Sys_user/org_code",
          },
        },
        "total@": "/[]/total",
      };
      if (this.params.realname) {
        params["[]"].Sys_user["realname$"] = `%${this.params.realname}%`;
      } else {
        delete params["[]"].Sys_user["realname$"];
      }

      if (this.params.depart_name) {
        params["[]"].Sys_depart[
          "depart_name$"
        ] = `%${this.params.depart_name}%`;
      } else {
        delete params["[]"].Sys_depart["depart_name$"];
      }
      if (this.params.create_time) {
        params["[]"].Ys_mind[
          "create_time$"
        ] = `%${this.params.create_time}%`;
      } else {
        delete params["[]"].Sys_depart["create_time$"];
      }
      if (!this.isAdmin) {
        params["[]"].Ys_mind["create_by"] = JSON.parse(
          localStorage.getItem("pro__Login_Userinfo")
        ).value.username;
      }
      jsonApi(params).then((res) => {
        console.log(res)
        if (res.ok && res['[]'] && res['[]'].length > 0) {
          let data = res['[]'].map((item) => {
            let data = {
              ...item.Sys_depart,
              ...item.Sys_user,
              ...item.Ys_mind
            }
            data.createTime = data.create_time
              ? data.create_time.slice(0, 10)
              : "";
              console.log(data)
            return  data
          });
          this.dataSource = data;
          this.totalDesserts = res.total;
        } else {
          this.dataSource = [];
          this.totalDesserts = 0;
          // this.$message.error(res.msg);
        }
        this.loading = false;
      });
    },
    pagination() {
      this.loadData();
    },
    handleEditMinder(data) {
      this.key = new Date().getTime();
      this.$nextTick(() => {
        this.minderData = data.minddata ? JSON.parse(data.minddata) : {};
        this.currentData = data;
        this.$refs.minderEditor.showMind();
      });
    },
    handleAdd() {
      this.key = new Date().getTime();
      this.$nextTick(() => {
        this.minderData = {};
        this.currentData = {};
        this.$refs.minderEditor.showMind();
      });
    },
    deleteItem(data) {
      this.currentData = data;
      this.dialog = data;
    },
    handleDel() {
      deleteAction(this.url.delete, { id: this.currentData.id }).then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.loadData();
        } else {
          this.$message.warning(res.message);
        }
        this.dialog = false;
      });
    },
  },
};
</script>
<style>
.lmind-table
  .v-data-table
  > .lmind-table
  .v-data-table__wrapper
  > table
  > tbody
  > tr
  > th,
.lmind-table .v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.lmind-table .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  font-weight: 600;
  font-size: 1rem;
}
.lmind-table .v-data-table td {
  font-weight: 500;
}
</style>
<style lang="sass" scoped>
.searchBox
  width: 90%
  margin: 0 auto 20px !important
</style>
