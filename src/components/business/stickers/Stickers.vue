<!-- 便利贴 -->
<template>
    <div class="stick-wrap">
        <paper @edit="edit" @move="move" v-for="(i, x) in curData" :data="i" :index="x" :key="'paper'+x" />
        <van-empty v-show="curData.length<=0" class="empty" image="search" description="思绪如清水般澄澈" />
        <edit @confirm="confirm" @del="del" v-model="popupShow" :text="text" />
    </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
import Paper from './Paper.vue'
import Edit from './Edit.vue'
import { Empty } from 'vant'
@Component({
  components: { Paper, [Empty.name]: Empty, Edit },
})
export default class Stickers extends VueBase {
  @Prop()
  private list!: Type.Object
  private popupShow: boolean = false
  private curData: Type.Object = []
  private text: string = ''
  private editIndex!: number | string
  // get computed() { return 'computed' }
  private async mounted() {
    await this.$nextTick()
  }
  private edit(i: number, val: string) {
    this.text = val
    this.editIndex = i
    this.popupShow = true
  }
  private move(index: number, x: number, y: number) {
    this.$emit('updateData', 'edit', index, { top: y, left: x })
  }
  private del() {
    this.$emit('updateData', 'del', this.editIndex)
  }
  private confirm(text: string) {
    this.$emit('updateData', 'edit', this.editIndex, { text })
  }

  @Watch('list', { immediate: true, deep: true })
  private onDataChanged(val: Type.Object) {
    this.curData = val
  }
}
</script>
<style scoped lang='less'>
// .stick-wrap {

// }
.empty {
  margin-top: 25vh;
}
</style>