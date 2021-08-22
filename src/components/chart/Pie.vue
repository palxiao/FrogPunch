<!-- 饼图 -->
<template>
  <div style="width:100%">
    <canvas v-show="show" style="width: 100%;height: auto;" id="pie"></canvas>
    <div v-if="show" class="flex-layout column-defalut tip-box">
      <p class="line-clamp-1 title">{{ title }}</p>
      <p class="desc">{{ desc }}</p>
    </div>
    <div v-else class="placeholder">
      <van-empty image="search" description="这一天没有打卡哦" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
// import F2 from '@antv/f2/lib/index-all'
const F2 = (window as any).F2
import { Empty } from 'vant'
@Component({
  components: {
    [Empty.name]: Empty
  },
})
export default class Name extends VueBase {
  private show: boolean = true
  private init: boolean = false
  private title: string = '打卡'
  private desc: string = ''
  @Prop()
  private data!: Type.Object

  private async mounted() {
    await this.$nextTick()
    this.init = true
  }
  private reRender() {
    const that = this
    const keys: string[] = []
    for (const key in this.data[0]) {
      if (this.data[0].hasOwnProperty(key)) {
        keys.push(key)
      }
    }
    const chart = new F2.Chart({
      id: 'pie',
      pixelRatio: window.devicePixelRatio,
    })

    chart.source(that.data)
    chart.coord('polar', {
      transposed: true,
      radius: 0.9,
      innerRadius: 0.5,
    })
    chart.axis(false)
    chart.legend(false)
    chart.tooltip(false)
    chart.guide().html({
      position: ['50%', '50%'],
      html: `<p></p>`,
    })
    chart
      .interval()
      .position('const*cost')
      .adjust('stack')
      .color('type', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14'])
    chart.pieLabel({
      sidePadding: 30,
      activeShape: true,
      label1: (data: Type.Object) => {
        return {
          text: (data[keys[1]] / 60000).toFixed(2) + ' min',
          fill: '#343434',
          fontWeight: 'bold',
        }
      },
      label2: (data: Type.Object) => {
        return {
          text: data.type,
          fill: '#999',
        }
      },
      onClick: (ev: Type.Object) => {
        const data = ev.data
        if (data) {
          that.title = data[keys[0]]

          that.desc = (data[keys[1]] / 60000).toFixed(2) + '分钟'
        }
      },
    })
    // if (this.chart) chart.destroy();
    chart.render()
  }

  @Watch('data', { immediate: true, deep: true })
  private onPieChanged(val: any, oldVal: any) {
    if (!this.init) {
      return
    }
    if (val.length > 0) {
      this.show = true
      this.reRender()
    } else {
      this.show = false
      this.reRender()
    }
  }
}
</script>
<style scoped lang="less">
.tip-box {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -75px;
  margin-top: -19px;
  text-align: center;
  width: 150px;
  height: 50px;
  .title {
    font-size: 12px;
    color: #999;
    margin: 0;
    width: 54px;
  }
  .desc {
    font-size: 12px;
    color: #343434;
    margin: 4px 0 0 0;
    font-weight: bold;
  }
}
.placeholder {
  text-align: center;
  padding-bottom: 1rem;
}
</style>
