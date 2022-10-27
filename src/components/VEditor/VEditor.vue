<template>
   <div id="vditor" />
</template>

<script>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { mapGetters } from 'vuex'
export default {
  name: 'VEditor',
  data() {
    return {
      copyStr: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.contentEditor = new Vditor('vditor', {
        i18n: 'zh_CN',
        height: 500,
        placeholder: '此处为帖子内容……',
        cdn: '',
        theme: 'classic',
        upload: {
          url: window._CONFIG['domianURL'] + '/sys/common/upload',
          headers: {
            'X-Access-Token': this.token
          },
          multiple: false,
          extraData: { biz: 'temp' },
          fieldName: 'file',
          format: (files, responseText) => {
            const imageResult = JSON.parse(responseText)
            if (imageResult.success === true) {
              const succ = {}
              succ[imageResult.message] = window._CONFIG['staticDomainURL'] + '/' + imageResult.message
              return JSON.stringify({
                msg: '',
                code: 0,
                data: {
                  errFiles: [],
                  succMap: succ
                }
              })
            } else {
              this.$message.error(imageResult.message)
            }
          }
        },
        counter: {
          enable: true,
          type: 'markdown'
        },
        preview: {
          delay: 0,
          hljs: {
            style: 'monokai',
            lineNumber: true
          },
          theme: {
            path: '/dist/css/content-theme'
          }
        },
        tab: '\t',
        typewriterMode: true,
        toolbarConfig: {
          pin: true
        },
        cache: {
          enable: false
        },
        mode: 'wysiwyg'
      })
    },
    getValue() {
      return this.contentEditor.getValue()
    },
    setValue(val) {
      this.copyStr = val;
      this.contentEditor.setValue(val)
    },
    reset() {
      if (this.copyStr) {
        this.contentEditor.setValue(this.copyStr)
        return
      }
      this.contentEditor.setValue('')
    }
  }
}
</script>
