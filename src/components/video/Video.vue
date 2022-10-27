<template>
  <video-player
    class="video-player-box"
    ref="videoPlayer"
    :options="playerOptions"
    :playsinline="true"
    customEventName="customstatechangedeventname"
    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"
    @statechanged="playerStateChanged($event)"
    @ready="playerReadied">
  </video-player>
</template>

<script>
import 'video.js/dist/video-js.css'

import { videoPlayer } from 'vue-video-player'
export default {
  name: 'VueVideo',
  components: {
    videoPlayer
  },
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      playerOptions: {
        muted: true,
        language: 'zh-CN',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: this.src
        }],
        poster: '/static/images/author.jpg'
      }
    }
  },
  mounted() {
    // console.log('this is current player instance object', this.player)
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    }
  }
}
</script>
<style >
.video-player-box .vjs-big-play-button {
   top: 50%;
   left: 50%;
   margin-left: -1.5em;
   margin-top: -1em!important;
}
.video-player-box .video-js{
  width: 100%;
}
</style>
