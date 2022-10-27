<template>
  <v-card class="mt-0" style="padding:20px;" v-show="this.role">
    <h2 style="margin-bottom:10px;">作业查看</h2>
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
      <v-col cols="12" md="3" style="display:none">
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
      </v-col>
    </v-row>
    <v-data-table
      v-model="selected"
      show-select
      :headers="headers"
      :items="articleList"
      item-key="key"
      :options.sync="options"
      hide-default-footer
      class="elevation-1 worktab"
    >
      <template v-slot:item.uploadDate = "{ item }">
        <v-chip label :color="item.Ys_job.uploadBg" style="width:100%;" v-if="item.Ys_job.uploadBg">{{item.Ys_job.uploadDate}}</v-chip>
      </template>
      <template v-slot:item.lookPerson = "{ item }">
        <v-tooltip bottom :disabled="item['Ys_job_person_look_view[]'].length <= 2" max-width="300">
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <v-badge
                :content="item['Ys_job_person_look_view[]'].length"
                left
                offset-x="20"
                :value="item['Ys_job_person_look_view[]'].length > 2">
                <template v-for="(per, index) in item['Ys_job_person_look_view[]']" v-if="index < 2">
                  <span :key="index" style="padding:0 3px;">{{per.realname}}</span>
                </template>
              </v-badge>
            </span>
          </template>
          <span>
            <template v-for="(per, index) in item['Ys_job_person_look_view[]']">
              <span :key="index" style="padding:0 3px;">{{per.realname}}</span>
            </template>
          </span>
        </v-tooltip>
      </template>
      <template v-slot:item.uploadViews = "{ item }">
        <template v-for="(file,index) in item['Ys_job_upload_view[]']">
          <v-chip close outlined label :key="index" class="uploadlist" color="#437EE2" close-icon="mdi-tray-arrow-down" @click:close="downloadFile(file)" @click="handleClick(file, item.Ys_job_person.id)">
            <v-icon :left="true">
              mdi-link-variant
            </v-icon>
            {{file.file_name}}
          </v-chip>
        </template>
      </template>
    </v-data-table>
    <v-pagination
      style="padding:20px 0 0;"
      v-model="options.current"
      :length="options.pages"
    ></v-pagination>
    <v-dialog
      v-model="dialogPreview"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="workpre">
        <v-toolbar dark color="primary" >
          <v-toolbar-title>{{indexFile.file_name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialogPreview = false" >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <WorkPreview :filename="indexFile.file_name"></WorkPreview>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import moment from 'moment'
import { getList, postAction } from '@/api/homework'
import WorkPreview from './workPreview.vue'
export default {
  name: 'ExamineWork',
  components: {
    WorkPreview
  },
  data: () => {
    return {
      dialogPreview: false,
      indexFile: {},
      search: { date: '', menu: false },
      selected: [],
      headers: [
        // { text: '作业编号', value: 'Ys_job.job_number', width: 85, sortable: false },
        { text: '作业名称', value: 'Ys_job.job_name', sortable: false },
        { text: '最晚提交时间', value: 'Ys_job.lastTime', width: 115, sortable: false },
        { text: '实际提交时间', value: 'uploadDate', width: 115, sortable: false },
        // { text: '作业发布时间', value: 'Ys_job.publishTime', width: 95, sortable: false },
        { text: '作业人', value: 'Sys_user.realname', width: 80, align: 'center', sortable: false },
        { text: '查看作业', value: 'uploadViews', width: 200, sortable: false },
        { text: '查看记录', value: 'lookPerson', width: 120, sortable: false }
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
    this.baseURL = window._CONFIG['staticDomainURL'] + '/'
    this.init()
    this.isCreated = true
  },
  computed: {
  },
  methods: {
    moment,
    searchData() {
      this.options.current = 1
      this.init()
    },
    init() {
      const user_role = localStorage.getItem('user_zy_role')
      if (user_role.search(/(gw)|(leader)/) === -1) {
        this.$message.error('您没有作业查看的权限！')
        return
      }
      this.role = true
      const param = {"function":{"currentUser()":"currentUser()","createTime()":"createTime()","orgCode()":"orgCode()","getUserListOfSameCompany()": "getUserListOfSameCompany()","getJobNumber()":"getJobNumber()"},"[]":{"query":2,"count":"100","page":"0","Ys_job_person":{"user_id{}@":"function/getUserListOfSameCompany","ys_job_id{}@":{"from":"Ys_job","Ys_job":{"@column":"id","job_status":"1"}}},"Ys_job":{"id@":"[]/Ys_job_person/ys_job_id","@order":"publish_time-"},"Sys_user":{"@column":"id,username,realname","id@":"[]/Ys_job_person/user_id"},"Ys_job_upload_view[]":{"Ys_job_upload_view":{"ys_job_person_id@":"[]/Ys_job_person/id","@order":"create_time-"}},"Ys_job_person_look_view[]":{"Ys_job_person_look_view":{"ys_job_person_id@":"[]/Ys_job_person/id","@order":"create_time-","@group": "realname","@column": "realname"}}},"total@":"/[]/total","info@":"/[]/info"}
      param['[]'].count = this.options.size
      param['[]'].page = this.options.current - 1
      if (user_role.indexOf('gw') > -1) delete param['[]']['Ys_job_person']['user_id{}@']
      if (this.search.title && this.search.title.length > 0) this.$set(param['[]'].Ys_job_person['ys_job_id{}@'].Ys_job, 'job_name$', '%' + this.search.title + '%')
      if (this.search.date && this.search.date.length === 10) this.$set(param['[]'].Ys_job_person['ys_job_id{}@'].Ys_job, 'publish_time%', this.search.date + ' 00:00:00,' + this.search.date + ' 23:59:59')
      getList(param).then((response) => {
        if (response.code === 200) {
          this.options.current = response.info.page + 1
          this.total = response.info.total
          this.options.size = response.info.count
          this.options.pages = response.info.max + 1
          this.articleList = response['[]'] || []
          const today = new Date()
          var todayStr = today.getFullYear() + '-' + ((today.getMonth() < 10) ? '0' : '') + (today.getMonth() + 1) + '-' + today.getDate()

          this.articleList.forEach((item) => {
            item.key = item.Ys_job.id + '|' + item.Sys_user.id
            if (!item['Ys_job_person_look_view[]']) this.$set(item, 'Ys_job_person_look_view[]', [])
            if (!item['Ys_job_upload_view[]']) this.$set(item, 'Ys_job_upload_view[]', [])
            if (item['Ys_job_upload_view[]'].length > 0) {
              this.$set(item.Ys_job, 'uploadDate', item['Ys_job_upload_view[]'][0].create_time.substr(0, 10))
              this.$set(item.Ys_job, 'uploadPerson', item['Ys_job_upload_view[]'][0].realname)
            }
            item.Ys_job.creatTime = item.Ys_job.create_time.substr(0, 10)
            item.Ys_job.lastTime = item.Ys_job.latest_submit_time || ''
            item.Ys_job.lastTime = item.Ys_job.lastTime.substr(0, 10)
            item.Ys_job.publishTime = item.Ys_job.publish_time || ''
            item.Ys_job.publishTime = item.Ys_job.publishTime.substr(0, 10)
            item.Ys_job.updateTime = item.Ys_job.update_time || ''
            item.Ys_job.updateTime = item.Ys_job.updateTime.substr(0, 10)

            // 设置实际提交时间的背景色
            if (item.Ys_job.uploadDate) {
              if (item.Ys_job.uploadDate > item.Ys_job.lastTime) this.$set(item.Ys_job, 'uploadBg', '#F9ED84')
              else this.$set(item.Ys_job, 'uploadBg', '#91CF8F')
            } else {
              if (todayStr > item.Ys_job.lastTime) this.$set(item.Ys_job, 'uploadBg', '#F98491')
            }
          })
        } else {
          this.$message.error('获取作业列表出错：' + response.msg)
        }
      })
    },
    handleClick(item, personid) {
      this.indexFile = item
      if (item.file_name.length > 0) this.dialogPreview = true
      const subData = {"function":{"currentUser()":"currentUser()","createTime()":"createTime()","orgCode()":"orgCode()","getJobNumber()":"getJobNumber()"},"Ys_job_person_look":{"create_by@":"function/currentUser","create_time@":"function/createTime","sys_org_code@":"function/orgCode","ys_job_person_id":"","ys_job_upload_id":""}}
      subData.Ys_job_person_look.ys_job_person_id = personid
      subData.Ys_job_person_look.ys_job_upload_id = item.id
      postAction(subData).then((res) => {
        if (res.code !== 200) {
          this.$message.error('登记信息出错：' + res.msg)
        }
      })
    },
    downloadFile(file) {
      window.location.href = this.baseURL + file.file_name
    }
  }
}
</script>
<style scoped>
.selectmenu{background:#fff;}
.uploadlist{margin:3px 0;height:30px !important;padding:0 30px 0 5px;}
.uploadlist  /deep/ .v-chip__close{position:absolute;right:10px;}
.uploadlist  /deep/ .v-chip__content{width:200px;overflow: hidden;padding:0 5px;}
.worktab /deep/ td,.worktab /deep/ th{padding:0 5px !important;}
.worktab /deep/ th{font-size:1rem !important;color:#000 !important;background:#ccc;}
.workpre /deep/ .v-card__text{padding:5px;}
</style>
