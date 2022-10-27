<template>
  <div>
    <dashboard-core-app-bar />

    <dashboard-core-drawer />

    <dashboard-core-view />
    <SpeedDial v-if="SpeedDialList.indexOf($route.path)>=0" class="hidden-sm-and-up" style="bottom:60px;" />
    <Tabbar class="hidden-sm-and-up" />
    <Foorter class="hidden-sm-and-down"/>
    <!-- <dashboard-core-settings /> -->
  </div>
</template>

<script>
import DashboardCoreAppBar from './components/core/AppBar'
import DashboardCoreDrawer from './components/core/Drawer'
import DashboardCoreSettings from './components/core/Settings'
import DashboardCoreView from './components/core/View'
import Foorter from './components/core/Footer'
import Tabbar from './components/core/Tabbar'
import SpeedDial from '@/components/tools/SpeedDial'
export default {
  name: 'DashboardIndex',
  components: {
    DashboardCoreAppBar,
    DashboardCoreDrawer,
    DashboardCoreSettings,
    DashboardCoreView,
    Foorter,
    Tabbar,
    SpeedDial
  },
  data: () => ({
    expandOnHover: false,
    SpeedDialList: ['/BBS', '/dashboard', '/Answer', '/Notes']// 需要展示SpeedDial的页面
  })
}
</script>
