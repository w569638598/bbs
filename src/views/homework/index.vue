<template>
  <v-card class="mt-0" style="padding:20px;" v-show="this.role">
    <h2 style="margin-bottom:10px;">作业发布</h2>
    <v-divider></v-divider>
    <v-row style="margin-top:10px;">
      <v-col cols="12" md="3">
        <v-text-field
          label="作业名称"
          clearable
          outlined
          dense
          v-model="search.title"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-menu
          v-model="search.menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
          content-class="selectmenu"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="search.date"
              label="发布时间"
              clearable
              outlined
              dense
              readonly
              v-bind="attrs"
              v-on="on"
            >
              <v-icon slot="append">mdi-calendar</v-icon>
            </v-text-field>
          </template>
          <v-date-picker
            v-model="search.date"
            locale="zh-cn"
            no-title
            scrollable
            @input="search.menu = false"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn
          color="primary"
          elevation="2"
          @click="searchData"
        >查询</v-btn>
        <v-btn
          color="primary"
          elevation="2"
          @click="add"
          v-if="role"
        >新增</v-btn>
        <v-btn
          color="primary"
          elevation="2"
          @click="updateStatus"
          v-if="role"
        >作业发布</v-btn>
        <v-btn
          v-show="false"
          color="primary"
          elevation="2"
          @click="test"
        >test</v-btn>
      </v-col>
    </v-row>
    <v-data-table
      v-model="selected"
      item-key="Ys_job.id"
      show-select
      :headers="headers"
      :items="articleList"
      :options.sync="options"
      hide-default-footer
      class="elevation-1 worktab"
    >
      <template v-slot:item.person = "{ item }">
        <v-tooltip bottom :disabled="item['Ys_job_person_view[]'].length <= 2" max-width="300">
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <v-badge
                :content="item['Ys_job_person_view[]'].length"
                left
                :value="item['Ys_job_person_view[]'].length > 2">
                <template v-for="(per, index) in item['Ys_job_person_view[]']" v-if="index < 2">
                  <span :key="index" style="padding:0 3px;">{{per.realname}}</span>
                </template>
              </v-badge>
            </span>
          </template>
          <span>
            <template v-for="(per, index) in item['Ys_job_person_view[]']">
              <span :key="index" style="padding:0 3px;">{{per.realname}}</span>
            </template>
          </span>
        </v-tooltip>
      </template>
      <template v-slot:item.fbstate = "{ item }">
        <template v-if="item.Ys_job.job_status > 0">
          <span style="color:#437EE2;">
            <v-icon :size="22" color="#437EE2">mdi-circle-medium</v-icon>
            已发布
          </span>
        </template>
        <template v-else>
          <span style="color:#ccc;">
            <v-icon :size="22" color="#ccc">mdi-circle-medium</v-icon>
            未发布
          </span>
        </template>
      </template>
      <template v-slot:item.actions = "{ item }">
        <v-icon @click="editItem(item)" color="#6EC06B">
          mdi-square-edit-outline
        </v-icon>
        <v-icon @click="deleteItem(item)" color="#F25B58">
          mdi-trash-can-outline
        </v-icon>
        <v-icon @click="downloadWork(item)" color="#1976d2"  v-if="item.Ys_job.job_status > 0">
          mdi-tray-arrow-down
        </v-icon>
      </template>
    </v-data-table>
    <v-pagination
      style="padding:20px 0 0;"
      v-model="options.current"
      :length="options.pages"
    ></v-pagination>
    <v-dialog
      v-model="dialog"
      persistent
      width="800"
    >
      <v-form>
        <v-container style="padding:0;">
          <v-card>
            <v-card-title style="background:#e0e0e0;padding:0;line-height:50px;">
              作业编辑
            </v-card-title>
            <v-card-text>
              <v-row style="margin-top:20px;">
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="作业名称"
                    clearable
                    outlined
                    dense
                    v-model="form.name"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-menu
                    v-model="form.menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    content-class="selectmenu"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.date"
                        label="最晚提交时间"
                        clearable
                        outlined
                        dense
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.date"
                      locale="zh-cn"
                      no-title
                      scrollable
                      @input="form.menu = false"
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="form.company"
                    :items="companys"
                    item-text="depart_name"
                    return-object
                    clearable
                    dense
                    outlined
                    label="选择单位"
                    @change="getDepartment"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-show="departments.length > 0"
                    v-model="form.department"
                    :items="departments"
                    item-text="departName"
                    return-object
                    clearable
                    dense
                    outlined
                    label="选择部门"
                    @change="getPerson"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="form.zyry"
                    :items="persons"
                    item-text="realname"
                    return-object
                    chips
                    clearable
                    dense
                    outlined
                    label="作业人员"
                    multiple
                  ></v-select>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <div style="text-align:right;margin-top:20px;">
                <v-btn
                  elevation="2"
                  @click="dialog=false"
                >取消</v-btn>
                <v-btn
                  color="primary"
                  elevation="2"
                  @click="save"
                >保存</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </v-form>
    </v-dialog>
    <v-dialog
      v-model="testdialog"
      scrollable
      max-width="300px"
    >
      <v-card>
        <v-card-title>
          <h3>选择部门</h3>
        </v-card-title>
        <v-treeview
          v-model="form.aaa"
          selectable
          style="background:#fff"
          :items="aaaitems"
        ></v-treeview>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import moment from 'moment'
import { getList, postAction, putAction, deleteAction } from '@/api/homework'
import LoginWelcome from '@/views/card/LoginWelcome'
export default {
  name: 'HomeWork',
  components: {
    LoginWelcome
  },
  data: () => {
    return {
      dialog: false,
      testdialog: false,
      aaaitems: [{"id":1,"name":"Applications :","children":[{"id":2,"name":"Calendar : app"},{"id":3,"name":"Chrome : app"},{"id":4,"name":"Webstorm : app"}]},{"id":15,"name":"Downloads :","children":[{"id":16,"name":"October : pdf"},{"id":17,"name":"November : pdf"},{"id":18,"name":"Tutorial : html"}]}],
      persons: [],
      companys: [],
      departments: [],
      search: { date: '', menu: false },
      form: { menu: false, zyry: [] },
      selected: [],
      headers: [
        { text: '作业编号', value: 'Ys_job.job_number', width: 85, sortable: false },
        { text: '作业名称', value: 'Ys_job.job_name', sortable: false },
        { text: '作业人员', value: 'person', sortable: false },
        { text: '最晚提交时间', value: 'Ys_job.lastTime', width: 100, sortable: false },
        { text: '作业发布时间', value: 'Ys_job.publishTime', width: 100, sortable: false },
        { text: '发布人', value: 'Sys_user:publisher.realname', width: 75, align: 'center', sortable: false },
        { text: '作业状态', value: 'fbstate', width: 85, align: 'center', sortable: false },
        // { text: '作业状态', value: 'Ys_job.job_status', sortable: false },
        { text: '修改人', value: 'Sys_user:modifier.realname', width: 75, align: 'center', sortable: false },
        { text: '修改时间', value: 'Ys_job.updateTime', width: 95, sortable: false },
        { text: '操作', value: 'actions', width: 85, sortable: false, cellClass: 'actions' }
      ],
      total: 0,
      options: {
        current: 1, // 当前页码，默认第一页
        size: 10, // 每页显示数量
        pages: 1
      },
      baseURL: '',
      articleList: [],
      isCreated: false,
      role: false
    }
  },
  watch: {
    'options.current': {
      handler(val, oldVal) {
        this.init()
      }
    }
  },
  created() {
    this.getCompany()
    this.baseURL = window._CONFIG['staticDomainURL'] + '/'
    this.init()
    this.isCreated = true
  },
  computed: {
  },
  methods: {
    moment,
    getCompany() {
      const postCompany = {"[]":{"count":200,"Sys_depart":{"del_flag":"0","@column":"id,depart_name,org_code","parent_id":""}}}
      getList(postCompany).then((res) => {
        if (res.code === 200) {
          this.companys = []
          const list = res['[]'] || []
          list.forEach((item) => {
            if ('id' in item.Sys_depart) this.companys.push(item.Sys_depart)
          })
        } else {
          this.$message.error('获取单位信息出错：' + res.msg)
        }
      })
    },
    getDepartment() {
      const param = {"function": {"getSysDepartListByOrgCode()": "getSysDepartListByOrgCode(" + encodeURIComponent(JSON.stringify({"orgCode":this.form.company.org_code,"isContainOrgCode":"0"})) + ")"}}
      getList(param).then((res) => {
        if (res.code === 200) {
          this.departments = []
          const list = res.function.getSysDepartListByOrgCode || []
          list.forEach((item) => {
            if ('id' in item) this.departments.push(item)
          })
          if (this.departments.length === 0) {
            this.form.department = this.form.company
            this.$set(this.form.department, 'orgCode', this.form.company.org_code)
            this.getPerson()
          }
        } else {
          this.$message.error('获取部门信息出错：' + res.msg)
        }
        this.persons = [...this.form.zyry]
      })
    },
    getPerson() {
      const postData = {"function": {"getUserListByOrgCode()": "getUserListByOrgCode(" + encodeURIComponent(JSON.stringify({"orgCode": this.form.department.orgCode,"isContainOrgCode":"1"})) + ")"}}
      getList(postData).then((res) => {
        if (res.code === 200) {
          this.persons = [...this.form.zyry]
          const list = res.function.getUserListByOrgCode || []
          list.forEach((item) => {
            if ('id' in item) this.persons.push(item)
          })
        } else {
          this.$message.error('获取员工信息出错：' + res.msg)
        }
      })
    },
    searchData() {
      this.options.current = 1
      this.init()
    },
    init() {
      const user_role = localStorage.getItem('user_zy_role')
      console.log(user_role)
      if (user_role.search(/(gw)/) === -1) {
        this.$message.error('您没有发布作业的权限！')
        return
      }
      this.role = true
      // this.role = true // 临时放开权限
      const param = {"[]":{"query":2,"count":"10","page":"0","Ys_job":{"deleted__":"0","@order":"publish_time-"},"Sys_user:create_by":{"username@":"/Ys_job/create_by","@column":"id,username,realname"},"Sys_user:publisher":{"username@":"/Ys_job/publisher","@column":"id,username,realname"},"Sys_user:modifier":{"username@":"/Ys_job/modifier","@column":"id,username,realname"},"Sys_dict_item:job_status":{"dict_id@":{"from":"Sys_dict","Sys_dict":{"@column":"id","dict_code":"job_status"}},"item_value@":"/Ys_job/job_status"},"Sys_depart": {"org_code@": "/Ys_job/group_company"},"Ys_job_person_view[]":{"count": "200","Ys_job_person_view":{"ys_job_id@":"[]/Ys_job/id"}}},"total@":"/[]/total","info@":"/[]/info"}
      param['[]'].count = this.options.size
      param['[]'].page = this.options.current - 1
      if (this.search.title && this.search.title.length > 0) this.$set(param['[]'].Ys_job, 'job_name$', '%' + this.search.title + '%')
      if (this.search.date && this.search.date.length === 10) this.$set(param['[]'].Ys_job, 'publish_time%', this.search.date + ' 00:00:00,' + this.search.date + ' 23:59:59')
      getList(param).then((response) => {
        if (response.code === 200) {
          this.options.current = response.info.page + 1
          this.total = response.info.total
          this.options.size = response.info.count
          this.options.pages = response.info.max + 1
          this.articleList = response['[]'] || []
          this.articleList.forEach((item) => {
            if (!item['Sys_user:publisher']) this.$set(item, 'Sys_user:publisher', {})
            if (!item['Sys_user:modifier']) this.$set(item, 'Sys_user:modifier', {})
            if (!item['Ys_job_person_view[]']) this.$set(item, 'Ys_job_person_view[]', [])
            item.Ys_job.creatTime = item.Ys_job.create_time.substr(0, 10)
            item.Ys_job.lastTime = item.Ys_job.latest_submit_time || ''
            item.Ys_job.lastTime = item.Ys_job.lastTime.substr(0, 10)
            item.Ys_job.publishTime = item.Ys_job.publish_time || ''
            item.Ys_job.publishTime = item.Ys_job.publishTime.substr(0, 10)
            item.Ys_job.updateTime = item.Ys_job.update_time || ''
            item.Ys_job.updateTime = item.Ys_job.updateTime.substr(0, 10)
          })
        } else {
          this.$message.error('获取作业列表出错：' + response.msg)
        }
      })
    },
    editItem(itemData) {
      this.form.id = itemData.Ys_job.id
      this.form.name = itemData.Ys_job.job_name
      this.form.date = (itemData.Ys_job.latest_submit_time || '').substr(0, 10)
      this.form.company = itemData.Sys_depart
      if (this.form.company) this.getDepartment()
      this.form.zyry = itemData['Ys_job_person_view[]'] || []
      this.persons = this.form.zyry
      this.form.job_status = itemData['Ys_job'].job_status
      this.dialog = true
    },
    deleteItem(itemData) {
      const subData = { 'Ys_job': { 'id': '' }, 'Ys_job_person': { 'ys_job_id': '' }, 'Ys_job_upload': { 'ys_job_id': '' }}
      subData.Ys_job.id = itemData.Ys_job.id
      subData.Ys_job_person.ys_job_id = itemData.Ys_job.id
      subData.Ys_job_upload.ys_job_id = itemData.Ys_job.id
      deleteAction(subData).then((res) => {
        if (res.code === 200) {
          this.$message.success('删除成功！')
          this.init()
        } else {
          this.$message.error('删除失败：' + res.msg)
        }
      })
    },
    add() {
      this.form = { menu: false, zyry: [] }
      this.departments = []
      this.persons = []
      this.dialog = true
    },
    save() {
      if (this.form.id) {
        const subData = {'function':{'currentUser()':'currentUser()','createTime()':'createTime()','orgCode()':'orgCode()','getJobNumber()':'getJobNumber()'},'Ys_job':{'id':'','update_by@':'function/currentUser','update_time@':'function/createTime','job_name':'','latest_submit_time':'','group_company': ''},'Ys_job_person[]':[]};
        if (this.form.job_status === '1') { // 发布后更新增加内容
          this.$set(subData.Ys_job, 'modifier@', 'function/currentUser')
          this.$set(subData.Ys_job, 'modify_time@', 'function/createTime')
        }
        subData['Ys_job'].id = this.form.id
        subData['Ys_job'].job_name = this.form.name
        subData['Ys_job'].latest_submit_time = this.form.date
        subData['Ys_job'].group_company = (this.form.company || {}).org_code
        this.form.zyry.forEach((item) => {
          if ('ys_job_id' in item) {
            subData['Ys_job_person[]'].push({
              'id': item.id,
              'update_by@': 'function/currentUser',
              'update_time@': 'function/createTime',
              'ys_job_id@': 'Ys_job/id',
              'user_id': item.user_id // 作业人员ID
            })
          } else {
            subData['Ys_job_person[]'].push({
              'create_by@': 'function/currentUser',
              'create_time@': 'function/createTime',
              'sys_org_code@': 'function/orgCode',
              'ys_job_id@': 'Ys_job/id',
              'user_id': item.id // 作业人员ID
            })
          }
        })
        if (subData['Ys_job_person[]'].length === 0) subData['Ys_job_person[]'].push({ 'ys_job_id@': 'Ys_job/id' })
        putAction(subData).then((res) => {
          if (res.code === 200) {
            this.$message.success('修改成功！')
            this.init()
            this.dialog = false
          } else {
            this.$message.error('修改失败：' + res.msg)
          }
        })
      } else {
        const subData = {'function':{'currentUser()':'currentUser()','createTime()':'createTime()','orgCode()':'orgCode()','getJobNumber()':'getJobNumber()'},'Ys_job':{'create_by@':'function/currentUser','create_time@':'function/createTime','sys_org_code@':'function/orgCode','job_number@':'function/getJobNumber','job_name':'','latest_submit_time':'','group_company': ''},'Ys_job_person[]':[]}
        subData['Ys_job'].job_name = this.form.name
        subData['Ys_job'].latest_submit_time = this.form.date
        subData['Ys_job'].group_company = (this.form.company || {}).org_code
        this.form.zyry.forEach((item) => {
          subData['Ys_job_person[]'].push({
            'create_by@': 'function/currentUser',
            'create_time@': 'function/createTime',
            'sys_org_code@': 'function/orgCode',
            'ys_job_id@': 'Ys_job/id',
            'user_id': item.id // 作业人员ID
          })
        })
        postAction(subData).then((res) => {
          if (res.code === 200) {
            this.$message.success('添加成功！')
            this.init()
            this.dialog = false
          } else {
            this.$message.error('添加失败：' + res.msg)
          }
        })
      }
    },
    updateStatus() {
      if (this.selected.length === 0) {
        this.$message.warning('请先选择一条作业再进行发布！')
        return
      }
      const subData = {'function':{'currentUser()':'currentUser()','createTime()':'createTime()','orgCode()':'orgCode()','getJobNumber()':'getJobNumber()'},'Ys_job':{'id':'','update_by@':'function/currentUser','update_time@':'function/createTime','publish_time@':'function/createTime','publisher@':'function/currentUser','job_status':'1'}}
      subData['Ys_job'].id = this.selected[0]['Ys_job'].id
      putAction(subData).then((res) => {
        if (res.code === 200) {
          this.$message.success('发布成功！')
          this.init()
          this.dialog = false
        } else {
          this.$message.error('发布失败：' + res.msg)
        }
      })
    },
    test() {
      // this.testdialog = true
      this.$message.warning('登录成功')
    },
    downloadWork(item) {
      const url = process.env.VUE_APP_SERVER_URL + '/business/ysJob/downloadJobFileZip?job_name=' + item.Ys_job.job_name + '&token=' + JSON.parse(localStorage['pro__Access-Token']).value
      window.location.href = url
    }
  }
}
</script>
<style scoped>
.selectmenu{background:#fff;}
.worktab /deep/ td,.worktab /deep/ th{padding:0 5px !important;}
.worktab /deep/ th{font-size:1rem !important;color:#000 !important;background:#ccc;}
.worktab /deep/ .actions .v-icon{margin-right:5px;}
</style>
