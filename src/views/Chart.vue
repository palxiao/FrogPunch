<!-- 统计 -->
<template>
  <div>
    <van-nav-bar title="统计分析" left-text="返回" right-text="分享" left-arrow @click-left="goBack" @click-right="share" />
    <div ref="share" class="flex-layout column-defalut p-b">
      <Calendar :lightDates="lightDates" @changeDate="changeDate" :css="{ margin: '1.5rem 0 .5rem 0' }" />
      <van-divider :style="{ width: '100%' }">我在这一天</van-divider>
      <Pie :data="pieDate" />
      <van-divider :style="{ width: '100%' }">最近打卡情况</van-divider>
      <label-bar :data="barData" />
      <van-divider :style="{ width: '100%' }">事件总览</van-divider>
      <Column :data="totalData" />
    </div>
    <van-popup v-model="shareShow" :duration="0.4" :style="{}">
      <div v-show="shareShow">
        <img class="share-img" :src="cardCache" alt="" />
        <div style="text-align:center;padding-bottom:10px;">长按保存或分享</div>
      </div>
    </van-popup>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
const html2canvas = (window as Type.Object).html2canvas

import { Pie, LabelBar, Column, Calendar } from '@/components/chart'
@Component({
  components: {
    Calendar,
    Pie,
    LabelBar,
    Column,
  },
})
export default class Name extends VueBase {
  private pieDate: any = []
  private barData: any = []
  private totalData: Type.Object = []
  private original!: Type.Object
  private shareShow: boolean = false
  private cardCache: string = ''
  private lightDates: Date[] = []

  private async mounted() {
    await this.$nextTick()
    this.changeDate(new Date())
    // this.queryMonthRecode()
    this.getTotal()
  }

  private async queryMonthRecode(date: Date = new Date()) {
    const res: Ajax.Gql = await this.$ajax.gql.getRecord(['create_time'], {
      date: this.$utils.dayjs(date).format('YYYY-MM-DD'),
      format: '%Y%m',
    })
    const lightDates: Date[] = []
    res.getRecord.forEach((item: Type.Object) => {
      lightDates.push(new Date(+item.create_time))
    })
    this.lightDates = lightDates
  }
  private goBack() {
    this.$router.replace('/')
  }
  private share() {
    html2canvas(this.$refs.share as HTMLElement, {
      useCORS: true,
    }).then((canvas: any) => {
      this.cardCache = canvas.toDataURL('image/jpeg', 0.9)
      this.shareShow = true
    })
  }

  private async changeDate(e: Date, getMonth: any = null) {
    if (getMonth) {
      // 只获取月度情况
      this.queryMonthRecode(e)
      return
    }
    this.pieDate = await this.getData(this.$utils.dayjs(e))
    // 最近的打卡情况：
    // const daySetAnd: any = []
    // for (let i = 0; i < 3; i++) {
    //   daySetAnd.push(this.$utils.dayjs(e).subtract(i, 'day'))
    // }
    // this.barData = await this.getMultipleData(daySetAnd)
  }
  // 请求数据处理
  private getData(date: any) {
    return new Promise((resolve) => {
      this.$ajax.gql
        .getRecord(['after_time', 'event_name'], {
          date: date.format('YYYY-MM-DD'),
        })
        .then((res: Ajax.Gql) => {
          const arr: Type.Object = []
          res.getRecord.forEach((item: Type.Object) => {
            arr.push(this.$Imap(item))
          })
          const newData = this.$Ilist(arr).groupBy((x: any) => x.get('event_name'))
          this.original = JSON.parse(JSON.stringify(newData.toArray()))
          resolve(this.process())
        })
    })
  }
  private getMultipleData(dateArr: any) {
    return new Promise(async (resolve) => {
      const container: Type.Object = []
      for (let i = 0; i < dateArr.length; i++) {
        const date = dateArr[i]
        let time: number = 0
        let res: Ajax.Gql
        res = await this.$ajax.gql.getRecord(['after_time', 'event_name'], {
          date: date.format('YYYY-MM-DD'),
        })
        res.getRecord.forEach((item: Type.Object) => {
          time += item.after_time
        })
        container.push({
          date: date.format('MM-DD'),
          time: parseInt(time / 60000 + '', 10),
        })
        if (i === dateArr.length - 1) {
          resolve(container.reverse())
        }
      }
    })
  }
  // 图表数据处理
  private process() {
    const pie: Type.Object = []
    this.original.forEach((item: Type.Object) => {
      let cost: number = 0
      item[1].forEach((e: any) => {
        cost += e.after_time
      })
      const r = cost > 0 && pie.push({ type: item[0], cost })
    })
    return pie
  }
  // 标签数据总览
  private getTotal() {
    const params = { time_order: 'asc' }
    this.$ajax.home.eventList(params).then((res: Ajax.Result) => {
      this.totalData = res
    })
  }
  // @Watch('field', { immediate: true, deep: true })
  // private onPersonChanged(val: string, oldVal: string) {}
}
</script>
<style scoped lang="less">
.share-img {
  width: 100%;
}
</style>
