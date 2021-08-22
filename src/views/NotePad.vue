<!--  -->
<template>
  <div class="wrap">
    <van-tabs v-model="yearIndex" line-height="0" title-inactive-color="rgba(0,0,0,.2)">
      <van-tab v-for="i in years" :key="i" :title="i + ''">
        <note-content :data="processData" @noteUpdate="noteUpdate"></note-content>
        <div v-show="processData.length<=0" style="background:#ffffff;"><van-empty description="无言自倚修竹" /></div>
      </van-tab>
    </van-tabs>
    <note-menu @add="addArticle" />
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import VueBase from '@/vueBase'
  import { Tab, Tabs, Empty } from 'vant'
  import { NoteMenu, NoteContent } from '@/components/note-pad'
  import allYears from '@/assets/data/years'
  @Component({
    components: {
      NoteMenu,
      NoteContent,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Empty.name]: Empty
    },
  })
  export default class NotePad extends VueBase {
    private years: number[] = allYears.arr
    private yearIndex: number = 0
    private listData: Type.Object = []
    private processData: Type.Object = []
    public constructor() {
      super()
      this.yearIndex = this.years.length - 1
    }

    private async mounted() {
      await this.$nextTick()
      // this.loadData();
    }

    private async loadData() {
      this.$commit('loading', '记忆搜寻中..');
      const needs = ['id', 'text', 'create_time']
      const res = await this.$ajax.gql.getNote(needs, {
        year: this.years[this.yearIndex],
      })
      this.listData = res.getNote
      this.$commit('loading', false);
    }

    private process() {
      const arr: Type.Object = []
      this.listData.forEach((item: Type.Object, i: number) => {
        item._index = i
        item.month = this.$utils.getMinDate(item.create_time)
        arr.push(this.$Imap(item))
      })
      const newData = this.$Ilist(arr).groupBy((x: any) => x.get('month'))
      this.processData = JSON.parse(JSON.stringify(newData.toArray()))
    }

    private async addArticle(text: string) {
      window.scrollTo(0, 0)
      const res = await this.$ajax.note.add({ text })
      this.listData.unshift(res)
    }

    private noteUpdate(obj: Type.Object) {
      if (obj.type === 'del') {
        this.listData.splice(obj.data._index, 1)
      } else {
        this.listData.splice(obj.data._index, 1, obj.data)
      }
    }

    @Watch('listData', { immediate: true, deep: true })
    private onDataChanged(val: string) {
      this.process()
    }

    @Watch('yearIndex', { immediate: true, deep: true })
    private onYearChanged(val: string) {
      this.loadData()
    }
  }
</script>
<style scoped lang="less">
  .wrap {
    background: rgba(0, 0, 0, 0.08);
  }
</style>
