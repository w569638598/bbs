<template>
  <v-container class="pa-0 mb-5" >
    <!-- <div class="d-flex justify-space-between text-center"> -->
      <v-row class="text-center">
        <v-col cols="3">
          <v-sheet
            class="rounded-lg py-2"
            color="#48c774"
          >
            <router-link :to="{path:'/LMind'}">
              <section style="color:#fff;">
                <i class="fa fa-sitemap fa-4x"></i>
                <p style="font-size:1.25rem;" class="subtitle mt-5">训练科学思维</p>
              </section>
            </router-link>
          </v-sheet>
        </v-col>
        <v-col cols="3">
          <v-sheet
            class=" rounded-lg py-2"
            color="#ffdd57"
          >
            <router-link :to="{path:'/onlineLearn/OnlineLearn'}">
              <section style="color:#000;">
                <i class="fa fa-users fa-4x"></i>
                <p style="font-size:1.25rem;" class="subtitle mt-5">在线学习</p>
              </section>
            </router-link>
          </v-sheet>
        </v-col>
        <v-col cols="3">
          <v-sheet
            class=" rounded-lg py-2"
            color="#f14668"
          >
            <router-link :to="{ path: '/Answer' }">
              <section style="color:#fff;">
                <i class="fa fa-question-circle-o fa-4x"></i>
                <p style="font-size:1.25rem;" class="subtitle mt-5">直通杨老师</p>
              </section>
            </router-link>
          </v-sheet>
        </v-col>
        <v-col cols="3">
          <v-sheet
            class="rounded-lg py-2"
            color="#167df0"
          >
            <router-link :to="{path:'/Notes'}">
              <section style="color:#fff;">
                <i class="fa fa-thumbs-up fa-4x"></i>
                <p style="font-size:1.25rem;" class="subtitle mt-5">咨询札记</p>
              </section>
            </router-link>
          </v-sheet>
        </v-col>
      </v-row>
    <!-- </div> -->
  </v-container>
</template>

<script>
export default {
  name: 'Panel'
}
</script>

<style scoped>
a{
  text-decoration:none;
}
</style>
