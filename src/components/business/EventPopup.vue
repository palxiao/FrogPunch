<!-- 事件选择组件 -->
<template>
  <van-popup v-model="popupShow" @open="openPopup" @close="closePopup" :duration="0.4" round position="bottom" :safe-area-inset-bottom="true" :style="{ height: '40%' }" get-container="body">
    <van-divider content-position="center" :style="{ borderColor: '#07c160' }">{{title || '请选择任务事件'}}</van-divider>
    <div class="popup-list" style="overflow：auto">
      <van-tag v-for="(tag, i) in tags" :key="i" :color="tag.color || defaultColor" :text-color="tag.textColor" :plain="tag.plain" size="large" class="label-item" @click="clickTag(tag)">{{ tag.name }}</van-tag>
    </div>
    <div v-if="!hideBtn" class="mission-btn-wrap">
      <van-button @click="clickBtn" type="info" block class="popup-btn"> <van-icon class="plus" name="plus" />创建并开始任务</van-button>
    </div>
  </van-popup>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
  import VueBase from '@/vueBase'
  import { Tag, Icon } from 'vant'
  @Component({
    components: {
      [Tag.name]: Tag,
      [Icon.name]: Icon,
    },
  })
  export default class EventPopup extends VueBase {
    public defaultColor: string = '#f2826a'
    @Prop(Boolean)
    private value: boolean = false
    @Prop(Boolean)
    private hideBtn!: boolean
    @Prop(String)
    private title!: string
    // get popupShow() { return this.value }
    private popupShow: boolean = false

    private async mounted() {
      await this.$nextTick()
      // 初始化事件列表
      this.$ajax.home.eventList({}).then((list: Ajax.Result) => {
        const r = list.length > 0 && this.$commit('updateTags', list)
      })
    }

    get tags() {
      return this.$getters.taskTags
    }

    private openPopup() {
      this.$emit('open')
    }
    private closePopup() {
      this.$emit('close')
      this.$emit('input', false)
    }
    private clickTag(tag: Type.Object) {
      this.$emit('select', tag)
    }
    private clickBtn() {
      this.$emit('btn')
    }
    // @Emit('change')
    // private change(e: MouseEvent) {}
    @Watch('value', { immediate: true, deep: true })
    private onShowChanged(val: any, oldVal: any) {
      this.popupShow = val
    }
  }
</script>
<style scoped lang="less">
  .popup-list {
    padding: 0 0 5.8rem 0;
  }
  .label-item {
    margin: 0 0 1rem 1rem;
  }
  .mission-btn-wrap {
    position: fixed;
    bottom: 0;
    z-index: 9999;
    left: 0;
    width: 100%;
    background: #ffffff;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    background-attachment: fixed;
  }
  .popup-btn {
    width: 94%;
    border-radius: 6px;
    margin: 0 3% 1rem 3%;
    .plus {
      font-size: 16px;
      position: absolute;
      top: 12px;
      margin-left: -20px;
    }
  }
</style>
