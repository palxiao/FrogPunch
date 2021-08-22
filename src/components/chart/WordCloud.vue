<!-- 词云 -->
<template>
  <div style="width:100%">
    <div v-show="currentData.length <= 0" class="word_cloud-none">不如点下 --我的小目标-- 吧</div>
    <canvas ref="wordCloud" id="word"></canvas>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import VueBase from '@/vueBase'
  const F2 = (window as any).F2
  @Component({
    components: {},
  })
  export default class WordCloud extends VueBase {
    @Prop()
    private data!: Type.Object

    private canWidth: number = 254
    private canHeight: number = 160
    private radio: number = document.body.clientWidth / 375

    private currentData: Type.Object[] = [] // 临时变量
    // public get currentData(): Type.Object {
    //   this.data.forEach((item: Type.Object) => {
    //   });
    //   return this.data;
    // }

    private async mounted() {
      await this.$nextTick()

      // 给point注册一个词云的shape
      const Util = F2.Util
      const that = this
      F2.Shape.registerShape('point', 'cloud', {
        draw: function draw(cfg: any, container: any) {
          const attrs = that.getTextAttrs(cfg)
          const x = cfg.x
          const y = this._coord.y.start - cfg.y
          return container.addShape('text', {
            attrs: Util.mix(attrs, { x, y }),
          })
        },
      })
      this.reRender()
      // setInterval(() => {this.reRender();},2000)
    }

    private async getTargetList() {
      // TODO：后期应该抽成状态管理，避免多次请求
      return await this.$ajax.target.getList()
    }

    private async reRender() {
      const res = await this.getTargetList()
      const data = res ? res.map((item: Ajax.Result) => {
        const newItem: Type.Object = {}
        { [newItem.category, newItem.value, newItem.x] = [item.id + '', Math.random(), item.name] }
        return (item = newItem)
      }) : []
      this.currentData = data

      const DataSet = (window as Type.Object).DataSet
      const dv = new DataSet.View().source(data)
      const range = dv.range('value')
      const min = range[0]
      const max = range[1]
      const MAX_FONTSIZE = 32 // 最大的字体
      const MIN_FONTSIZE = 14 // 最小的字体
      // const thatEl = this.$refs.wordCloud as Type.Object;
      // const canvasWidth = thatEl.width // 获取画布宽度
      // const canvasHeight = thatEl.height // 获取画布高度
      const canvasWidth = this.canWidth * this.radio // 获取画布宽度
      const canvasHeight = this.canHeight * this.radio // 获取画布高度

      // 生成词云的布局
      dv.transform({
        type: 'tag-cloud',
        fields: ['x', 'value'],
        size: [canvasWidth, canvasHeight], // 同 canvas 画布保持一致
        font: 'Verdana',
        padding: 0,
        timeInterval: 5000, // max execute time
        rotate: function rotate() {
          // tslint:disable-next-line: no-bitwise
          let random = ~~(Math.random() * 4) % 4
          if (random === 2) {
            random = 0
          }
          return random * 90 // 0, 90, 270
        },
        fontSize: function fontSize(d: any) {
          if (d.value) {
            return ((d.value - min) / (max - min)) * (MAX_FONTSIZE - MIN_FONTSIZE) + MIN_FONTSIZE
          }
          return 0
        },
      })

      // test
      const that = this
      const chart = new F2.Chart({
        id: 'word',
        pixelRatio: window.devicePixelRatio,
        width: this.canWidth * this.radio,
        height: this.canHeight * this.radio,
        padding: 0,
      })
      chart.source(dv.rows, {
        x: {
          nice: false,
        },
        y: {
          nice: false,
        },
      })
      chart.legend(false)
      chart.axis(false)
      chart.tooltip(false)

      chart
        .point()
        .position('x*y')
        .color('category')
        .shape('cloud')
      chart.render()
    }

    // 获取 text 文本的图形属性
    private getTextAttrs(cfg: Type.Object) {
      const Util = F2.Util
      return Util.mix(
        {},
        {
          fillOpacity: cfg.opacity,
          fontSize: cfg.origin._origin.size,
          rotate: (cfg.origin._origin.rotate * Math.PI) / 180,
          text: cfg.origin._origin.text,
          textAlign: 'center',
          fontFamily: cfg.origin._origin.font,
          fill: cfg.color,
          textBaseline: 'Alphabetic',
        },
        cfg.style
      )
    }

    //   @Watch('data', { immediate: true, deep: true })
    //   private onColumnChanged(val: any, oldVal: any) {
    //     if (val.length > 0) {
    //       this.reRender();
    //     }
    //   }
  }
</script>
<style scoped lang="less">
  .word_cloud-none {
    width: 100%;
    text-align: center;
    font-size: 13px;
    margin-top: 5rem;
    color: rgba(255, 255, 255, 0.7);
  }
</style>
