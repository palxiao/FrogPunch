<!-- 思维便签 -->
<template>
  <div class=''>
    <van-nav-bar title="思维便签" left-text="返回" @click-left="help" @click-right="add">
      <template #left>
        <van-icon name="question-o" size="26" />
      </template>
      <template #right>
        <van-icon name="add-o" size="26" />
      </template>
    </van-nav-bar>

    <stickers ref="sticker" @updateData="updateData" :list='things' />

    <effect-load slogan="快速记录想法" />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
import effectLoad from '@/components/common/effect/load.vue'
import stickers from '@/components/business/stickers/Stickers.vue'
import { Icon, Dialog } from 'vant'
Vue.use(Icon)
@Component({
  components: { effectLoad, stickers },
})
export default class Name extends VueBase {
  private things: Type.Object = []
  private updateFlag: boolean = false
  // get computed() { return 'computed' }
  private beforeCreate() {
    const win = window as any
    win.Global_Index_Count_Temp = 1
  }
  private async mounted() {
    this.$commit('loading', '碎片导出中..')
    await this.$nextTick()
    this.things = await this.$ajax.user.getMemoList()
    setTimeout(() => {
      this.updateFlag = true // 变为可编辑状态，自动监听并更新
      this.$commit('loading', false)
    }, 100)
  }
  private updateData(type: string, index: number, obj: Type.Object) {
    switch (type) {
      case 'edit':
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            this.things[index][key] = obj[key]
          }
        }
        break
      case 'del':
        this.things.splice(index, 1)
        break
    }
  }
  private help() {
    Dialog({ message: '随意拖动便签，长按可以编辑' })
  }
  private add() {
    this.things.push({ left: 12, top: 60, text: '' })
    const sticker = this.$refs.sticker as any
    sticker.edit(this.things.length - 1, '')
  }
  // @Emit('change')
  // private change(e: MouseEvent) {}
  @Watch('things', { immediate: true, deep: true })
  private onChanged(val: string, oldVal: string) {
    if (this.updateFlag) {
      this.$ajax.user.updateMemo({ data: this.things })
    }
  }
}
</script>
<style scoped lang='less'>
</style>