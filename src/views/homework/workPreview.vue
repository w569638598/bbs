<template>
  <div>
    <v-card class="mt-0">
    <v-overlay absolute :value="spinning">
        <v-progress-circular indeterminate size="64"/>
    </v-overlay>
    <v-card-text>
        <div v-if="iframeProps">
            <iframe :key="filename" v-if="fileType !== 'video'" @load="loaded" id="iframeId" ref="iframeId" v-bind="iframeProps"></iframe>
            <VueVideo v-else :src="attachmentUrl" style="width:100%;" />
        </div>
    </v-card-text>
    </v-card>
  </div>
</template>

<script>
const Base64 = require('js-base64').Base64
import { matchFileSuffixType } from '@/utils/util' // 判断文件类型
import VueVideo from '@/components/video/Video'
export default {
  name: 'workPreview',
  props: {
    filename: {
      type: String,
      default: ''
    }
  },
  components: { VueVideo },
  data() {
    return {
      fileType: '',
      attachmentUrl: '',
      spinning: false
    }
  },
  computed: {
    iframeProps() {
      this.attachmentUrl = window._CONFIG['staticDomainURL'] + '/' + this.filename
      console.log('文件路径', this.attachmentUrl)
      const src = this.VUE_APP_PREVIEW_URL + encodeURIComponent(Base64.encode(this.attachmentUrl))
      // const src = this.VUE_APP_PREVIEW_URL + encodeURIComponent(Base64.encode(this.attachmentUrl)) + '&officePreviewType=pdf'
      this.fileType = matchFileSuffixType(this.filename)// 判断文件类型
      if (this.fileType === 'video') {
        this.updatePageviews()
        this.spinning = false
      }
      if (!this.filename) {
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
  methods: {
    loaded() {
      console.log('在线预览加载完成')
      this.spinning = false
      // 此处可记录查看人是谁
    }
  },
  mounted() {
    this.spinning = true
    // this.filename = this.$route.params.filename
  }
}
</script>
<style>
.page-layout .v-toolbar__content {
  align-items: center !important;
}
</style>
