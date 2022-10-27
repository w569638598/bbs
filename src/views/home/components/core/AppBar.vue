<template>
  <v-app-bar
    id="app-bar"
    class="align-center"
    dense
    app
    color="#fff"
    height="60"
    shrink-on-scroll
    scroll-target="#scrolling-techniques-7"
  >
    <v-btn
      class="mr-3 d-flex d-sm-none"
      elevation="1"
      fab
      x-small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">mdi-view-quilt</v-icon>
      <v-icon v-else>mdi-dots-vertical</v-icon>
    </v-btn>
    <v-btn
      text
      @click="() => this.$router.push('/dashboard')"
      class="hidden-sm-and-down text-h4 font-weight-bold mr-7"
      color="#167df0"
      >华创精益</v-btn
    >
    <v-tabs class="ml-n5 hidden-sm-and-down" color="#167df0" :key="getKey">
      <v-tab class="font-weight-bold" key="0" :to="{ path: '/dashboard' }">
        <v-icon style="margin-right: 5px" color="#167df0">fa fa-home</v-icon>
        主页
      </v-tab>
      <v-tab class="font-weight-bold" key="1" :to="{ path: '/BBS' }">
        <v-icon style="margin-right: 5px" color="#167df0">fa fa-user-o</v-icon>
        学习论坛
      </v-tab>
      <v-tab class="font-weight-bold" key="2">
        <v-icon style="margin-right: 5px" color="#167df0"
          >fa fa-line-chart</v-icon
        >
        点检会
      </v-tab>
      <v-tab class="font-weight-bold" key="3">
        <v-menu offset-y transition="slide-y-transition" open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <v-icon style="margin-right: 5px" color="#167df0"
                >fa fa-briefcase</v-icon
              >
              便捷工具
            </span>
          </template>
          <v-list nav dense>
            <v-list-item link :to="{ path: '/LMind' }" style="height: 40px"
              >Lmind</v-list-item
            >
            <v-list-item link :to="{ path: '/cgformList' }" style="height: 40px"
              >客户周报</v-list-item
            >
            <!-- <v-list-item link :to="{ path: '/faultdiagram'}" style="height:40px;">故障树</v-list-item> -->
            <v-list-item link :to="{ path: '/qzkbv1' }" style="height: 40px"
              >清障看板v1</v-list-item
            >
            <v-list-item link :to="{ path: '/obstacle' }" style="height: 40px"
              >清障看板v2</v-list-item
            >
            <v-list-item link :to="{ path: '/perception' }" style="height: 40px"
              >感知、行动、启发</v-list-item
            >
            <v-list-item link :to="{ path: '/causeeffect' }" style="height: 40px"
              >因果台账</v-list-item
            >
            <v-list-item link :to="{ path: '/threebenefit' }" style="height: 40px"
              >精益底层逻辑</v-list-item
            >
            <v-list-item link :to="{ path: '/five' }" style="height: 40px"
              >5WHAT</v-list-item
            >
            <v-list-item link :to="{ path: '/fiveElements' }" style="height: 40px"
              >五要素看板</v-list-item
            >
          </v-list>
        </v-menu>
      </v-tab>
      <!-- <v-tab class="font-weight-bold" key="2" @click="dy">
        <v-icon style="margin-right: 5px" color="#167df0"
          >fa fa-line-chart</v-icon
        >
        调研
      </v-tab> -->
      <v-tab class="font-weight-bold" key="4" @click="ks">
        <v-icon style="margin-right: 5px" color="#167df0"
          >fa fa-line-chart</v-icon
        >
        考试
      </v-tab>
      <v-tab class="font-weight-bold" key="5">
        <v-menu offset-y transition="slide-y-transition" open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <v-icon style="margin-right: 5px" color="#167df0"
                >fa fa-user-o</v-icon
              >
              作业管理
            </span>
          </template>
          <v-list nav dense>
            <v-list-item link :to="{ path: '/homework' }" style="height: 40px" v-if="roleStr.indexOf('gw') > -1"
              >作业发布</v-list-item
            >
            <v-list-item link :to="{ path: '/mywork' }" style="height: 40px"
              >我的作业</v-list-item
            >
            <v-list-item link :to="{ path: '/examinework' }" style="height: 40px" v-if="roleStr.search(/(gw)|(leader)/) > -1"
              >作业查看</v-list-item
            >
          </v-list>
        </v-menu>
      </v-tab>
    </v-tabs>
    <v-spacer />
    <!-- 搜索 -->
    <v-text-field
      label="搜索"
      color="secondary"
      style="max-width: 165px"
      hide-details
      @keyup.enter.native="search"
      @keyup="setT"
    >
      <!-- :label="$t('search')" -->
      <!-- <template
        v-if="$vuetify.breakpoint.mdAndUp"
        v-slot:prepend-inner
      > -->
      <template v-slot:prepend-inner>
        <v-icon @click="search(dtext)">mdi-magnify</v-icon>
      </template>
    </v-text-field>

    <v-btn
      v-if="token() == null || token() === ''"
      tile
      small
      color="success mx-2"
      :to="{ path: '/login' }"
    >
      登录
    </v-btn>

    <!-- 提醒消息 -->
    <DynamicNotice v-if="token()" />

    <!-- 个人中心 -->
    <v-menu
      v-if="token()"
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
      max-width="300"
      close-delay="200"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" class="ml-2" min-width="0" text>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list tile nav dense>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="`${baseURL}${avatar()}`"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2 text-truncate">{{
              nickname()
            }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ this.userInfo().email }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <template v-for="(item, i) in userSetting">
          <v-list-item @click="handleClick(item)" :key="i" link class="py-0">
            <v-list-item-action class="mr-1">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import DynamicNotice from './DynamicNotice'
import { VBtnToggle } from 'vuetify/lib'
import { getList } from '@/api/homework'
export default {
  name: 'DashboardCoreAppBar',
  components: {
    DynamicNotice,
    VBtnToggle
  },
  data: () => {
    return {
      value: false,
      userSetting: [
        { title: '设置中心', icon: 'fa fa-cog', to: '/member/setting/' },
        { title: '个人中心', icon: 'fa fa-user', to: '/member/home/' },
        { title: '修改密码', icon: 'fa fa-cog', to: '/member/resetPassword/' },
        { title: '退出登录', icon: 'fa fa-sign-out', to: 'logout' }
      ],
      baseURL: '',
      group: null,
      text: null,
      dtext: '',
      roleStr: ''
    }
  },
  computed: {
    ...mapState(['drawer']),
    viewlist() {
      const list = []
      let mess
      for (const i in this.messages) {
        mess = this.messages[i]
        // 当前未读，
        if (this.mode && !mess.unread) list.push(mess)
        // 当前已读
        else if (!this.mode && mess.unread) list.push(mess)
      }
      return list
    },
    getKey() {
      return this.token() || new Date().getTime()
    }
  },
  methods: {
    dy() {
      if (!this.isLogin()) {
        alert('请登录')
        return
      }
      window.open('https://www.wjx.cn/vm/eULtny1.aspx', '调研')
    },
    ks() {
      if (!this.isLogin()) {
        alert('请登录')
        return
      }
      window.open('https://ks.wjx.top/vm/P4C5kQh.aspx', '考试')
    },
    isLogin() {
      return localStorage.getItem('pro__Access-Token')
    },
    setT(e) {
      this.dtext = e.target.value
      console.log(e.target.value)
    },
    ...mapMutations({
      setDrawer: 'SET_DRAWER'
    }),
    ...mapGetters(['nickname', 'avatar', 'userInfo', 'token']),
    handleClick(item) {
      if (item.to === 'logout') {
        this.logout()
      } else {
        this.$router.push(`${item.to}${this.userInfo().username}`)
      }
    },
    logout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$message.info('退出登录成功')
        this.$router.push({ path: this.redirect || '/' })
      })
    },
    handleChangeNav(val) {
      this.text = val
    },
    search(e) {
      console.log(typeof e === 'string')
      if (typeof e === 'string') {
        this.$bus.$emit('seach', this.dtext)
        return
      }
      this.$bus.$emit('seach', e.target.value)
    }
  },
  mounted() {
    this.baseURL = window._CONFIG['staticDomainURL'] + '/'
    // 获取权限
    const user = JSON.parse(localStorage.getItem('pro__Login_Userinfo'))
    const subData = {'[]':{'Sys_role':{'id{}@':{'from':'Sys_user_role','Sys_user_role':{'@column':'role_id','group_company': user.value.groupCompany, 'user_id': user.value.id }}}}}
    getList(subData).then((res) => {
      if (res.code === 200) {
        this.roleStr = ''
        res['[]'].forEach((item) => {
          const role = item.Sys_role.role_code
          if (!role) return
          if (role === '') return
          if (this.roleStr.indexOf(role) === -1) this.roleStr += ',' + role
        })
        console.log(this.roleStr)
        // if (res['[]'].findIndex(r => r.Sys_role.role_code === 'gw') > -1) {
        //   this.roleData.zyfb = true
        //   this.roleData.zyck = true
        // }
        // if (res['[]'].findIndex(r => r.Sys_role.role_code === 'leader') > -1) this.roleData.zyck = true
      }
      localStorage.setItem('user_zy_role', this.roleStr)
    })
  }
}
</script>
<style>
#app-bar .v-toolbar__content {
  align-items: center !important;
}
</style>
