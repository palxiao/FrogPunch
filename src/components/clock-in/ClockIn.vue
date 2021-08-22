<!-- 打卡打卡 -->
<template>
  <div class='clock-in'>
    <div @click="callback" class="view" :style="{bottom:bt+'px'}">
      <van-circle v-model="currentTime" :rate="rate" fill="rgba(0,0,0,.37)" :color="gradientColor" layer-color="rgba(255,255,255,.7)" size="10rem" :clockwise="false">
        <div class="circle-text flex-layout" style="flex-wrap: wrap;">
          <div v-if="clockIn">
            <div class="line-clamp-1 executing">{{executing}}</div>
            <div class="run-time">{{clockIn}}</div>
          </div>
          <span v-else style="margin-top:-10%;" class="fs-18">开始打卡</span>
        </div>
      </van-circle>
    </div>
    <!-- 开始任务 -->
    <event-popup v-model="popupShow" @select="clickTag" @btn="quikStart" @open="openPopup" @close="closePopup" />

    <!-- 快速创建任务 -->
    <van-dialog @confirm="clickTag" v-model="startShow" show-cancel-button get-container="body">
      <div style="padding:2rem 1.8rem;">
        <van-field v-model="label" label="执行任务:" size="large" :maxlength="24" style="line-height:15px;" type="textarea" error-message="" placeholder="输入任务名称" rows="1" autosize clearable />
        <!-- <van-checkbox v-model="saveTag">保存到常用任务标签</van-checkbox> -->
      </div>
    </van-dialog>
    <!-- 完成任务 -->
    <van-dialog @confirm="done" v-model="doneShow" show-cancel-button get-container="body">
      <div style="padding:2rem 1.8rem;">
        <div style="margin-bottom:1.5rem;">
          <div style="color:rgba(0,0,0,.8);">结束任务：</div>
          <br>
          <div class="mission">{{executing}}</div>
        </div>
        <van-checkbox v-show="!customConfirm" v-model="noConfirm">仅结束，本次任务作废</van-checkbox>
        <van-checkbox style="margin-top:12px;" v-model="customConfirm">自定义时间 (单位: 分钟)</van-checkbox>
        <van-field v-show="customConfirm" v-model="customTime" type="number" clearable label="-> 经过 : " placeholder="大致时间，单位分钟" :border="false" />
      </div>
    </van-dialog>
    <!-- 沉浸模式 -->
    <Transition-immersion ref="immersion">
      <div class="immersion" slot>
        <div class="executing">正在{{executing}}中</div>
        <div class="run-time">{{clockIn}}</div>
        <div @click="closeImmersion" class="click_close">退出沉浸模式</div>
      </div>
    </Transition-immersion>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
import { Circle, Dialog, Checkbox } from 'vant'
import EventPopup from '@/components/business/EventPopup.vue'
import TransitionImmersion from '@/components/common/effect/transition.vue'
@Component({
  components: {
    [Circle.name]: Circle,
    [Dialog.Component.name]: Dialog.Component,
    [Checkbox.name]: Checkbox,
    EventPopup,
    TransitionImmersion,
  },
})
export default class ClockIn extends VueBase {
  public defaultColor: string = '#f2826a'
  // @Prop(String)
  // private msg!: string;
  private nowThing!: Type.Object
  private popupShow: boolean = false
  private startShow: boolean = false
  private doneShow: boolean = false
  private label: string = '' // 快速输入任务标签
  // private saveTag: boolean = false; // 保存快速标签
  private noConfirm: boolean = false // 不记录(原是否出现提示
  private customConfirm: boolean = false // 自定义的记录
  private customTime: number = 0 // 自定义经过的时间(分)
  get clockIn() {
    // 持续时间
    return this.$getters.clockIn
  }
  get tags() {
    return this.$getters.taskTags
  }
  get executing() {
    // 正在执行的任务名
    return this.$getters.executing
  }
  get gradientColor() {
    const mins = new Date().getHours() * 60 + new Date().getMinutes()
    if ((mins > 1080 && mins < 1170) || (mins > 720 && mins < 840) || (mins > 0 && mins < 360)) {
      return '#e8a689'
    } else {
      return '#1989fa'
    }
  }

  public get bt(): number {
    const wh = this.$getters.windowHeight
    const ratio = wh < 540 ? 9 : 6
    return wh / ratio
  }

  public get rate(): number {
    const mins = new Date().getHours() * 60 + new Date().getMinutes()
    const have = 24 * 60
    return ((have - mins) / have) * 100
  }

  private currentTime: number = 0

  private async mounted() {
    await this.$nextTick()
    await this.checkMission()
  }

  private async checkMission() {
    return new Promise(async (resolve, reject) => {
      const latest = await this.$ajax.home.recordOne()
      if (latest.after_time === 0) {
        localStorage.setItem('doing', JSON.stringify(latest))
        this.$utils.stopwatch(this.$utils.dayjs(latest.create_time))
        this.$commit('exec', latest.event_name)
        this.nowThing = latest
      } else {
        resolve()
      }
      // if (!localStorage.getItem('doing')) {

      // } else {
      //   const latest = JSON.parse(localStorage.getItem('doing') as string)
      //   this.$utils.stopwatch(this.$utils.dayjs(latest.create_time))
      //   this.$commit('exec', latest.event_name)
      //   this.nowThing = latest
      // }
    })
  }

  private callback() {
    this.noConfirm = false
    this.clockIn ? (this.doneShow = true) : (this.popupShow = true)
    if (!this.clockIn) {
      this.$utils.audio.play('downer')
    }
  }

  private quikStart() {
    this.popupShow = false
    this.startShow = true
  }
  // 开始任务
  private clickTag(tag: Type.Object) {
    this.checkMission().then(async (res) => {
      const immersion = this.$refs.immersion as any
      immersion.show()

      const beginDate = new Date().getTime()
      let params: Type.Object = {
        name: this.label,
      }
      params = tag ? tag : await this.$ajax.home.eventAdd(params)

      const doing = await this.$ajax.home.recordAdd({ event_id: params.id })
      doing.event_name = params.name
      this.nowThing = doing
      this.popupShow = false
      this.$commit('exec', tag ? tag.name : this.label)
      this.$utils.stopwatch(beginDate)
      this.$utils.audio.play('beganClockIn')
    })
  }
  /**
   * 退出沉浸模式
   */
  private closeImmersion() {
    const immersion = this.$refs.immersion as any
    immersion.close()
  }

  private async done() {
    this.customConfirm = false
    this.$utils.audio.play('endHourglass')
    // const myThing: Type.Object = JSON.parse(localStorage.getItem('doing') + '');
    this.$utils.stopwatch()
    localStorage.setItem('doing', '')

    const nowTime = this.$utils.dayjs(new Date())
    const beginTime = this.$utils.dayjs(this.nowThing.create_time)
    const diffTime = nowTime.diff(beginTime)

    const { id } = this.nowThing
    if (this.customConfirm) {
      this.$ajax.home.recordAdd({ id, after_time: this.customTime * 60000 })
    } else if (this.noConfirm) {
      this.$ajax.home.recordDelete({ id })
    } else {
      this.$ajax.home.recordAdd({ id, after_time: diffTime })
    }
  }
  private openPopup() {
    this.$commit('changeScroll', false)
  }
  private closePopup() {
    this.$commit('changeScroll', true)
  }
}
</script>
<style scoped lang='less'>
.immersion {
  position: fixed;
  width: 100%;
  top: 0;
  height: 100%;
  background: #ffffff;
  .executing {
    position: absolute;
    top: 30vh;
    color: rgba(0, 0, 0, 0.4);
    text-align: center;
    width: 100%;
    font-size: 22px;
  }
  .run-time {
    position: absolute;
    font-size: 24px;
    font-family: monospace;
    text-align: center;
    color: rgba(0, 0, 0, 0.7);
    top: 50vh;
  }
  .click_close {
    position: absolute;
    top: 80vh;
    font-size: 14px;
    text-align: center;
    width: 100%;
    color: rgba(0, 0, 0, 0.2);
  }
}

.view {
  width: 100%;
  text-align: center;
  position: absolute;
}
.run-time {
  position: absolute;
  left: 0;
  width: 100%;
  margin-top: 0.6rem;
}
.executing {
  font-size: 16px;
  margin-top: -1.8rem;
}
.circle-text {
  width: 100%;
  position: absolute;
  height: 40%;
  margin-top: 36%;
  color: #ffffff;
}
.mission {
  padding-left: 1.9rem;
  font-size: 18px;
}
</style>