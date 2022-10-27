<template>
  <div class="container x6Dialog">
    <div class="title-container">
      <!-- <el-link
        type="primary"
        href="#"
        :underline="false"
        target="_blank"
        >antv-x6-vue2</el-link
      > -->
    </div>
    <div>
      <AntvX6Vue2
        @node-click="handleNodeClick"
        class="x6"
        :item="item"
        @exportData="reciveData"
        @exportNodeData="reciveNodeData"
        @exportImg="handleExportImage"
        ref="antvx6"
      >
      </AntvX6Vue2>
    </div>
  </div>
</template>
<script>
const list = [
  // {
  //   nodes: g6NodEdges.nodes2,
  //   edges: g6NodEdges.edges2,
  // },
  // {
  //   nodes: g6NodEdges.nodes1,
  //   edges: g6NodEdges.edges1,
  // },
  // {
  //   nodes: g6NodEdges.nodes3,
  //   edges: g6NodEdges.edges3,
  // },
]
import { graphFunc, AntvX6Vue2 } from 'x6-editor-fra'
import { DataUri } from '@antv/x6'

export default {
  props: ['params'],
  data() {
    return {
      disabled: false,
      currentIndex: 0,
      isUpdate: false,
      form: { label: '' },
      item: [
        {
          label: '名称',
          value: '',
          key: 'name',
          rules: [
            { required: true, message: '请输入故障树名称', trigger: 'blur' }
          ]
        },
        {
          label: '备注',
          value: '',
          key: 'remarks',
          type: 'textarea'
        }
      ],
      changedData: {}
    }
  },
  components: {
    AntvX6Vue2
  },
  methods: {
    // 接受故障树内工具组件保存事件
    reciveNodeData() {
      this.$emit('save')
    },
    // 触发获取绑定可修改的数据
    handleItem() {
      this.$refs.antvx6.handleImportDataEvent()
    },
    // 接受获取绑定可修改的数据
    reciveData(a) {
      this.changedData = a
    },
    // 初始化，新建就空节点，编辑就渲染数据节点数据
    init() {
      let node = {}
      if (this.params.eventType == 'add') {
        node = {
          nodesJSON: [],
          edgesJSON: []
        }
      } else {
        const itemObj = JSON.parse(JSON.stringify(this.item))
        for (let i = 0; i < itemObj.length; i++) {
          const itemC = itemObj[i]
          for (const paramsKey in this.params.data) {
            if (itemC.key === paramsKey) {
              itemC.value = this.params.data[paramsKey]
            }
          }
        }
        this.item = itemObj
        const nodeData = this.params.data.minderdata
        node =
          typeof nodeData === 'string'
            ? JSON.parse(nodeData)
            : nodeData
      }
      // 异步渲染节点数据，同步的话节点连线有问题
      setTimeout(() => this.handleSwitchDefault(node), 200)
    },
    handleNodeClick(e) {
      console.log('[debug]节点单击Emit事件:', e)
    },
    switchData() {
      const data = list[this.currentIndex++]
      if (this.currentIndex > list.length - 1) this.currentIndex = 0
      return data
    },
    handleExportAtoms() {
      const data = graphFunc.getAtoms()
      console.log('[debug]data:', data)
    },
    // 导出图片
    handleExportImage() {
      graphFunc.exportImg(
        (dataUri) => {
          DataUri.downloadDataUri(dataUri, this.item[0].value + '.png')
        },
        {
          padding: 100
        }
      )
    },
    handleExport(cb) {
      const { ok, errs } = graphFunc.graphValidate()
      if (ok) {
        const { nodesJSON, edgesJSON } = graphFunc.exportData()
        cb(false, { nodesJSON, edgesJSON }, this.changedData)
      } else {
        this.$message.error(errs[0])
      }
    },
    handleOnlyLook() {
      this.disabled = !this.disabled
      graphFunc.onlyLook(this.disabled)
    },
    // 渲染节点函数
    handleSwitchDefault(data) {
      let nodesJSON, edgesJSON
      if (data) {
        nodesJSON = data.nodesJSON
        edgesJSON = data.edgesJSON
      } else {
        nodesJSON = JSON.parse(localStorage.getItem('nodesJSON'))
        edgesJSON = JSON.parse(localStorage.getItem('edgesJSON'))
      }
      if (nodesJSON && edgesJSON) {
        graphFunc.initDefaultData(nodesJSON, edgesJSON)
      }
    },
    handleTestError() {
      graphFunc.initDefaultData()
    },
    handleUpdateLabel() {
      graphFunc.updateNode(this.form)
      this.form.label = ''
      this.isUpdate = false
    },
    listener() {
      graphFunc.GraphListener.doubleNodeClick((detail) => {
        this.form.label = detail.label
        this.isUpdate = true
        console.log('[debug]detail:', detail)
      })
      graphFunc.GraphListener.runtimeError((err) => {
        console.log('[debug]errorCode, errorMsg:', err.errorCode, err.errorMsg)
      })
    }
  },
  created() {
    // this.handleSwitchDefault();
    this.init()
    this.listener()
  }
}
</script>
<style lang='sass'>
</style>
<style  lang='sass' scoped>
@import '~x6-editor-fra/lib/x6-editor-fra.css'
.x6
  height: 93vh
#container
  height: 100% !important

@media(min-width: 1904px)
  .x6Dialog
    max-width: 100% !important
    padding: 0
</style>
