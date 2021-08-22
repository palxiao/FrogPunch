<!-- 过渡效果 -->
<template>
    <div :class='transitionClass'>
        <div v-show="!hideme"><slot></slot></div>
    </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
@Component({
  components: {},
})
export default class Name extends VueBase {
//   @Prop(String)
//   private form!: string

  private transitionClass: string = ''
  private hideme: boolean = true
  // get computed() { return 'computed' }
  private async mounted() {
    await this.$nextTick()
  }
  private show() {
    setTimeout(() => {
      this.transitionClass = 'transition-circle'
      setTimeout(() => {
        this.transitionClass = ''
        this.hideme = false
      }, 600)
    }, 1200)
  }
  private close() {
      this.hideme = true
  }
  // @Emit('change')
  // private change(e: MouseEvent) {}
  //   @Watch('show', { immediate: true, deep: true })
  //   private onShowChanged(val: any, oldVal: any) {
  //       console.log(val);

  //   }
}
</script>
<style scoped lang='less'>
.transition-circle {
  position: fixed;
  width: 10vw;
  height: 10vw;
  left: 45%;
  top: 45%;
  border-radius: 50%;
  z-index: 999999;
  background: #ffffff;
  animation: strong 0.6s linear;
}
@keyframes strong {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(10);
  }
  50% {
    transform: scale(20);
  }
  75% {
    transform: scale(30);
  }
  100% {
    transform: scale(40);
  }
}
</style>