<template>
  <div>
    <v-app-bar
      class="align-center page-layout"
      dense
      app
      color="#fff"
      height="60"
      shrink-on-scroll
    >
      <v-btn
        fab
        outlined
        color="primary"
        class="mr-3"
        elevation="1"
        @click="$router.push('/onlineLearn/OnlineLearn')"
        x-small
      >
        <v-icon>fa fa-arrow-left</v-icon>
      </v-btn>
      <v-btn text @click="() => this.$router.push('/dashboard')" class="hidden-sm-and-down text-h4 font-weight-bold" color="#167df0">{{$route.meta.title}}</v-btn>
      <v-spacer />
      <v-icon color="primary" @click="() => this.drawer = !this.drawer">fa fa-bars</v-icon>
    </v-app-bar>
    <v-content>
    <v-container style="margin-bottom:50px;">
      <v-row justify="center">
        <v-col
          cols="12"
          sm="8"
        >
          <v-card class="mt-0">
            <v-overlay absolute :value="spinning">
              <v-progress-circular indeterminate size="64"/>
            </v-overlay>
            <v-card-text>
              <v-tabs
                color="#167df0"
                v-model="tab"
              >
                <v-tab>{{fileData.title || ''}}</v-tab>
                <v-tab>详情</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item key="1">
                  <div v-if="iframeProps">
                    <iframe :key="id" v-if="fileType !== 'video'" @load="loaded" id="iframeId" ref="iframeId" v-bind="iframeProps"></iframe>
                    <VueVideo v-else :src="attachmentUrl" style="width:100%;" />
                  </div>
                </v-tab-item>
                <v-tab-item key="2">
                  {{fileData.subtitle}}
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
            <v-navigation-drawer
              fixed
              right
              temporary
              v-model="drawer"
              :width="600"
            >
              <OnlineLearn />
            </v-navigation-drawer>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    </v-content>
  </div>
</template>

<script>
const Base64 = require('js-base64').Base64
import { matchFileSuffixType } from '@/utils/util'
import VueVideo from '@/components/video/Video'
import { putAction, getAction } from '@/api/manage'
import OnlineLearn from './OnlineLearn'
import { VProgressCircular } from 'vuetify/lib'
export default {
  name: 'OnlinePreview',
  components: { VueVideo, OnlineLearn, VProgressCircular },
  data() {
    return {
      fileType: '',
      attachmentUrl: '',
      url: {
        updatePageviews: '/onlineStudy/osLearningMaterial/updatePageviews',
        queryById: '/onlineStudy/osLearningMaterial/queryById'
      },
      fileData: {}, // 在线学习数据
      id: '',
      visible: false,
      tab: null,
      spinning: false,
      items: [
        { title: 'Home', icon: 'mdi-home-city' },
        { title: 'My Account', icon: 'mdi-account' },
        { title: 'Users', icon: 'mdi-account-group-outline' }
      ],
      drawer: false,
      isCreated: false
    }
  },
  computed: {
    iframeProps() {
      // let src
      // if (process.env.NODE_ENV === 'development') { // 本地环境测试需要一个外部id地址
      //   // url = 'http://mail.free.idcfengye.com/sys/common/static/' + this.attachment
      //   this.attachmentUrl = window._CONFIG['staticDomainURL'] + '/' + this.fileData.attachment
      //   src = 'http://127.0.0.1:8012/onlinePreview?url=' + encodeURIComponent(Base64.encode(this.attachmentUrl)) + '&officePreviewType=pdf'
      // } else {
      this.attachmentUrl = window._CONFIG['staticDomainURL'] + '/' + this.fileData.attachment
      // const src = this.VUE_APP_PREVIEW_URL + encodeURIComponent(Base64.encode(this.attachmentUrl)) + '&officePreviewType=pdf'
      const src = this.VUE_APP_PREVIEW_URL + encodeURIComponent(Base64.encode(this.attachmentUrl))
      // }
      this.fileType = matchFileSuffixType(this.fileData.attachment)// 判断文件类型
      if (this.fileType === 'video') {
        this.updatePageviews()
        this.spinning = false
      }
      if (!this.fileData.attachment) {
        return false
      }
      return {
        src,
        style: {
          'width': '100%',
          'min-height': this.fileType === 'video' ? '650px' : 'calc(100vh - 80px)'
        },
        frameborder: '0'
      }
    }
  },
  watch: {
    $route(to, from) {
      this.isCreated && this.init()
    }
  },
  methods: {
    loaded() {
      console.log('在线预览加载完成')
      this.updatePageviews()
      this.spinning = false
    },
    updatePageviews(id) {
      putAction(this.url.updatePageviews, { id: this.id })
    },
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    getData() {
      getAction(this.url.queryById, { id: this.id }).then(res => {
        if (res.success) {
          this.fileData = res.result
        }
      })
    },
    init() {
      this.spinning = true
      this.id = this.$route.params.id
      this.getData()
    }
  },
  mounted() {
    this.init()
    this.isCreated = true
  }
}
</script>
<style>
.page-layout .v-toolbar__content {
  align-items: center !important;
}
</style>
