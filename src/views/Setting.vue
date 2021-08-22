<!-- 设置界面 -->
<template>
  <div class=''>
    <van-nav-bar title="宝物之间" left-text="返回" left-arrow @click-left="onClickLeft">
      <div slot="right" @click="timeChoose">切换{{timeState==='day'?'夜间':'白天'}}</div>
    </van-nav-bar>
    <van-divider :style="{ borderColor: '#016efb' }" content-position="center">标签管理</van-divider>
    <div class="biaoqian">
      <van-tag v-for="(a, ai) in tags" :key="ai" @click="tapTag(a, ai)" class="bq-tag" :plain="editIndex===ai?false:true" size="large" type="primary">{{a.name}}</van-tag>
    </div>
    <div style="padding:0 1rem;">
      <van-divider content-position="left">操作</van-divider>
      <van-field class="edit-input" v-model="edit.name" placeholder="输入标签名" />
      <van-button v-if="!editState" @click="add" style="margin-right:1rem;" type="info" size="small">新增</van-button>
      <div v-else>
        <van-button @click="bianji" style="margin-right:1rem;" size="small">保存修改</van-button>
        <van-button @click="mergeState=!mergeState" style="margin-right:1rem;" size="small">合并</van-button>
        <van-button @click="del" size="small" type="danger">删除</van-button>
      </div>
    </div>
    <div v-show="mergeState" style="padding:0 1rem;">
      <van-divider content-position="left">选择合并到</van-divider>
      <van-tag v-for="(b, bi) in tags" :key="bi" v-if="b.id!=edit.id" @click="merge(b)" class="bq-tag" plain size="large" type="primary">{{b.name}}</van-tag>
    </div>
    <van-divider :style="{ borderColor: '#016efb' }" content-position="center">用户管理</van-divider>
    <div style="padding:0 1rem;">
      <van-button v-if="userName" @click="setFingerLogin" type="info" size="small">更换登陆绑定</van-button>
      <van-button v-else @click="perfectFingerUser" type="primary" size="small">完善账号信息</van-button>
      <van-button @click="logOut" style="margin-left:1rem;" type="default" size="small">退出账号</van-button>
      <van-button @click="clearCache" style="margin-left:1rem;" type="default" size="small">清空缓存</van-button> 
    </div>

  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import VueBase from '@/vueBase'
import { NavBar, Tag, Dialog } from 'vant'
@Component({
  components: {
    [NavBar.name]: NavBar,
    [Tag.name]: Tag,
  },
})
export default class Setting extends VueBase {
  private editIndex: number = -1
  private editState: boolean = false
  private edit: Type.Object = {}
  private mergeState: boolean = false
  get tags() {
    return this.$getters.taskTags
  }
  public get timeState(): string {
    return this.$getters.timeState
  }
  public get userName(): string {
    return this.$getters.user.name
  }

  private async mounted() {
    await this.$nextTick()
    this.loadData()
  }

  private loadData() {
    this.reset()
    this.$ajax.home.eventList({}).then((list: Ajax.Result) => {
      const update = this.$commit('updateTags', list)
    })
  }

  private tapTag(item: Type.Object, ai: number) {
    this.editState = this.editIndex !== ai
    this.editIndex === ai ? (this.editIndex = -1) : (this.editIndex = ai)
    this.edit = this.editState ? item : { name: '' }
    if (!this.editState) {
      this.mergeState = false
    }
  }

  private onClickLeft() {
    this.$router.replace('/')
  }
  private bianji() {
    this.$ajax.event.add(this.edit)
    this.reset()
  }
  private async add() {
    if (this.edit.name) {
      await this.$ajax.event.add(this.edit)
      this.loadData()
    }
  }
  private merge(item: Type.Object) {
    const time = item.after_time + this.edit.after_time
    Dialog.confirm({
      title: item.name,
      message: '修改后时长约为: ' + (time / 60000).toFixed(2) + ' 分钟',
    })
      .then(async () => {
        const params = this.$utils.pickSome(item, ['id', 'name'])
        params.after_time = time
        await this.$ajax.event.add(params)
        await this.$ajax.event.del(this.edit.id)
        this.loadData()
      })
      .catch(() => {
        console.log('取消')
      })
  }
  private del() {
    Dialog.confirm({
      title: '是否删除',
      message: '删除后无法找回 ' + this.edit.name + ' 标签！',
    })
      .then(async () => {
        await this.$ajax.home.eventDelete(this.edit.id)
        this.loadData()
      })
      .catch(() => {
        console.log('取消')
      })
  }
  private reset() {
    this.edit = { name: '' }
    this.editIndex = -1
    this.editState = false
    this.mergeState = false
  }
  private timeChoose() {
    this.$store.state.timeState = this.timeState === 'day' ? 'night' : 'day'
  }
  private perfectFingerUser() {
    this.$router.push({
      name: 'login',
      params: { type: 'setUser' },
    })
  }
  private setFingerLogin() {
    const finger = this.$utils.Fingerprint()
    this.$ajax.user.fingerLogin({ finger }).then(async (res: Ajax.Result) => {
      // 先看看有没有绑定过账号
      if (res.code === 402) {
        // 没有用户，可以绑定
        res = await this.$ajax.user.fingerBind({ finger })
      } else {
        // 已有绑定
        await Dialog.confirm({
          title: `您已绑定“${res.user_name}”`,
          message: `确认将重新绑定到当前账号: ${this.userName}`,
        })
        res = await this.$ajax.user.fingerBind({ finger })
      }
      this.$toast(res.msg)
    })
  }
  private logOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('menuConfig')
    this.$router.push('/login')
  }
  private clearCache() {
    localStorage.clear();
    location.reload()
  }
  // @Watch('field', { immediate: true, deep: true })
  // private onPersonChanged(val: string, oldVal: string) {}
}
</script>
<style scoped lang='less'>
.biaoqian {
  padding: 1rem 1rem 0 1rem;
}
.bq-tag {
  margin: 0 1rem 1rem 0;
}
.edit-input {
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}
</style>