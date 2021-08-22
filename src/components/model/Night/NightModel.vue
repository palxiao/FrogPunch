<template>
  <div class="bg">
    <div :style="'height:'+wh+'px'" class="meteor-body">
      <div class="main-con">
        <div v-for="star in 7" :key="star" class="shooting_star"></div>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import VueBase from '@/vueBase';
@Component({
  components: {}
})
export default class NightModel extends VueBase {
  // @Prop(Number)
  // public height!: number;

  public get wh(): number {
    return this.$getters.windowHeight;
  }
}
</script>

<style scoped lang="less">
.content {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
}
.bg {
  background: -webkit-linear-gradient(top, #000, #00002f);
  background: -o-linear-gradient(top, #000, #00002f);
  background: -moz-linear-gradient(top, #000, #00002f);
  background: linear-gradient(to top, #000, #00002f);
}
.meteor-body {
  width: 100%;
  background: transparent;
  overflow: hidden;
  z-index: 0;
  margin: 0 auto;
}
.main-con {
  width: 100%;
  height: 100%;
  position: relative;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.shooting_star {
  opacity: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  height: 3.75rem;
  width: 0.45rem;
  background: url(./meteor.png) no-repeat;
  background-size: 100% 100%;
  -webkit-animation: tail 2s ease-in-out infinite,
    shooting 2s ease-in-out infinite;
  animation: tail 2s ease-in-out infinite, shooting 2s ease-in-out infinite;
}
.shooting_star:nth-child(1) {
  top: -7%;
  left: 5%;
  height: 2.75rem;
  width: 0.25rem;
  -webkit-animation-delay: 500ms;
  animation-delay: 500ms;
}
.shooting_star:nth-child(2) {
  top: -4%;
  left: 24%;
  height: 3.35rem;
  width: 0.35rem;
  -webkit-animation-delay: 0ms;
  animation-delay: 0ms;
}
.shooting_star:nth-child(3) {
  top: 5%;
  left: 60%;
  -webkit-transform: scale(0.8);
  transform: scale(0.8);
  -webkit-animation-delay: 870ms;
  animation-delay: 870ms;
}
.shooting_star:nth-child(4) {
  top: 35%;
  left: 65%;
  -webkit-transform: scale(0.6);
  transform: scale(0.6);
  -webkit-animation-delay: 300ms;
  animation-delay: 300ms;
}

.shooting_star:nth-child(5) {
  top: 55%;
  left: 45%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-animation-delay: 658ms;
  animation-delay: 658ms;
}
.shooting_star:nth-child(6) {
  top: 65%;
  left: 75%;
  -webkit-transform: scale(0.7);
  transform: scale(0.7);
  -webkit-animation-delay: 800ms;
  animation-delay: 800ms;
}
.shooting_star:nth-child(7) {
  top: 45%;
  left: 5%;
  -webkit-transform: scale(0.7);
  transform: scale(0.7);
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
/* 动画 */
@-webkit-keyframes tail {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes tail {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes shooting {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(100px);
    transform: translateY(100px);
  }
}
@keyframes shooting {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(100px);
    transform: translateY(100px);
  }
}
</style>
