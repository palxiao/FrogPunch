<!-- 生之钟 -->
<template>
  <div @click="toList" class="target" :style="{ 'margin-top': mt + 'px' }">
    <!-- <div class="flex-layout fs-16">    </div> -->
    <van-divider :dashed="true" :style="styleObj"><span class="title">我的小目标</span></van-divider>
    <div @click.stop="$refs.wordCloud.reRender()">
      <word-cloud ref="wordCloud" />
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
  import VueBase from '@/vueBase'
  import { Progress } from 'vant'
  import { WordCloud } from '@/components/chart'
  @Component({
    components: { WordCloud, [Progress.name]: Progress },
  })
  export default class Target extends VueBase {
    public styleObj: {} = { color: '#ffffff', borderColor: '#ffffff' }
    public get mt(): number {
      const radio = this.$getters.windowWidth / 375
      return 50 * radio
    }

    public get now(): Type.Object {
      return this.$getters.nowObj
    }

    private async mounted() {
      await this.$nextTick()
    }

    private toList() {
      this.$router.push('/target')
    }
  }
</script>
<style scoped lang="less">
  .target {
    background: rgba(0, 0, 0, 0.18);
    padding: 0.5rem 8% 2rem 8%;
    border-radius: 20px;
    // position: absolute;
    width: 84%;
    margin-left: 8%;
    color: #ffffff;
    .title {
      text-decoration: underline;
    }
  }
</style>
