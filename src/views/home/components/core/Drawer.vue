<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    mobile-breakpoint="960"
    width="260"
    :src="barImage"
    v-bind="$attrs"
    disable-resize-watcher
    disable-route-watcher
    temporary
    fixed
  >
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>

    <v-divider class="mb-1" />

    <v-list dense nav>
      <v-list-item @click="handleUser">
        <v-list-item-avatar class="align-self-center" color="white" contain>
          <v-img
            :src="baseURL + '/sys/common/static/' + userInfo().avatar"
            max-height="30"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="display-1"
            v-text="userInfo().realname || '未登陆'"
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <div />
      <template v-for="(item, i) in computedItems">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
        </base-item-group>
        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
      <div />
      <!-- <span
        @click="dy"
        style="display: block; color: white; margin: 6px 0 6px 12px"
        href="https://www.wjx.cn/vm/eULtny1.aspx"
        >调研</span
      > -->
      <span
        @click="ks"
        style="display: block; color: white; margin: 6px 0 6px 12px"
        href="https://ks.wjx.top/vm/P4C5kQh.aspx"
        >考试</span
      >
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "DashboardCoreDrawer",
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    items: [
      {
        icon: "fa fa-home",
        title: "主页",
        to: "/dashboard",
      },
      {
        icon: "fa fa-user-o",
        title: "学习论坛",
        to: "/BBS",
      },
      {
        icon: "fa fa-users",
        title: "在线学习",
        to: "/onlineLearn/OnlineLearn",
      },
      {
        icon: "fa fa-question-circle-o",
        title: "直通杨老师",
        to: "/Answer",
      },
      {
        title: "点检会",
        icon: "fa fa-line-chart",
      },
      {
        title: "客户周报",
        icon: "fa mdi-file-chart-outline",
        to: "/cgformList",
      },
      {
        title: "咨询札记",
        icon: "fa fa-thumbs-up",
        to: "/Notes",
      },
      {
        title: "清障看板v1",
        icon: "fa fa-thumbs-up",
        to: "/qzkbv1",
      },
      {
        title: "清障看板v2",
        icon: "fa fa-thumbs-up",
        to: "/obstacle",
      },
      {
        title: "感知、行动、启发",
        icon: "fa fa-thumbs-up",
        to: "/perception",
      },
      // {
      //   title: '调研',
      //   icon: 'fa fa-thumbs-up',
      //   to: 'https://www.wjx.cn/vm/eULtny1.aspx'
      // },
      // {
      //   title: '考试',
      //   icon: 'fa fa-thumbs-up',
      //   to: 'https://ks.wjx.top/vm/P4C5kQh.aspx'
      // }
    ],
    barImage: require("@/assets/sidebar.jpg"),
    barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",
    baseURL: "",
  }),
  computed: {
    drawer: {
      get() {
        return this.$store.state.seting.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    computedItems() {
      return this.items.map(this.mapItem);
    },
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.drawer = false;
      },
      deep: true,
    },
  },
  methods: {
    dy() {
      if (!this.isLogin()) {
        alert("请登录");
        return;
      }
      window.open("https://www.wjx.cn/vm/eULtny1.aspx", "调研");
    },
    ks() {
      if (!this.isLogin()) {
        alert("请登录");
        return;
      }
      window.open("https://ks.wjx.top/vm/P4C5kQh.aspx", "考试");
    },
    isLogin() {
      return localStorage.getItem("pro__Access-Token");
    },
    ...mapGetters(["userInfo"]),
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      };
    },
    handleUser() {
      if (!this.userInfo().username) {
        this.$router.push("/login");
        this.drawer = false;
      }
    },
  },
  created() {
    this.baseURL = window._CONFIG["domianURL"];
  },
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  .v-list-group__header.v-list-item--active:before
    opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
          margin-right: 24px
          margin-left: 12px !important

        +rtl()
          margin-left: 24px
          margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
          padding-left: 8px

        +rtl()
          padding-right: 8px

      .v-list-group__header
        +ltr()
          padding-right: 0

        +rtl()
          padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
            margin-right: 8px

          +rtl()
            margin-left: 8px
</style>
