<!-- 我的目标列表 -->
<template>
  <div class="">
    <van-dropdown-menu>
      <van-dropdown-item v-model="myPlan" :options="targetPlans" />
    </van-dropdown-menu>
    <simple-gauge :actual="gaugeActual" />
    <van-swipe-cell v-for="(target, ti) in targetList" :key="ti">
      <template #left>
        <van-button v-show="!target.is_done" @click="update(target.id, 1)" square type="warning" text="结束" class="van-swipe-cell-slide-button" />
        <van-button v-show="target.is_done" @click="update(target.id, 0)" square type="primary" text="恢复" class="van-swipe-cell-slide-button" />
      </template>
      <van-cell size="large" value="滑动操作" value-class="target_list_cell-roll_tip">
        <div slot="title" class="target_title" :class="{ complate: target.is_done, finish: target.is_finish }"> {{target.name}} </div>
        <div slot="label" class="target-events-item">
          <van-tag @click="jump2clockIn(event)" @close="closeTag(event)" v-for="(event, ei) in target.events" :key="ei" mark :closeable="!target.is_done" plain class="tag-item">
            <span :class="{ complate: doneEvent.includes(event.event_id), finish: target.is_done }">{{ event.event_name }}</span> <span v-show="doneEvent.includes(event.event_id)" class="tip"> (已打卡)</span>
          </van-tag>
        </div>
      </van-cell>
      <template #right>
        <van-button @click="openBindEvent(target.id)" square type="info" text="设置" class="van-swipe-cell-slide-button" />
        <van-button @click="openDelTarget(target.id)" square type="danger" text="删除" class="van-swipe-cell-slide-button" />
      </template>
    </van-swipe-cell>

    <div class="bottom-wrap">
      <van-button @click="openAddTarget" block plain hairline type="info">新增目标</van-button>
    </div>

    <van-dialog @confirm="addTarget" v-model="addConfirmShow" show-cancel-button get-container="body">
      <van-field v-model="targetName" label="输入小目标 :" placeholder="I have a dream" size="large" :maxlength="28" style="line-height:15px;padding:3rem 2rem;" type="textarea" error-message="" rows="1" autosize clearable />
    </van-dialog>

    <event-popup title="绑定任务" v-model="bindEventShow" @select="clickTag" :hideBtn="true" @close="closePopup" />
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
  import VueBase from '@/vueBase'
  import { SimpleGauge } from '@/components/chart'
  import { SwipeCell, Cell, DropdownMenu, DropdownItem, Dialog, Tag } from 'vant'
  import EventPopup from '@/components/business/EventPopup.vue'
  import targetPlans from '@/assets/data/targetPlans'
  @Component({
    components: {
      SimpleGauge,
      [SwipeCell.name]: SwipeCell,
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem,
      [Cell.name]: Cell,
      [Dialog.Component.name]: Dialog.Component,
      EventPopup,
      [Tag.name]: Tag,
    },
  })
  export default class TargetList extends VueBase {
    // get computed() { return 'computed' }
    private myPlan: string = localStorage.getItem('target_plan') || '1'
    private targetPlans: Type.Object[] = targetPlans
    private targetList: Type.Object[] = [] // 我的目标列表
    private doneEvent: number[] = [] // 已完成的事件
    private addConfirmShow: boolean = false
    private bindEventShow: boolean = false
    private targetName: string = ''
    private targetId!: string | number
    private gaugeActual: number = 0

    private async mounted() {
      // await this.$nextTick()
      // 初始化加载移至 onPlanChanged第一次监听
    }

    private async getTargetList() {
      // TODO：后期应该抽成状态管理，避免多次请求
      const targetList = await this.$ajax.target.getList()
      this.targetList = this.sortList(targetList)
      this.handleProgress() // 拉取并处理进度
    }
    private async getRecode() {
      const { getTargetRecord } = await this.$ajax.gql.getTargetRecord(['event_id'], { type: this.myPlan })
      const doneEvent: number[] = getTargetRecord.map((item: any) => {
        return (item = +item.event_id)
      })
      this.doneEvent = [...new Set(doneEvent)]
      this.updateLabelState()
    }
    /**
     * 完成/恢复目标
     */
    private async update(id: number, isDone: number) {
      await this.$ajax.target.addUpdate({ id, is_done: isDone })
      await this.getTargetList()
    }
    /**
     * 新增目标
     */
    private async addTarget() {
      await this.$ajax.target.addUpdate({ name: this.targetName })
      await this.getTargetList()
    }
    private openAddTarget() {
      this.targetName = ''
      this.addConfirmShow = true
    }
    /**
     * 删除目标
     */
    private openDelTarget(id: number) {
      Dialog.confirm({
        message: '确定取消这个目标吗？',
      }).then(async () => {
        await this.$ajax.target.del({ id })
        await this.getTargetList()
      })
    }
    /**
     * 绑定目标打卡事件
     */
    private closePopup() {
      this.getTargetList()
    }
    private openBindEvent(id: number) {
      this.bindEventShow = true
      this.targetId = id
    }
    private async clickTag(tag: Type.Object) {
      const res = await this.$ajax.target.addEvent({ target_id: this.targetId, event_id: tag.id })
      this.$toast(res.msg)
    }
    /**
     * 快速处理目标打卡
     */
    private jump2clockIn(tag: Type.Object) {
      this.$router.push({name: 'home', params: tag})
    }
    /**
     * 删除目标打卡事件
     */
    private async closeTag(item: Type.Object) {
      Dialog.confirm({
        message: '确认移除该任务?',
      }).then(async () => {
        await this.$ajax.target.delEvent({ id: item.id })
        this.getTargetList()
      })
    }
    /**
     * 处理进度
     */
    private async handleProgress() {
      // 拉取最新打卡记录
      await this.getRecode()
      // 处理完成进度
      const allEvent: number[] = []
      this.targetList.forEach((item: Type.Object) => {
        item.events.forEach((element: Type.Object) => {
          allEvent.push(element.event_id)
        })
      })
      this.gaugeActual = (this.doneEvent.length / [...new Set(allEvent)].length) * 100
    }
    /**
     * 排序 把已完成移到末尾
     */
    private sortList(listData: any[]) {
      const list: any[] = []
      const doneList: any[] = []
      for (const item of listData) {
        if (item.is_done === 1) {
          doneList.push(item)
        } else { list.push(item) }
      }
      return list.concat(doneList)
    }
    /**
     * 处理每个标签的状态
     */
    private updateLabelState() {
      for (const target of this.targetList) {
        let isFinish = target.events.length > 0 ? true : false
        target.events.forEach((event: any) => {
            event.finish = !!this.doneEvent.includes(event.event_id)
            if (!event.finish) { isFinish = false }
        });
        target.is_finish = !!isFinish
      }
    }

    // @Emit('change')
    // private change(e: MouseEvent) {}
    @Watch('myPlan', { immediate: true, deep: true })
    private async onPlanChanged(val: string, oldVal: string) {
      await localStorage.setItem('target_plan', val)
      const rfn = this.targetList.length === 0 && (await this.getTargetList())
      this.handleProgress()
    }
  }
</script>
<style>
.van-swipe-cell-slide-button {
  height: 100%;
}
.target_list_cell-roll_tip {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.12);
}
</style>
<style lang="less" scoped>
.bottom-wrap {
  padding: 2rem 5vw;
}
.complate {
  text-decoration: line-through;
  color: #dbdbdb;
}
.finish {
  color: #dbdbdb;
}
.target-events-item {
  display: flex;
  flex-wrap: wrap;
  // width: 100%;
  span {
    font-size: 12px;
  }
  .tip {
    color: #dbdbdb;
  }
}
.tag-item {
  margin: 0 0.5rem 0.5rem 0;
}
.target_title {
  width: 19.4rem;
}
</style>
