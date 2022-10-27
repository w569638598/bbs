<template>
  <v-card class="lmind-table mt-0">
    <v-card-title>
      <v-btn color="primary" small @click="readAll">
        <v-icon left>fa fa-book</v-icon>全部标注已读
      </v-btn>
    </v-card-title>
    <v-data-table
      class="elevation-1 "
      :headers="headers"
      :items="dataSource"
      item-key="id"
      :options.sync="options"
      :server-items-length="totalDesserts"
      :loading="loading"
      @pagination="pagination"
      :footer-props="{'items-per-page-options': [5,10,20,50]}"
    >
      <template v-slot:[`item.rowIndex`]="{ index }">
        <span>{{index + 1}}</span>
      </template>
      <template v-slot:[`item.msgCategory`]="{ item }">
        <span>{{msgCategoryText(item.msgCategory)}}</span>
      </template>
      <template v-slot:[`item.priority`]="{ item }">
        <span>{{priorityText(item.priority)}}</span>
      </template>
      <template v-slot:[`item.readFlag`]="{ item }">
        <span>{{readFlagText(item.readFlag)}}</span>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-btn
          x-small
          color="primary"
          class="mr-2"
          @click="showAnnouncement(item)"
        >
          查看
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { VDataTable } from 'vuetify/lib'
import { getAction, putAction } from '@/api/manage'
export default {
  name: 'UserAnnouncementList',
  components: {
    VDataTable
  },
  data() {
    return {
      search: '',
      calories: '',
      dataSource: [],
      totalDesserts: 0,
      options: {
        itemsPerPage: 10,
        page: 1
      },
      url: {
        list: '/sys/sysAnnouncementSend/getMyAnnouncementSend',
        editCementSend: 'sys/sysAnnouncementSend/editByAnntIdAndUserId',
        readAllMsg: 'sys/sysAnnouncementSend/readAll'
      },
      loading: true,
      formData: {},
      openPath: ''
    }
  },
  computed: {
    headers() {
      return [
        { text: '#', value: 'rowIndex', sortable: false },
        { text: '标题', value: 'titile', sortable: false },
        { text: '消息类型', value: 'msgCategory', sortable: false },
        { text: '发布人', value: 'sender', sortable: false },
        { text: '发布时间', value: 'sendTime', sortable: false },
        { text: '优先级', value: 'priority', sortable: false },
        { text: '阅读状态', value: 'readFlag', sortable: false },
        { text: '操作', value: 'action', sortable: false }
      ]
    }
  },
  methods: {
    loadData() {
      this.loading = true
      getAction(this.url.list, {
        isAll: 0,
        pageNo: this.options.page,
        pageSize: this.options.itemsPerPage
      }).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
          this.totalDesserts = res.result.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },
    pagination() {
      this.loadData()
    },
    readAll() {
      putAction(this.url.readAllMsg).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
          this.syncHeadNotic()
        }
      })
    },
    showAnnouncement(record) {
      putAction(this.url.editCementSend, { anntId: record.anntId }).then((res) => {
        if (res.success) {
          this.loadData()
          this.syncHeadNotic(record.anntId)
        }
      })
      if (record.openType === 'component') {
        this.openPath = record.openPage
        this.formData = { id: record.busId }
        this.toHandle(record)
      } else {
        this.toHandle(record)
      }
    },
    toHandle(record) {
      if (record.openType === 'url') {
        this.$router.push({ path: record.openPage })
      }
    },
    syncHeadNotic(anntId) { // 清空角标数值
      getAction('sys/annountCement/syncNotic', { anntId: anntId })
    },
    msgCategoryText(text) {
      if (text === '1') {
        return '通知公告'
      } else if (text === '2') {
        return '系统消息'
      } else {
        return text
      }
    },
    priorityText(text) {
      if (text === 'L') {
        return '低'
      } else if (text === 'M') {
        return '中'
      } else if (text === 'H') {
        return '高'
      } else {
        return text
      }
    },
    readFlagText(text) {
      if (text === '0') {
        return '未读'
      } else if (text === '1') {
        return '已读'
      } else {
        return text
      }
    }
  },
  created() {
    this.loadData()
  }
}
</script>
<style>
.lmind-table .v-data-table >
.lmind-table .v-data-table__wrapper >
table > tbody > tr > th,
.lmind-table .v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.lmind-table .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th{
  FONT-WEIGHT: 600;
  font-size: 1rem;
}
.lmind-table .v-data-table td{
  font-weight: 500;
}
</style>
