<template>
  <v-card class="mt-0" flat :loading="spinning">
    <v-card-title class="pa-2" style="border-bottom: 1px solid #e8e8e8;">
      <v-row
        class="ma-0"
        no-gutters
        justify="space-between"
      >
        <v-col md="4" sm="12" class="hidden-sm-and-down">
          <i class="fa fa fa-book mr-2 blue--text"></i>
          学习资料
        </v-col>
        <v-col md="4" sm="12">
          <v-autocomplete
            v-model="tag"
            :items="tags"
            item-text="name"
            item-value="id"
            dense
            clearable
            label="请选择分类"
            hide-details="auto"
            @change="() => this.loadData()"
          >
            <template v-slot:item="data">
              <v-list-item-content >{{data.item.name}}</v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pa-0">
    <v-tabs
      align-with-title
      color="#167df0"
      show-arrows
      v-model="tab"
      @change="handleTab"
      class="px-2"
    >
    <template v-for="(item, index) in categoryOption">
      <v-tab :key="index">{{item.title}}</v-tab>
    </template>
    </v-tabs>
    <v-list v-if="dataSource.length>0" subheader>
      <template v-for="(item,i) in dataSource">
        <v-list-item link :key="i" @click.stop="handleClick(item)">
          <!-- <v-list-item-avatar class="grey lighten-2">
            <v-img :src="`${baseURL}${item.createByUser.avatar}`"></v-img>
          </v-list-item-avatar> -->
          <v-list-item-content class="text-left"  @click="handleClick(item)">
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle>
              <div class="leva-left is-size-7">
              <span class="leva-item">
                {{ item.createByUser && item.createByUser.realname }}
              </span>
              <span class="mr-1">
                发布于:{{ moment(item.createTime).format("YYYY/MM/DD") }}
              </span>
              <span
                v-for="(tag, index) in item.tags"
                :key="index"
                class="tag is-hidden-mobile is-success is-light mr-1"
              >
                <router-link :to="{ name: 'tag', params: { name: tag.name } }">
                  {{ "#" + tag.name }}
                </router-link>
              </span>
            </div>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-card-actions>
            <v-btn x-small icon link :class="{isCollection:item.isCollection === 1,'mr-0':true}" @click.stop="handleCollection(item)">
              <v-icon v-if="item.isCollection === 1">fa fa-star</v-icon>
              <v-icon v-else >fa fa-star-o</v-icon>
            </v-btn>
            <v-btn x-small icon link class="mr-0">
              <v-icon>fa fa-eye</v-icon>
            </v-btn>
            <span class="text-body-2">{{ item.viewNumber }}</span>
          </v-card-actions>
        </v-list-item>
      </template>
    </v-list>
    <JEmpty v-else />
    </v-card-text>
    <v-pagination
      v-model="page.current"
      :length="page.pages"
      :total-visible="7"
    />
  </v-card>
</template>

<script>
import { getAction, postAction, deleteAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { ajaxGetDictItems } from '@/api/api'
import JEmpty from '@/components/common/JEmpty'
export default {
  name: 'OnlineLearn',
  components: {
    JEmpty
  },
  data() {
    return {
      page: {
        current: 1,
        size: 10,
        total: 0,
        pages: 1
      },
      url: {
        list: '/onlineStudy/osLearningMaterial/list',
        add: '/community/bmsCollectionUser/add',
        del: '/community/bmsCollectionUser/cancelTheCollection',
        tag: '/onlineStudy/osLearningMaterial/getOsLearningMaterialTagList'
      },
      dataSource: [],
      baseURL: '',
      params: {
        title: ''
      },
      spinning: false,
      isLoad: false,
      categoryOption: [],
      categoryOptionValue: [],
      tab: '',
      tags: [],
      tag: ''
    }
  },
  watch: {
    'page.current': {
      handler: function(val, oldVal) {
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    ajaxGetDictItems('bbs_materials_category', null).then(res => {
      if (res.success) {
        this.categoryOption = res.result
        this.categoryOption.unshift({ title: '全部', value: '' })
        this.categoryOptionValue = []
        res.result.forEach(item => {
          this.categoryOptionValue.push(item.value)
        })
        // this.loadData()
      }
    })
    getAction(this.url.tag).then(res => {
      if (res.success) {
        this.tags = res.result
      }
    })
  },
  mounted() {
    this.baseURL = window._CONFIG['staticDomainURL'] + '/'
    this.$bus.$on('seach', (value) => {
      this.params.title = value ? '*' + value + '*' : ''
      this.loadData()
    })
  },
  beforeDestroy() {
    this.$bus.$off('seach')
  },
  methods: {
    moment,
    ...mapGetters(['userInfo']),
    handleTab(event) {
      this.loadData()
    },
    loadData() {
      this.spinning = true
      const params = {
        pageNo: this.page.current,
        pageSize: this.page.size,
        category: this.categoryOptionValue[this.tab],
        tag: this.tag
      }
      getAction(this.url.list, Object.assign(params, this.params)).then((res) => {
        if (res.success) {
          this.page.current = res.result.current
          this.page.total = res.result.total
          this.page.pages = res.result.pages
          this.dataSource = res.result.records
        } else {
          this.$message.warning(res.message)
        }
        this.spinning = false
      })
    },
    handleClick(item) {
      this.$router.push({
        path: `/onlineLearn/OnlinePreview/${item.id}`
      })
    },
    add(data) {
      this.isLoad = true
      postAction(this.url.add, {
        tableName: 'os_learning_material',
        businessId: data.id,
        userId: this.userInfo().id
      }).then(res => {
        this.isLoad = false
        if (res.success) {
          this.loadData()
        }
      })
    },
    cancel(data) {
      this.isLoad = true
      deleteAction(this.url.del, {
        tableName: 'os_learning_material',
        businessId: data.id
      }).then(res => {
        this.isLoad = false
        if (res.success) {
          this.loadData()
        }
      })
    },
    handleCollection(data) {
      if (this.isLoad) {
        return false
      }
      if (data.isCollection) {
        this.cancel(data)
      } else {
        this.add(data)
      }
    }
  }
}
</script>
<style scoped>
.avatar{
  width: 100%;
  height: 100%;
}
.icon-collection{
  margin-right: 4px;
  cursor: pointer;
}
.isCollection{
  color: #e4b610 !important;
}
</style>
