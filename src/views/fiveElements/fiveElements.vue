<template>
  <v-card class="lmind-table mt-0 fiveElements">
    <div class="searchBox">
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field v-model="params.index_name" label="指标名称">
          </v-text-field>
        </v-col>
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
        <v-btn depressed color="primary" @click="add">
          新建<v-icon right dark> mdi-plus-thick </v-icon>
        </v-btn>
      </div>
    </div>

    <v-card class="lmind-table mt-0">
      <v-data-table
        :headers="headers"
        :items="listdata"
        :server-items-length="total"
        :options="options"
        @pagination="pagination"
        :loading="loading"
        class="elevation-1"
        :disable-sort="true"
        :footer-props="{ itemsPerPageOptions: [10, 30, 50, 200] }"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            color="blue lighten-2"
            @click="details(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon small color="red lighten-2" @click="del(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      content-class="dialogTag"
      class="dialogTag"
      v-model="dialogState"
      ref="dialog"
      fullscreen
    >
      <v-card class="dialogCard">
        <v-card-title
          class="text-h5 grey lighten-2"
          style="font-size: 22px !important"
        >
          五要素看板
        </v-card-title>
        <div class="dialogMain">
          <p class="title">目标-实际</p>
          <div style="border: solid 1px #ccc">
            <v-form v-model="valid">
              <v-container>
                <v-row class="topValBox">
                  <v-col cols="12" md="3" v-for="(e, i) of form" :key="i">
                    <span slot="prepend" style="width: 66px">{{
                      e.label
                    }}</span>
                    <input class="topInput" type="text" v-model="e.val" />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
            <div style="border-top: 1px solid #ccc">
              <!-- 工具栏 -->
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
              />
              <!-- 编辑器 -->
              <Editor
                style="height: 260px; overflow-y: hidden"
                :defaultConfig="editorConfig"
                v-model="rich_text"
                @onCreated="onCreated"
              />
            </div>
          </div>
          <p class="title">问题-对策-落实</p>
          <v-data-table
            :headers="detailsHeaders"
            :items="detailsItems"
            hide-default-footer
            class="elevation-1"
            :disable-sort="true"
          >
            <template v-slot:item.problem="props">
              <v-textarea v-model="props.item.problem"></v-textarea>
            </template>
            <template v-slot:item.customer_principal="props">
              <v-textarea v-model="props.item.customer_principal"></v-textarea>
            </template>
            <template v-slot:item.plan_complete_date="props">
              <v-textarea
                v-model="props.item.plan_complete_date"
                width="150"
              ></v-textarea>
            </template>
            <template v-slot:item.plan_complete_date="props">
              <v-menu
                v-model="props.item.menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="props.item.plan_complete_date"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker
                  no-title
                  locale="zh"
                  v-model="props.item.plan_complete_date"
                  @input="props.item.menu1 = false"
                ></v-date-picker>
              </v-menu>
            </template>
            <template v-slot:item.actual_complete_date="props">
              <v-menu
                v-model="props.item.menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="props.item.actual_complete_date"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker
                  no-title
                  locale="zh"
                  v-model="props.item.actual_complete_date"
                  @input="props.item.menu2 = false"
                ></v-date-picker>
              </v-menu>
            </template>
            <template v-slot:item.countermeasure="props">
              <v-textarea v-model="props.item.countermeasure"></v-textarea>
            </template>
            <template v-slot:item.anticipate_result="props">
              <v-textarea v-model="props.item.anticipate_result"></v-textarea>
            </template>
            <template v-slot:item.actual_result="props">
              <v-textarea v-model="props.item.actual_result"></v-textarea>
            </template>
          </v-data-table>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="grey lighten-2" @click="init"> 关闭 </v-btn>
            <v-btn color="primary" @click="submit"> 确定 </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { jsonApi, add, edit, del, isAdmin } from "@/api/fiveElements";
const detailsItems = [{}, {}, {}];
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";

export default {
  components: { Editor, Toolbar },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  data() {
    return {
      editor: null,
      toolbarConfig: {},
      editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {},
      },
      loading: false,
      valid: false,
      options: {
        page: 1,
        itemsPerPage: 10,
      },
      rich_text: "",
      form: [
        {
          key: "index_name",
          label: "指标名称",
          val: "",
          rules: [(value) => !!value || "请输入指标名称"],
        },
        {
          key: "initial_value",
          label: "期初值",
          val: "",
          rules: [],
        },
        {
          key: "target_value",
          label: "目标值",
          val: "",
          rules: [],
        },
        {
          key: "current_value",
          label: "当前值",
          val: "",
          rules: [],
        },
      ],
      params: {
        index_name: "",
        depart_name: "",
        realname: "",
      },
      headers: [
        {
          text: "指标名称",
          align: "center",
          value: "index_name",
        },
        { text: "创建人", value: "realname", align: "center" },
        { text: "创建部门", value: "depart_name", align: "center" },
        { text: "时间", value: "create_time", align: "center" },
        { text: "操作", value: "actions", align: "center" },
      ],
      detailsHeaders: [
        { text: "问题", value: "problem", align: "center" },
        {
          text: "担当人",
          value: "customer_principal",
          width: 150,
          align: "center",
        },
        {
          text: "计划完成时间",
          value: "plan_complete_date",
          width: 130,
          align: "center",
        },
        {
          text: "实际完成时间",
          width: 130,
          align: "center",
          value: "actual_complete_date",
        },
        { text: "对策", value: "countermeasure", align: "center" },
        { text: "预期效果", value: "anticipate_result", align: "center" },
        { text: "实际效果", value: "actual_result", align: "center" },
      ],
      detailsItems: detailsItems,
      listdata: [],
      total: 0,
      dialogState: false,
      eventType: null,
      currentItem: "",
      isAdmin: null,
      submitState: true,
    };
  },
  created() {
    try {
      //   axios({
      //     url: "/sys/user/isManager",
      //     method: "get",
      //   }).then((res) => {
      //     console.log("axios");
      //     this.isAdmin = res.result;
      //   });
      //   console.log("1111111111111111created");

      isAdmin().then((res) => {
        this.isAdmin = res.result;
        this.getData()
      });
    } catch (e) {
      console.log(e);
    }
  },
  mounted() {
    this.editorConfig.MENU_CONF["uploadImage"] = {
      base64LimitSize: 500000000 * 1024, // 5kb
    };
    this.toolbarConfig["excludeKeys"] = ["fullScreen"];
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor);
    },
    init() {
      this.detailsItems = [{}, {}, {}];
      this.submitState = true;
      this.rich_text = "";
      this.form = [
        {
          key: "index_name",
          label: "指标名称",
          val: "",
          rules: [],
        },
        {
          key: "initial_value",
          label: "期初值",
          val: "",
          rules: [],
        },
        {
          key: "target_value",
          label: "目标值",
          val: "",
          rules: [],
        },
        {
          key: "current_value",
          label: "当前值",
          val: "",
          rules: [],
        },
      ];
      this.dialogState = false;
      this.getData();
    },
    del(item) {
      jsonApi({
        Onl_cgform_head: {
          table_name: "ys_five_elements_kanban",
          "@column": "id",
        },
      }).then((res) => {
        del(res.Onl_cgform_head.id, {
          id: item.id,
        }).then((res) => {
          if (res.success) {
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.message);
          }
          this.init();
        });
      });
    },
    submit() {
      if (!this.submitState) return;
      let params = {};
      this.form.forEach((e) => {
        params[e.key] = e.val;
      });
      if (!params.index_name) {
        this.$message.error("请填写指标名称");
        return;
      }
      params["rich_text"] = this.rich_text == null ? "" : this.rich_text;
      params["ys_five_elements_kanban_detail"] = this.detailsItems;
      if (this.eventType === "add") {
        this.submitState = false;
        add(params).then(
          (res) => {
            if(res.success){
              this.$message.success("添加成功");
            }else{
              this.$message.error(res.message);
            }
            this.init();
          },
          (rej) => {
            console.log(rej);
            this.init();
          }
        );
      } else if (this.eventType === "edit") {
        params.id = this.currentItem.id;
        this.submitState = false;
        edit(params).then(
          (res) => {
            if(res.success){
              this.$message.success("修改成功");
            }else{
              this.$message.error(res.message);
            }
            this.init();
          },
          (rej) => {
            console.log(rej, "rej");
            this.init();
          }
        );
      }
    },
    add() {
      this.eventType = "add";
      this.dialogState = true;
    },
    details(item) {
      this.eventType = "edit";
      this.currentItem = item;
      this.dialogState = true;
      this.rich_text = item.rich_text;
      this.form.forEach((e) => {
        e.val = item[e.key];
      });
      this.detailsItems = item.Ys_five_elements_kanban_detail || detailsItems;
    },
    pagination(a) {
      console.log('pagination')
      this.options.itemsPerPage = a.itemsPerPage == -1 ? 200 : a.itemsPerPage;
      this.options.page = a.page;
      this.getData();
    },
    search() {
      this.options.page = 1;
      this.getData();
    },
    getData() {
      if(this.isAdmin === null) return;
      this.loading = true;
      let params = {
        "[]": {
          "join":"&/Sys_user/username@,&/Sys_depart/org_code@",
          count: this.options.itemsPerPage,
          page: this.options.page - 1,
          query: 2,
          Ys_five_elements_kanban: {
            "@order": "create_time-",
            deleted__: 0,
          },
          "Ys_five_elements_kanban_detail[]": {
            count: 100,
            deleted__: 0,
            Ys_five_elements_kanban_detail: {
              "ys_five_elements_kanban_id@": "[]/Ys_five_elements_kanban/id",
            },
          },
          Sys_user: {
            "@column": "realname,org_code",
            "username@": "/Ys_five_elements_kanban/create_by",
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

      if (this.params.index_name) {
        params["[]"].Ys_five_elements_kanban[
          "index_name$"
        ] = `%${this.params.index_name}%`;
      } else {
        delete params["[]"].Ys_five_elements_kanban["index_name$"];
      }

      if (this.params.depart_name) {
        params["[]"].Sys_depart[
          "depart_name$"
        ] = `%${this.params.depart_name}%`;
      } else {
        delete params["[]"].Sys_depart["depart_name$"];
      }
      if (!this.isAdmin) {
        params["[]"].Ys_five_elements_kanban["create_by"] = JSON.parse(
          localStorage.getItem("pro__Login_Userinfo")
        ).value.username;
      }
      jsonApi(params).then((res) => {
        if (!res.ok) {
          this.listdata = [];
          this.total = 0;
          this.loading = false;
          return;
        }
        if (res["[]"] && res["[]"].length) {
          let arr = [];
          arr = res["[]"].map((res) => {
            res.Ys_five_elements_kanban.create_time = res
              .Ys_five_elements_kanban.create_time
              ? res.Ys_five_elements_kanban.create_time.slice(0, 10)
              : "";
            if (res["Ys_five_elements_kanban_detail[]"]) {
              res["Ys_five_elements_kanban_detail[]"].forEach((e) => {
                e.plan_complete_date = e.plan_complete_date
                  ? e.plan_complete_date.slice(0, 10)
                  : "";
                e.actual_complete_date = e.actual_complete_date
                  ? e.actual_complete_date.slice(0, 10)
                  : "";
              });
            }
            return {
              ...res.Ys_five_elements_kanban,
              ...res.Sys_depart,
              ...res.Sys_user,
              Ys_five_elements_kanban_detail:
                res["Ys_five_elements_kanban_detail[]"],
            };
          });
          this.listdata = arr;
          this.total = res.total;
        } else {
          this.listdata = [];
          this.total = 0;
        }
        this.loading = false;
      });
    },
  },
};

// _t: 1630485443
// order: desc
</script>
<style lang="sass">
.w-e-select-list
  ul
    padding-left: 0
.dialogTag
.fiveElements
  .v-btn.v-size--default
    font-size: 1.2rem !important
  .v-label
    font-size: 20px
  td,th
    font-weight: normal !important
    color: rgba(0,0,1) !important
    font-size: 16px !important
.dialogTag
  .v-text-field
    padding-top: 0 !important
  th
    font-size: 14px !important
    color: rgba(0,0,0,1) !important
  th,td
    border: solid 1px #ccc
    font-weight: normal !important
  .elevation-1
    box-shadow: none !important
  .container
    width: 100% !important
    max-width: 100% !important
  .v-card__title
    padding: 20px 0 !important
  .v-input__slot
    margin-bottom: 0
    &::before
      display: none
  .v-text-field__details
    display: none
  .v-text-field__slot
    textarea
      height: 80px
  .v-label
    font-size: 18px
</style>

<style lang='sass' scoped>
.editor
  height: 16rem
  overflow: hidden

.topValBox
  height: 52px
  &>*
    padding: 0
    &>*
      line-height: 52px
      display: block
      float: left
    span
      padding-left: 12px
      padding-right: 8px
      width: 80px !important
      border-right: solid 1px #ccc
      border-left: solid 1px #ccc
    input
      padding-left: 8px
      width: calc(100% - 88px)
.topInput
  outline: none
.searchBox
  width: 90%
  margin: 0 auto 20px !important

.v-card .v-divider
  border-color: #d2d2d2

.dialogCard
  p.title
    font-size: 20px !important
    font-weight: bold
    margin-top: 20px
    .v-card__title
      padding: 16px 0 !important
      font-size: 18px !important
.dialogMain
  width: 98%
  margin: 0 auto
  margin-top: 20px
  .v-label
    font-size: 20px !important
    .table__wrapper > table > thead > tr > th
      FONT-WEIGHT: 600 !important
</style>
