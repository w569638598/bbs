<template>
  <v-card class="threeBenefitPage mt-0">
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
        <v-btn @click="addEvent" color="primary">
          新增<v-icon right>fa fa-plus</v-icon>
        </v-btn>
        <v-btn @click="delBatchEvent" color="error">
          <v-icon left>fa mdi-trash-can-outline</v-icon>删除
        </v-btn>
      </div>
    </div>

    <v-data-table
      style="padding: 15px"
      :headers="headers"
      :items="desserts"
      :server-items-length="total"
      :options.sync="options"
      @pagination="pagination"
      :loading="loading"
      class="elevation-1"
      show-select
      @item-selected="selectItem"
      @toggle-select-all="selectAll"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="eidtEvent(item)"> mdi-pencil </v-icon
        >&nbsp;
        <v-icon small @click="del(item)"> mdi-delete </v-icon>
      </template>

      <template v-slot:[`item.createBy`]="{ item }">
        {{ item.createUser ? item.createUser.realname : "" }}
      </template>
      <template v-slot:[`item.sysOrgCode`]="{ item }">
        {{ item.sysDepart ? item.sysDepart.departName : "" }}
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialogState"
      max-width="80%"
      ref="dialog"
      content-class="threeBenefitDialog"
      :fullscreen="fullscreen"
    >
      <v-toolbar
        style="
          z-index: 9999999999999;
          padding-top: 20px;
          height: 80px !important;
          overflow: hidden;
          position: fixed;
          top: 0;
        "
      >
        <div class="dialogBtnBox">
          <button class="cancel" @click="pageInit">关闭</button>
          <button class="save" :disabled="saveButtonDisabled" @click="save">
            保存
          </button>
        </div>
      </v-toolbar>
      <component
        ref="details"
        :is="threeModule"
        :form="form"
        :eventType="eventType"
        @close="dialogClose"
      ></component>
    </v-dialog>
    <v-dialog v-model="delDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> 提示 </v-card-title>
        <v-card-text>确定删除所选数据？</v-card-text>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="delSure"> 确定 </v-btn>
          <v-btn color="error" text @click="delDialog = false"> 取消 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import threeModule from "./threeModule.vue";
import { del, getlist, deleteBatch } from "@/api/benefit";
import { jsonApi, isAdmin } from "@/api/manage";

export default {
  data() {
    return {
      params: {
        realname: "",
        depart_name: "",
        create_time: "",
      },
      saveButtonDisabled: false,
      dialogState: false,
      delDialog: false,
      form: {},
      fullscreen: true,
      headers: [
        // { text: "#", value: "rowIndex", sortable: false },
        { text: "课题名称", value: "title", sortable: false },
        { text: "创建人", value: "createBy", width: 140, sortable: false },
        { text: "创建部门", value: "sysOrgCode", width: 150, sortable: false },
        { text: "创建时间", value: "createTime", width: 180, sortable: false },
        { text: "操作", value: "actions", width: 90, sortable: false },
      ],
      desserts: [],
      options: {
        itemsPerPage: 10,
        page: 1,
      },
      loading: false,
      total: 0,
      dialogTitle: "新增",
      threeModule,
      eventType: "",
      user: {},
      isAdmin: null,
      delList: [],
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("pro__Login_Userinfo")).value;
    this.form["createBy"] = this.user.username;
    isAdmin().then((res) => {
      this.isAdmin = res.result;
      this.getlist();
    });
  },
  mounted() {
    this.pageInit();
  },

  watch: {
    dialogState(a) {
      if (!a) {
        this.pageInit();
      }
    },
  },
  components: {
    threeModule,
  },
  methods: {
    search() {
      this.options.page = 1;
      this.getlist();
    },
    dialogClose() {
      this.pageInit();
    },
    save() {
      this.saveButtonDisabled = true;
      if (this.eventType == "add") {
        this.$refs.details.add((res) => {
          this.pageInit();
        });
      } else {
        this.$refs.details.edit((res) => {
          this.pageInit();
        });
      }
    },
    getlist() {
      if (this.isAdmin === null) return;
      let params = {
        pageNo: this.options.page,
        pageSize: this.options.itemsPerPage,
        deptNameLike: this.params.depart_name,
        createByLike: this.params.realname,
        column: "createTime",
        order: "desc",
        createTimeEq: this.params.create_time,
      };
      if (this.isAdmin === false) {
        params.createBy = JSON.parse(
          localStorage.getItem("pro__Login_Userinfo")
        ).value.username;
      } else {
        delete params.createBy;
      }
      getlist(params).then((res) => {
        if (res.success) {
          res.result.records.forEach((e) => {
            e.createTime = e.createTime ? e.createTime.substring(0, 10) : "";
          });
          this.desserts = res.result.records;
          this.total = res.result.total;
        } else {
          this.desserts = [];
          this.total = 0;
          this.$message.error(res.message);
        }
      });
      // jsonApi(params).then((res) => {
      //   if (res.ok && res["[]"] && res["[]"].length > 0) {
      //     let data = res["[]"].map((item) => {
      //       let data = {
      //         ...item.Sys_depart,
      //         ...item.Sys_user,
      //         ...item.Ys_lean_underlying_logic,
      //         ysLeanUnderlyingLogicAccurateList: item['Ys_lean_underlying_logic_accurate[]'] || [],
      //         ysLeanUnderlyingLogicProcessList: item['Ys_lean_underlying_logic_process[]'] || []
      //       };
      //       data.createTime = data.create_time
      //         ? data.create_time.slice(0, 10)
      //         : "";
      //       return data;
      //     });
      //       console.log('---',data[data.length - 1]);
      //     this.desserts = data;
      //     this.total = res.total;
      //   }else{
      //     this.desserts = [];
      //     this.total = 0;
      //   }
      // });
    },
    addEvent() {
      this.saveButtonDisabled = false;
      this.eventType = "add";
      this.dialogTitle = "新增";
      this.dialogState = true;
      this.form = { ysLeanUnderlyingLogicProcessList: [] };
      this.threeModule = threeModule;
    },
    eidtEvent(rowItem) {
      this.saveButtonDisabled = false;
      this.eventType = "edit";
      this.dialogTitle = "编辑";
      this.dialogState = true;
      this.form = rowItem;
      this.threeModule = threeModule;
    },
    pageInit() {
      this.dialogState = false;
      this.delDialog = false;
      this.form = {
        createBy: this.user.username,
        ysLeanUnderlyingLogicProcessList: [
          {
            orderNo: 0,
            content: "",
          },
        ],
        ysLeanUnderlyingLogicAccurateList: [{ orderNo: 1 }, { orderNo: 2 }],
      };
      this.threeModule = "";
      this.delId = "";
      this.getlist();
    },
    selectItem(a) {
      if (a.value) {
        this.delList.push(a.item.id);
      } else {
        this.delList.splice(this.delList.indexOf(a.item.id), 1);
      }
    },
    delSure() {
      if (this.dleType == "single") {
        del({ id: this.delId }).then((res) => {
          if (res.success) {
            this.$message.success("删除成功");
          } else {
            this.$message.warning(res.message);
          }
          this.pageInit();
        });
      } else {
        const delArr = Array.from(new Set(this.delList)).join(",");
        deleteBatch({ ids: delArr }).then((res) => {
          if (res.success) {
            this.$message.success("删除成功");
          } else {
            this.$message.warning(res.message);
          }
          this.pageInit();
        });
      }
    },
    delBatchEvent() {
      if (!this.delList.length) {
        this.$message.warning("请选择需要删除的数据");
        return;
      }
      this.dleType = "batch";
      this.delDialog = true;
    },
    selectAll(a) {
      if (a.value) this.delList = a.items.map((e) => e.id);
      else this.delList = [];
    },
    pagination() {
      if (this.options.itemsPerPage === -1)
        this.options.itemsPerPage = 1000000000;
      this.getlist();
    },
    del(e) {
      this.dleType = "single";
      this.delDialog = true;
      this.delId = e.id;
    },
  },
};
</script>
<style lang="less">
.threeBenefitDialog {
  .v-toolbar__content,
  .v-toolbar__extension {
    display: block;
  }
}
.threeBenefitPage {
  td,
  th {
    font-weight: normal !important;
    color: rgba(0, 0, 1) !important;
    font-size: 16px !important;
  }
}
</style>

<style lang='less' scoped>
.searchBox {
  width: 90%;
  margin: 0 auto 20px !important;
}
.dialogBtnBox {
  position: absolute;
  right: 30px;
  button {
    border-radius: 5px;
    width: 90px;
    height: 44px;
    font-size: 16px;
  }
  .save {
    background: #437ee2;
    color: white;
  }
  .cancel {
    margin-right: 20px;
    background: #ffffff;
    border: 2px solid #cccccc;
  }
}
.v-card__actions {
  display: flex;
  justify-content: space-around;
}
.v-sheet.v-toolbar:not(.v-sheet--outlined) {
  box-shadow: none;
  height: 109px !important;
  padding-top: 43px;
  padding-bottom: 22px;
}
</style>