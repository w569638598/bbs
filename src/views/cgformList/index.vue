<template>
  <v-card class="lmind-table mt-0">
    <div class="" style="padding-left:20px;">
      <v-row>
        <v-col cols="3">
          <v-text-field
            label="公司名称"
            clearable
            outlined
            dense
            v-model="params.customer_id"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
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
                v-model="params.date_start_plan"
                label="辅导开始日期"
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
              v-model="params.date_start_plan"
              locale="zh-cn"
              no-title
              scrollable
              @input="params.start_menu = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="3">
          <v-menu
            v-model="params.end_menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            content-class="selectmenu"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="params.date_end_plan"
                label="辅导结束日期"
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
              v-model="params.date_end_plan"
              locale="zh-cn"
              no-title
              header-color="#f00"
              scrollable
              @input="params.end_menu = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <!-- <v-select
          :items="yearList"
          label="选择年份"
          v-model="params.year"
          outlined
          clearable
          dense
          ref="year"
        ></v-select>
        <v-select
          :items="monthList"
          label="选择月份"
          v-model="params.month"
          outlined
          clearable
          dense
          ref="month"
        ></v-select> -->
        <!-- <v-text-field label="月份" v-model="params.month"></v-text-field> -->
        <v-col cols="2">
          <v-btn depressed color="primary" @click="search">
            查询<v-icon right dark> mdi-magnify </v-icon>
          </v-btn>
          <v-btn v-show="1==2" color="teal" class="ma-2 white--text" @click="download" small>
            下载
            <v-icon right dark> mdi-download </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-card class="lmind-table mt-0">
      <v-data-table
        :headers="headers"
        :items="desserts"
        :server-items-length="total"
        :options="options"
        @pagination="pagination"
        :loading="loading"
        class="elevation-1"
        show-select
        @item-selected="selectItem"
        @toggle-select-all="selectAll"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <!-- <v-icon small class="mr-2" @click="details(item)"> mdi-eye </v-icon> -->
          <!-- <v-btn
        depressed
        color="primary"
      >
        查看
      </v-btn> -->
          <span style="color: #1976d2; cursor: pointer" @click="details(item)">查看</span>&emsp;
          <span style="color: #1976d2; cursor: pointer" @click="downloadItem(item)">下载</span>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialogState" max-width="80%" ref="dialog">
      <v-card>
        <v-data-table
          :headers="detailsHeaders"
          :items="detailsItems"
          hide-default-footer
          class="elevation-1"
        ></v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogState = false"
            >关闭</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { getList, getColumns, getdetail, download } from '@/api/cgformList'
import { ajaxGetDictItems } from '@/api/api'
import tabMixin from '@/mixins/table'
export default {
  mixins: [tabMixin],
  data() {
    return {
      loading: false,
      monthList: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12'
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      },
      // selected: [],
      params: {
        pageNo: 1,
        pageSize: 10,
        superQueryMatchType: 'and',
        column: 'createTime',
        year: '',
        month: '',
        order: 'desc'
      },
      headers: [
        {
          text: '公司名称',
          align: 'start',
          sortable: false,
          value: 'customer_id'
        },
        { text: '起始日期', sortable: false, value: 'date_start_plan' },
        { text: '结束日期', sortable: false, value: 'date_end_plan' },
        { text: '责任顾问', sortable: false, value: 'responsible_consultant' },
        { text: '操作', sortable: false, value: 'actions' }
      ],
      detailsHeaders: [
        {
          text: '序号',
          align: 'start',
          sortable: false,
          value: 'order_num'
        },
        { text: '日期', sortable: false, value: 'fill_time' },
        { text: '时间', sortable: false, value: 'time' },
        { text: '类别', sortable: false, value: 'category' },
        { text: '工作内容', sortable: false, value: 'job_content' },
        { text: '预计时间(H)', sortable: false, value: 'expect_time' },
        { text: '地点', sortable: false, value: 'site' },
        { text: '客户参加人', sortable: false, value: 'customer_participant' },
        { text: '顾问参与人', sortable: false, value: 'counselor_participant' },
        { text: '备注', sortable: false, value: 'remark' }
      ],
      detailsItems: [],
      desserts: [],
      clientArr: [],
      total: 0,
      dialogState: false,
      yearList: []
    }
  },
  async mounted() {
    window.onscroll = (e) => {
      if (document.documentElement.scrollTop > 300) {
        this.$refs.year.blur()
        this.$refs.month.blur()
      }
    }
    ajaxGetDictItems('nian_fen').then((res) => {
      this.yearList = res.result
    })
    await getColumns().then((res) => {
      const arr = []
      res.result.columns.forEach((item) => {
        const obj = {
          text: item.title,
          sortable: false,
          value: item.customRender
        }
        arr.push(obj)
      })
      this.clientArr = res.result.dictOptions.customer_id || []
    })
    this.getData()
  },
  methods: {
    download() {
      const downloadParams = {}
      if (this.selected.length) {
        downloadParams.selections = this.selected.join(',')
      }
      // else{
      //   this.$message.error("请选择数据");
      //   return
      // }
      download(this.selected.length ? downloadParams : this.params).then(
        (res) => {}
      )
    },
    downloadItem(row) {
      download({ selections: row.id }).then(
        (res) => {}
      )
    },
    details(item) {
      this.dialogState = true
      this.$nextTick(() => {
        document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
      })
      getdetail(item.id).then((res) => {
        res.result.ys_cust_week_report_detail.forEach((item) => {
          item.fill_time = item.fill_time ? item.fill_time.split(' ')[0] : ''
        })
        this.detailsItems = res.result.ys_cust_week_report_detail
      })
    },
    pagination(a) {
      this.params.pageNo = a.page
      this.params.pageSize = a.itemsPerPage == -1 ? 100000 : a.itemsPerPage
      this.getData()
    },
    search() {
      this.params.pageNo = 1
      this.options.page = 1
      this.getData()
    },
    getData() {
      this.loading = true
      // if (!this.params.month) delete this.params.month
      // if (!this.params.year) delete this.params.year
      getList(this.params).then((res) => {
        if (!res.success) {
          this.desserts = []
          this.loading = false
          return
        }
        res.result.records.forEach((item) => {
          item.date_start_plan = item.date_start_plan?.substr(0, 10)
          item.date_end_plan = item.date_end_plan?.substr(0, 10)
          for (let i = 0; i < this.clientArr.length; i++) {
            const client = this.clientArr[i]
            if (item.customer_id == client.value) {
              item.customer_id = client.text
              break
            }
          }
        })
        this.total = res.result.total
        this.desserts = res.result.records
        console.log(res.result)
        this.loading = false
      })
    }
  }
}

// _t: 1630485443
// order: desc
</script>
<style scoped>
.v-menu__content{background:#fff !important;}
</style>
<style lang='sass'>
th
  FONT-WEIGHT: 600 !important
  font-size: 1rem !important

td
  font-weight: 500 !important
</style>
<style lang='sass' scoped>
.v-btn--is-elevated
  box-shadow: none

.v-input__slot
  min-height: auto
.v-sheet button.v-btn.v-size--default:not(.v-btn--icon):not(.v-btn--fab)
  padding: 0 30px !important

.lmind-table
  padding-top: 10px
  margin-top: 20px

.searchBox
  background: white
  // margin-top: 20px
  // padding: 20px 0 0 0
  &>*
    display: inline-block
    margin: 0 20px

@media (min-width: 1280px) and (max-width: 1900)
.searchBox
  &>*
    width: calc(30% - 40px)

@media(max-width: 1280px)
  .searchBox
    &>*
      width: calc(100% - 40px)
</style>
