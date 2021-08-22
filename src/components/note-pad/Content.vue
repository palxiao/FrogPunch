<!--  -->
<template>
  <div class='layout'>
    <van-index-bar :index-list="indexList" :highlight-color="'#1989fa'">
      <div v-for="(item, ai) in curData" :key="ai">
        <van-index-anchor :index="item[0]">{{item[0]}}月 ( 笔录{{item[1].length}}条 )</van-index-anchor>
        <van-collapse v-model="actives[ai]">
          <van-collapse-item v-for="(list, bi) in item[1]" :key="bi" :name="bi">
            <div slot="title" style="position: absolute;">
              {{list.create_time}}
            </div>
            <div slot="icon" class="pr-12 mr-20">
              <i @click.stop="edit(list,ai+''+bi)" class="iconfont" :class="list.isEdit?'fp-wancheng':'fp-bianji'"></i>
            </div>
            <div style="position:relative;" slot="value">
              <i @click.stop="del(item[1], bi)" class="iconfont fp-shanchu"></i>
            </div>
            <div v-show="!list.isEdit" @click="clickText(list.text)" class="content">{{list.text}}</div>
            <van-field v-show="list.isEdit" :ref="ai+''+bi" v-model="list.text" type="textarea" autosize />
          </van-collapse-item>
        </van-collapse>
      </div>
    </van-index-bar>
    <div style="height: 7rem;background:#ffffff;"></div>
  </div>
</template>
<script lang='ts'>
import VueBase from '@/vueBase';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IndexBar, IndexAnchor, Collapse, CollapseItem, Dialog } from 'vant';
@Component({
  components: {
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem
  }
})
export default class Name extends VueBase {
  @Prop()
  private data!: Type.Object;
  private indexList: number[] = [];
  private actives: Type.Object = [];

  private curData: Type.Object = [];

  private async mounted() {
    await this.$nextTick();
  }
  private edit(item: any, refName: string) {
    item.isEdit = typeof item.isEdit === 'undefined' ? true : !item.isEdit;
    const t = item.text;
    item.text = '';
    item.text = t;
    const r = !item.isEdit && this.$ajax.note.add(item);
    this.$emit('noteUpdate', { type: 'edit', data: item });
    // const inputBox = this.$refs[refName] as Type.Object;
    // inputBox[0].focus();
  }

  private del(item: any, index: number) {
    const that = this;
    Dialog.confirm({
      message: '确认删除？',
      async beforeClose(action, done) {
        if (action === 'confirm') {
          await that.$ajax.note.del(item[index].id);
          that.$emit('noteUpdate', { type: 'del', data: item[index] });
          item.splice(index, 1);
        }
        done();
      }
    });
  }

  private clickText(text: string) {
    this.$copyText(text).then(() => {
      this.$toast({
        duration: 1000, // 持续展示 toast
        message: '已复制'
      });
    });
  }

  @Watch('data', { immediate: true, deep: true })
  private onDataChanged(val: Type.Object) {
    this.curData = val;
    // 右侧快捷index
    this.indexList = [];
    val.forEach((item: Type.Object) => {
      this.indexList.push(item[0]);
    });
    // 自动展开所有面板
    this.actives = [];
    this.actives = this.collectionArray(val);
  }

  private collectionArray(arr: Type.Object) {
    const finish: Type.Object = [];
    arr.forEach((item: Type.Object) => {
      const temp: number[] = [];
      item[1].forEach((e: any, index: number) => {
        temp.push(index);
      });
      finish.push(temp);
    });
    return finish;
  }
}
</script>
<style scoped lang='less'>
.content {
  word-wrap: break-word;
  padding-right: 9px;
}
.mr-20 {
  margin-right: 20px;
}
.pr-12 {
  padding-right: 12px;
}
.fp-bianji,
.fp-wancheng {
  position: absolute;
  font-size: 22px;
}
.fp-shanchu {
  position: absolute;
  font-size: 20px;
  right: 12px;
}
</style>
<style lang="css">
.van-index-bar__sidebar {
  background: #fbfbfb;
}
.van-index-bar__sidebar > span {
  padding: 4px 10px 4px 8px;
}
</style>