<template>
  <v-footer fixed id="dashboard-core-footer" style="background-color: #eee;">
    <v-container>
      <div class="d-flex justify-center align-center ">
        <p class="pt-md-0 text-center mr-1 grey--text lighten-2">京ICP2021017281</p>
        <p class="pt-md-0 text-center grey--text lighten-4">{{`&copy;${new Date().getFullYear()}北京华创`}}</p>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'Foorter'
}
</script>

<style lang="sass">
  #dashboard-core-footer
    height: 50px
    a
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
