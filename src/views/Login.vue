<!--  -->
<template>
  <div class="login-box">
    <div v-if="type === 'setUser'">
      <van-divider :style="{ borderColor: '#016efb' }" content-position="center">完善账号</van-divider>
      <div class="account">
        <van-field class="edit-input" v-model="user.user_name" placeholder="请输入账号" />
        <van-field class="edit-input" v-model="user.pass" placeholder="请输入密码" />
        <van-button @click="prefactUser" style="margin-top:2rem;" size="small" plain type="info" block>注册</van-button>
      </div>
    </div>
    <div v-else>
      <van-divider :style="{ borderColor: '#016efb' }" content-position="center">账号登录</van-divider>
      <div class="account">
        <van-field class="edit-input" v-model="user.user_name" placeholder="请输入账号" />
        <van-field class="edit-input" v-model="user.pass" placeholder="请输入密码" />
        <van-button @click="login" class="login" type="info" size="small">登陆</van-button>
        <van-button @click="register" size="small" class="register" plain type="info">注册</van-button>
      </div>
      <van-divider :style="{ borderColor: '#016efb' }" content-position="center">其他方式</van-divider>
      <van-button @click="fingerLogin" style="margin-top:2rem;" plain type="primary" block>一键登录</van-button>
    </div>
  </div>

</template>
<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import VueBase from '@/vueBase';
import { Dialog } from 'vant';
@Component({
  components: {}
})
export default class Name extends VueBase {
  private user: Type.Object = {};
  @Prop(String)
  private msg!: string;

  public get type(): string {
    return this.$route.params.type;
  }
  private async mounted() {
    await this.$nextTick();
  }
  private created() {
    this.$commit('changeOnline', true);
  }
  // 账号登录
  private async login() {
    const res = await this.$ajax.home.login(this.user);
    this.$toast(res.msg || '欢迎您：' + res.user_name);
    if (!res.code) {
      this.success(res.token, this.user.user_name);
    }
  }
  // 账号注册
  private async register() {
    if (!this.user.user_name || !this.user.pass) {
      this.$toast('请输入创建的账号及密码');
      return;
    }
    const res = await this.$ajax.user.add({
      name: this.user.user_name,
      pass: this.user.pass
    });
    this.$toast(res.msg);
    if (res.code === 200) {
      this.login();
    }
  }
  // 浏览器指纹登陆
  private fingerLogin() {
    const mdata = {
      title: '将使用当前浏览器指纹登陆',
      message:
        '当您在其他终端或浏览器中登陆不会同步数据，如有变更请进入设置-用户管理'
    };
    Dialog.confirm(mdata)
      .then(async () => {
        const finger = this.$utils.Fingerprint();
        let res = await this.$ajax.user.fingerLogin({ finger });
        if (res.code === 402) {
          // 没有用户，给你注册，重载返回结果
          res = await this.$ajax.user.fingerRegister({ finger });
        }
        this.$toast('登陆成功');
        this.success(res.token, res.user_name);
      })
      .catch(() => {
        console.log('取消');
      });
  }
  // 指纹登录用户完善信息
  private prefactUser() {
    if (!this.user.user_name || !this.user.pass) {
      this.$toast('请输入创建的账号及密码');
      return;
    }
    this.user.finger = this.$utils.Fingerprint();
    this.$ajax.user.fingerLogin(this.user).then((res: Ajax.Result) => {
      console.log(res);
      if (res.code === 201) {
        Dialog.confirm({
          title: '该账号已存在',
          message: `如“${
            this.user.user_name
          }”是您的账号，请重新登录该账号并进行浏览器绑定操作`
        }).then(() => {
          this.$router.push('/login');
        });
      } else if (res.code === 200) {
        this.$toast('注册成功');
        this.$commit('changeUser', this.user.user_name);
        this.$router.go(-1);
      }
    });
  }
  private success(token: string, userName: string) {
    setTimeout(() => {
      this.$router.go(-1);
    }, 200);
    const TokenSave = token && localStorage.setItem('token', token);
    this.$commit('changeUser', userName);
  }
  // @Emit('change')
  // private change(e: MouseEvent) {}
  // @Watch('field', { immediate: true, deep: true })
  // private onPersonChanged(val: string, oldVal: string) {}
}
</script>
<style scoped lang='less'>
.login-box {
  padding: 2rem;
  margin-top: 8rem;
}
.edit-input {
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}
.login {
  width: 58%;
  margin-right: 6%;
}
.register {
  width: 36%;
}
.account {
  margin: 2rem 0 4rem 0;
}
</style>