<!--  -->
<template>
    <van-popup v-model="popupShow" position="bottom" :style="{ height: '35%' }">
        <van-panel>
            <div style="padding:1.7rem 1rem;" slot="header">
                <van-button plain icon="delete" @click="del" class="fl-left" size="small"><span class="black-05">撕掉便签</span></van-button>
                <van-button @click="confirm" class="fl-right" type="info" size="small">确定</van-button>
            </div>
            <div class="fl-clear"></div>
            <div>
                <van-field v-model="curText" rows="2" autosize type="textarea" maxlength="40" placeholder="万千思绪，稍纵即逝 .." show-word-limit />
            </div>
        </van-panel>
    </van-popup>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
import { Dialog, Panel } from 'vant'
@Component({
  components: { [Panel.name]: Panel },
})
export default class StickerEdit extends VueBase {
  @Prop(Boolean)
  private value!: boolean
  @Prop(String)
  private text!: string
  private popupShow: boolean = false
  private curText: string = ''
  // get computed() { return 'computed' }
  private async mounted() {
    await this.$nextTick()
  }
  private confirm() {
    this.$emit('confirm', this.curText)
    this.curText = ''
    this.popupShow = false
  }
  private del() {
    const that = this
    Dialog.confirm({
      message: '移除这条便签',
      async beforeClose(action, done) {
        if (action === 'confirm') {
          that.popupShow = false
          //   await that.$ajax.note.del(item[index].id);
          that.$emit('del')
        }
        done()
      },
    })
  }

  @Watch('text', { immediate: true, deep: true })
  private onTextChanged(val: string) {
    this.curText = val
  }
  @Watch('value', { immediate: true, deep: true })
  private onDataChanged(val: boolean) {
    this.popupShow = val
  }
  @Watch('popupShow', { immediate: true, deep: true })
  private onPopupShowChanged(val: boolean) {
    this.$emit('input', val)
  }
}
</script>
<style scoped lang='less'>
</style>