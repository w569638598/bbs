<template>
<div class="minder">
  <v-dialog
    v-model="minderVisible"
    persistent
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
        height="50"
      >
        <v-toolbar-title>编辑</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="minderVisible = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <Minder
        @saveData="saveData"
        @exportData="changeSave"
				:importData="minderData.root"
				:template="minderData.template"
				:theme="minderData.theme"
      />
    </v-card>
  </v-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import MindEdiMindertor from 'vue-minder-editor-antv'
import { randomString } from '@/utils/util'
import 'vue-minder-editor-antv/lib/vue-minder-editor-antv.css'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { httpAction } from '@/api/manage'
export default {
  name: 'MindeEditor',
  components: {
    Minder: MindEdiMindertor.Minder
  },
  data() {
    return {
      minderVisible: false,
      fullscreen: true,
      switchFullscreen: true,
      iframeUrl: '',
      messageId: randomString('16'),
      loading: false,
      height: '60%',
      url: {
        edit: '/mind/ysMind/edit',
        add: '/mind/ysMind/add'
      },
      ajaxState: true
    }
  },
  props: {
    minderData: {
      type: Object,
      default: () => {
        return {
          root: {},
          template: 'structure',
          theme: 'fresh-blue',
          timeout: '',
          mindId: ''
        }
      }
    },
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    iframeProps() {
      const mindURL = window._CONFIG['domianURL'] + '/Lmind/index'
      let src = mindURL
      src += `?token=${Vue.ls.get(ACCESS_TOKEN)}&messageId=${this.messageId}`
      return {
        src,
        style: {
          'width': '100%',
          'min-height': 'calc(100vh - 70px)'
        },
        frameborder: '0'
      }
    }
  },
  methods: {
    showMind() {
      this.loading = true
      this.minderVisible = true
      this.$nextTick(() => {
        this.mindId = this.id
      })
    },
    closeMind() {
      this.$emit('ok')
      this.minderVisible = false
    },
    saveData(data) {
      this.submitForm(data, 'save')
    },
    changeSave(data) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.submitForm(data, 'changeSave')
      }, 5000)
    },
    handleCancleMinder() {
      this.closeMind()
    },
    sendMind() {
      this.$refs.iframeId.contentWindow.postMessage({
        messageId: this.messageId,
        minderData: this.minderData,
        isChangeSave: true
      }, '*')
    },
    submitForm(minddata, type) {
      this.confirmLoading = true
      let httpurl = ''
      let method = ''
      const data = {}
      if (!this.mindId) {
        httpurl += this.url.add
        method = 'post'
      } else {
        httpurl += this.url.edit
        method = 'put'
      }
      data.id = this.mindId
      data.name = minddata.root.data.text
      data.minddata = JSON.stringify(minddata)
      if(this.ajaxState === false)return;
      this.ajaxState = false;
      httpAction(httpurl, data, method).then((res) => {
        if (res.success) {
          if (type !== 'changeSave') {
            this.$message.success(res.message)
            this.closeMind()
          } else {
            this.$message.success('保存成功')
          }
          this.mindId = res.result.id
        } else {
          this.$message.success(res.message)
        }
        this.ajaxState = true
      }).finally(() => {
        this.confirmLoading = false
      })
    }
  },
  mounted() {
    this.iframeUrl = window._CONFIG['mindURL']
    console.log(this.minderData)
  },
  created() {
    const _this = this
    window.addEventListener('message', function(event) {
      const { messageId, type, data } = event.data
      if (`${_this.messageId}` !== messageId) {
        return
      }
      switch (type) {
        case 'created':
          _this.loading = false
          break
        case 'mounted':
          _this.sendMind()
          break
        case 'closing':
          // _this.handleClosing(data)
          break
        case 'modal':
          // _this.showModal(data)
          break
        case 'request':
          // _this.request(data)
          break
        case 'save':
          _this.saveData(data, false)
          break
        case 'changeSave':
          _this.changeSave(data, false)
          break
      }
    }, false)
  }
}
</script>
<style scoped>
.main{
	height: 100%;
}
.ant-layout-content{
	position: relative;
}
.minder-editor-container{
  margin-top: 50px;
}
</style>
