<template>
  <v-app style="background-color: #eee">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>


<style>
/* @media (min-width: 1264px) {
  .container {
    max-width: none !important;
  }
}
@media (min-width: 960px) {
  .container {
    max-width: none !important;
  }
} */
@media(max-width: 400px){
  .v-data-footer__select{
    margin-left: 0 !important;
  }
  .v-data-footer__pagination{
    margin: 0 auto !important;
  }
}

</style>