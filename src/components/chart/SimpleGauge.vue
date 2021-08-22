<!-- 半圆进度条 -->
<template>
  <div style="width:100%">
    <canvas id="simple-gauge" class="simple-gauge"></canvas>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import VueBase from '@/vueBase'
  // import F2 from '@antv/f2/lib/index-all';
  const F2 = (window as any).F2
  @Component({
    components: {},
  })
  export default class SimpleGauge extends VueBase {
    @Prop()
    private actual!: number

    private canWidth: number = 375
    private canHeight: number = 160
    private radio: number = document.body.clientWidth / 375
    private chart: any = null

    //   public get currentData(): Type.Object {
    //     this.data.forEach((item: Type.Object) => {
    //
    //     });
    //     return this.data;
    //   }

    private async mounted() {
      await this.$nextTick()
      this.reRender()
    }

    private reRender() {
      const that = this

      const _F = F2
      const Shape = _F.Shape
      const G = _F.G
      const Util = _F.Util
      const Global = _F.Global
      const Vector2 = G.Vector2

      // 极坐标下带圆角的柱子，只对极坐标生效

      Shape.registerShape('interval', 'polar-tick', {
        draw: function draw(cfg: Type.Object, container: Type.Object) {
          const points = this.parsePoints(cfg.points)
          const style = Util.mix(
            {
              stroke: cfg.color,
            },
            Global.shape.interval,
            cfg.style
          )

          let newPoints = points.slice(0)
          if (this._coord.transposed) {
            newPoints = [points[0], points[3], points[2], points[1]]
          }

          const center = cfg.center
          const x = center.x
          const y = center.y

          const v = [1, 0]
          const v0 = [newPoints[0].x - x, newPoints[0].y - y]
          const v1 = [newPoints[1].x - x, newPoints[1].y - y]
          const v2 = [newPoints[2].x - x, newPoints[2].y - y]

          let startAngle = Vector2.angleTo(v, v1)
          let endAngle = Vector2.angleTo(v, v2)
          const r0 = Vector2.length(v0)
          const r = Vector2.length(v1)

          if (startAngle >= 1.5 * Math.PI) {
            startAngle = startAngle - 2 * Math.PI
          }

          if (endAngle >= 1.5 * Math.PI) {
            endAngle = endAngle - 2 * Math.PI
          }

          const lineWidth = r - r0
          const newRadius = r - lineWidth / 2

          return container.addShape('Arc', {
            className: 'interval',
            attrs: Util.mix(
              {
                x,
                y,
                startAngle,
                endAngle,
                r: newRadius,
                lineWidth,
                lineCap: 'round',
              },
              style
            ),
          })
        },
      })

      const actual = this.actual
      const data = [
        {
          const: 'a',
          actual,
          expect: 100,
        },
      ]
      const chart = new F2.Chart({
        id: 'simple-gauge',
        padding: [0, 30, 18],
        pixelRatio: window.devicePixelRatio,
        width: this.canWidth * this.radio,
        height: this.canHeight * this.radio,
      })
      chart.source(data, {
        actual: {
          max: 100,
          min: 0,
          nice: false,
        },
      })
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.8,
        startAngle: -Math.PI,
        endAngle: 0,
      })
      chart.axis(false)
      chart
        .interval()
        .position('const*expect')
        .shape('polar-tick')
        .size(10)
        .color('rgba(80, 143, 255, 0.95)')
        .animate(false) // 背景条
      chart
        .interval()
        .position('const*actual')
        .shape('polar-tick')
        .size(10)
        .color('#fff')
        .animate({
          appear: {
            duration: 1100,
            easing: 'linear',
            animation: function animation(shape: Type.Object, animateCfg: any) {
              const startAngle = shape.attr('startAngle')
              let endAngle = shape.attr('endAngle')
              if (startAngle > endAngle) {
                // -Math.PI/2 到 0
                endAngle += Math.PI * 2
              }
              shape.attr('endAngle', startAngle)
              shape
                .animate()
                .to(
                  Util.mix(
                    {
                      attrs: {
                        endAngle,
                      },
                    },
                    animateCfg
                  )
                )
                .onUpdate((frame: number) => {
                  // const thatEl = that.$refs.text as Type.Object;
                  try {
                    const thatEl = document.getElementById('simple-gauge-text') as Type.Object
                    thatEl.innerHTML = `${(frame * actual).toFixed(0)}%`
                  } catch (e) {
                    //
                  }
                })
            },
          },
        }) // 实际进度
      if (!document.getElementById('simple-gauge-text')) {
        chart.guide().html({
          position: ['50%', '80%'],
          html: '<div style="width: 120px;color: #fff;white-space: nowrap;text-align:center;">' + '<p style="font-size: 18px;margin:0;">目标完成度</p>' + '<p id="simple-gauge-text" style="font-size: 48px;margin:0;font-weight: bold;">0</p>' + '</div>',
        })
      }

      chart.render()
      this.chart = chart
    }

    @Watch('actual', { immediate: true, deep: true })
    private async onActualChanged(val: any, oldVal: any) {
      if (val > 0 && this.chart) {
        await this.$nextTick()
        this.reRender()
      }
    }
  }
</script>
<style scoped lang="less">
  canvas.simple-gauge {
    border-radius: 5px;
    background-color: #1890ff;
    background-image: linear-gradient(#246bff, #2797ff);
  }
</style>
