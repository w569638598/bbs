<template>
  <v-menu
    bottom
    left
    offset-y

    origin="top right"
    transition="scale-transition"
    max-width="300"
    close-delay="200"
    :close-on-content-click="false"
  >
  <!-- open-on-hover -->
    <template v-slot:activator="{ attrs, on }">
      <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
        <v-badge color="red" overlap bordered>
          <template v-slot:badge>
            <span>{{msgTotal}}</span>
          </template>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-list width="250" tile nav dense>
      <v-subheader class="subtitle-2 ml-5">系统通知</v-subheader>
      <v-list-item-group v-model="selectedItem" color="secondary">
        <v-list-item v-for="(m, i) in announcement2" :key="i" link class="py-0">
          <v-list-item-content @click="showAnnouncement(m)">
            <v-list-item-title class="text-subtitle-2  text-blue text-lighten-5">{{ m.titile }}</v-list-item-title>
            <v-list-item-subtitle>{{m.createTime}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-list-item class="pa-0 justify-center">
        <v-btn outlined small color="indigo" block :to="{path:'/system/UserAnnouncementList'}">
          查看更多
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { getAction, putAction } from '@/api/manage'
import store from '@/store/'
import { mapGetters } from 'vuex'
export default {
  name: 'DynamicNotice',
  data() {
    return {
      selectedItem: '',
      loadding: false,
      url: {
        listCementByUser: '/sys/annountCement/listByUser',
        editCementSend: '/sys/sysAnnouncementSend/editByAnntIdAndUserId',
        queryById: '/sys/annountCement/queryById'
      },
      hovered: false,
      announcement1: [],
      announcement2: [],
      msg1Count: '0',
      msg2Count: '0',
      msg1Title: '系统消息(0)',
      msg2Title: '',
      stopTimer: false,
      websock: null,
      lockReconnect: false,
      heartCheck: null,
      formData: {},
      openPath: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    msgTotal() {
      return parseInt(this.msg1Count) + parseInt(this.msg2Count)
    }
  },
  mounted() {
    this.loadData()
    this.initWebSocket()
    this.heartCheckFun()
  },
  destroyed: function() { // 离开页面生命周期函数
    this.websocketOnclose('destroyed')
  },
  methods: {
    timerFun() {
      this.stopTimer = false
      const myTimer = setInterval(() => {
        // 停止定时器
        if (this.stopTimer === true) {
          clearInterval(myTimer)
          return
        }
        this.loadData()
      }, 6000)
    },
    loadData() {
      try {
        // 获取系统消息
        getAction(this.url.listCementByUser).then((res) => {
          if (res.success) {
            this.announcement1 = res.result.anntMsgList
            this.msg1Count = res.result.anntMsgTotal
            this.msg1Title = '系统消息(' + res.result.anntMsgTotal + ')'
            this.announcement2 = JSON.parse(JSON.stringify(res.result.sysMsgList))
            this.msg2Count = res.result.sysMsgTotal
            this.msg2Title = '通知(' + res.result.sysMsgTotal + ')'
          }
        }).catch(error => {
          console.log('系统消息通知异常', error)// 这行打印permissionName is undefined
          this.stopTimer = true
          console.log('清理timer')
        })
      } catch (err) {
        this.stopTimer = true
        console.log('通知异常', err)
      }
    },
    fetchNotice() {
      if (this.loadding) {
        this.loadding = false
        return
      }
      this.loadding = true
      setTimeout(() => {
        this.loadding = false
      }, 200)
    },
    showAnnouncement(record) {
      putAction(this.url.editCementSend, { anntId: record.id }).then((res) => {
        if (res.success) {
          this.loadData()
        }
      })
      this.hovered = false
      if (record.openType === 'component') {
        this.openPath = record.openPage
        this.formData = { id: record.busId }
        this.toHandle(record)
        // this.$refs.showDynamNotice.detail(record.openPage)
      } else {
        this.toHandle(record)
        // this.$refs.ShowAnnouncement.detail(record)
      }
    },
    toHandle(record) {
      console.log(record)
      if (record.openType === 'url') {
        this.$router.push({ path: record.openPage })
      }
    },
    toMyAnnouncement() {
      this.$router.push({
        path: '/system/UserAnnouncementList'
      })
    },
    modalFormOk() {
    },
    handleHoverChange(visible) {
      this.hovered = visible
    },

    initWebSocket: function() {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      var userId = store.getters.userInfo.id
      var url = (window._CONFIG['domianURL']).replace('https://', 'wss://').replace('http://', 'ws://') + '/websocket/' + userId
      this.websock = new WebSocket(url)
      this.websock.onopen = this.websocketOnopen
      this.websock.onerror = this.websocketOnerror
      this.websock.onmessage = this.websocketOnmessage
      this.websock.onclose = this.websocketOnclose
    },
    websocketOnopen: function(res) {
      console.log('WebSocket连接成功', res)
      // 心跳检测重置
      this.heartCheck.reset().start()
    },
    websocketOnerror: function(e) {
      console.log('WebSocket连接发生错误')
      this.reconnect()
    },
    websocketOnmessage: function(e) {
      var data = eval('(' + e.data + ')') // 解析对象
      if (data.cmd === 'topic') {
        // 系统通知
        this.loadData()
      } else if (data.cmd === 'user') {
        // 用户消息
        this.loadData()
      }
      // 心跳检测重置
      this.heartCheck.reset().start()
    },
    websocketOnclose: function(e) {
      console.log('connection closed (' + e + ')')
      if (e) {
        console.log('connection closed (' + e.code + ')')
      }
      e !== 'destroyed' && this.reconnect()
    },
    websocketSend(text) { // 数据发送
      try {
        this.websock.send(text)
      } catch (err) {
        console.log('send failed (' + err.code + ')')
      }
    },
    reconnect() {
      var that = this
      if (that.lockReconnect) return
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function() {
        console.info('尝试重连...')
        that.initWebSocket()
        that.lockReconnect = false
      }, 30000)
    },
    heartCheckFun() {
      var that = this
      // 心跳检测,每20s心跳一次
      that.heartCheck = {
        timeout: 20000,
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function() {
          clearTimeout(this.timeoutObj)
          // clearTimeout(this.serverTimeoutObj);
          return this
        },
        start: function() {
          // var self = this
          this.timeoutObj = setTimeout(function() {
            // 这里发送一个心跳，后端收到后，返回一个心跳消息，
            // onmessage拿到返回的心跳就说明连接正常
            that.websocketSend('HeartBeat')
            // self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
            //  that.websock.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            // }, self.timeout)
          }, this.timeout)
        }
      }
    },
    showDetail(key, data) {
      // this.$notification.close(key)
      var id = data.msgId
      getAction(this.url.queryById, { id: id }).then((res) => {
        if (res.success) {
          var record = res.result
          this.showAnnouncement(record)
        }
      })
    }
  }
}
</script>
