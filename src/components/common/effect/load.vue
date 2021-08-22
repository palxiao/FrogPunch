<!-- 载入效果 -->
<template>
    <div :class="loadClass" class='flex-layout'>
        <span class="title">{{slogan}}</span>
    </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
@Component({
  components: {},
})
export default class Name extends VueBase {
  @Prop(String)
  private slogan!: string
  private loadClass: string = 'white-bg'
  // get computed() { return 'computed' }
  private async mounted() {
    await this.$nextTick()
    setTimeout(() => {
      this.loadClass = 'hide'
    }, 1000);
  }
  // @Emit('change')
  // private change(e: MouseEvent) {}
  // @Watch('field', { immediate: true, deep: true })
  // private onPersonChanged(val: string, oldVal: string) {}
}
</script>
<style scoped lang='less'>
.white-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999999;
  top: 0;
  background: #ffffff;
  .title {
    animation: show 1s ease-in;
  }
}
@keyframes show {
  0% { color: #ffffff; font-size: 22px; }
  25% { color: rgba(0,0,0,.15) }
  50% { color: rgba(0,0,0,.28) }
  75% { color: rgba(0,0,0,.47); }
  85% { color: rgba(0,0,0,.69); font-size: 22px; }
  100% { color: rgba(0,0,0,.8); font-size: 12px; }
}

.hide {
  display: none;
}
</style>