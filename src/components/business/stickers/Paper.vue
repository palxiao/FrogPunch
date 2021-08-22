<!--  -->
<template>
  <div :style="{top: y+'px', left: x+'px', zIndex}" @touchstart="focus" @touchend="leave" @touchmove="move" class="stick">
    <img :src="img">
    <p class="text">{{curData.text || ''}}</p>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
@Component({
  components: {},
})
export default class Name extends VueBase {
  @Prop()
  private data!: Type.Object
  @Prop(Number)
  private index!: number
  private zIndex: number = 0

  private Loop!: any
  private curData: Type.Object = {}
  private x: number | string = 12
  private y: number | string = 60
  private img: string = ''
  private openState: string = 'http://fp-img.palxp.com/stickers/open.png'
  private pasteState: string = 'http://fp-img.palxp.com/stickers/paste.png'

  private offsetData: Type.Object = { left: 0, top: 0 }
  // get computed() { return 'computed' }
  private async mounted() {
    await this.$nextTick()
    this.img = this.pasteState
  }
  private runEdit() {
    clearInterval(this.Loop) // 再次清空定时器，防止重复注册定时器
    this.Loop = setTimeout(() => {
      this.$emit('edit', this.index, this.curData.text)
      this.Loop = null
    }, 300)
  }
  private focus(e: any) {
    e.preventDefault()
    this.img = this.openState
    setTimeout(() => {
      const win = window as any
      win.Global_Index_Count_Temp += 1
      this.zIndex = (window as any).Global_Index_Count_Temp
    }, 10)
    this.runEdit()
    /**
     * 计算点击时的差值
     */
    const ol = e.target.parentElement.offsetLeft
    const ot = e.target.parentElement.offsetTop
    this.offsetData.left = e.targetTouches[0].pageX - ol
    this.offsetData.top = e.targetTouches[0].pageY - ot
  }
  private leave() {
    clearInterval(this.Loop)
    this.$emit('move', this.index, this.x, this.y)
    this.img = this.pasteState
  }
  private move(e: any) {
    e.preventDefault()
    if (this.Loop) {
      this.runEdit()
      this.x = e.targetTouches[0].pageX - this.offsetData.left
      this.y = e.targetTouches[0].pageY - this.offsetData.top
    }
  }

  private setData(val: Type.Object = this.data) {
    this.curData = Object.assign({}, val)
    this.x = this.curData.left
    this.y = this.curData.top
  }

  @Watch('data', { immediate: true, deep: true })
  private onDataChanged(val: Type.Object) {
    this.setData(val)
  }
}
</script>
<style scoped lang='less'>
.stick {
  position: absolute;
  img {
    width: 180px;
    height: 180px;
  }
  .text {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    width: 142px;
    height: 120px;
    position: absolute;
    top: 24px;
    left: 22px;
    word-break: break-all;
    overflow: hidden;
    font-size: 16px;
    line-height: 22px;
  }
}
</style>