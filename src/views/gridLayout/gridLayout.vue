<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;float:right;" @click="selectLayoutType" type="primary"
                 icon="">选择布局
      </el-button>
    </div>

    <!--布局容器-->
    <div style="margin-top: 40px">
      <div class="component">
        <grid-layout
          :layout="layout"
          :col-num="4"
          :row-height="90"
          :autoSize="true"
          :is-draggable="true"
          :is-resizable="true"
          :useCssTransforms ="true"
          :vertical-compact="true"
          :margin="[10, 10]"
          :use-css-transforms="true">
          <grid-item v-for="(item,index) in layout"
                     :key="item.i"
                     :x="item.x"
                     :y="item.y"
                     :w="item.w"
                     :h="item.h"
                     :i="item.i"
                     @move="moveEvent"
                     @moved="movedEvent"
                     class="griditem">
            <el-row class="drag-title">
              <!--<el-col :span="12">新增人员过滤器{   过滤器：所有人，频率：每天   }</el-col>-->
              <el-col :span="24" class="ico" style="height: 24px;line-height: 24px;">
                <el-dropdown trigger="click" @command="handleCommand(item, index, $event)">
									  <span class="el-dropdown-link">
									    选择图标类型<i class="el-icon-arrow-down el-icon--right"></i>
									  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="line">折线图</el-dropdown-item>
                    <el-dropdown-item command="pie">饼图</el-dropdown-item>
                    <el-dropdown-item command="text">text</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
            <el-row class="drag-content">
              <el-col :span="24">
                <component v-bind:is="item.component" :id="item.componentId"></component>
              </el-col>
            </el-row>
          </grid-item>
        </grid-layout>
      </div>
    </div>
    <!--选择布局对话框-->
    <el-dialog title="请选择布局种类" :visible.sync="layoutDialogVisible" width="60%">
      <div class="content">
        <el-row :gutter="10">
          <el-col :span="8" v-for="(item,index) in layTable" :key="item.id">
            <div class="grid-content bg-purple-light" @click="layView(item)">
              <img v-bind:src="item.src"/>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="layoutDialogVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="setLayoutType">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable */
  import vueGridLayout from 'vue-grid-layout';
  import keyboard from '@/components/Charts/keyboard'
  import lineMarker from '@/components/Charts/lineMarker'
  import mixChart from '@/components/Charts/mixChart'
  import index from "../../router";
  /*import keyboard from '../../views/charts/line'
  import lineMarker from '../../views/charts/line'
  import mixChart from '../../views/charts/mixChart'*/

  var GridLayout = vueGridLayout.GridLayout;
  var GridItem = vueGridLayout.GridItem;
  export default {
    name: 'myGridLayout',
    components: {
      keyboard,
      lineMarker,
      mixChart,
      GridLayout,
      GridItem,
    },
    data() {
      return {
        layoutDialogVisible: false,
        layouttype:"A",
        layout:[
          {"x":0,"y":0,"w":2,"h":5,"i":"A0"},
          {"x":2,"y":0,"w":2,"h":5,"i":"A1"},
          {"x":0,"y":5,"w":2,"h":5,"i":"A2"},
          {"x":2,"y":5,"w":2,"h":5,"i":"A3"}
        ],
        layTable:[
          {id: 1, src: require("../../assets/images/布局1.png"), laytype: "type1"},
          {id: 2, src: require("../../assets/images/布局2.png"), laytype: "type2"},
          {id: 3, src: require("../../assets/images/布局3.png"), laytype: "type3"}
        ]
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        /*this.layout = [
          {"x":0,"y":0,"w":2,"h":5,"i":"A0",component:"keyboard"},
          {"x":2,"y":0,"w":2,"h":5,"i":"A1",component:"lineMarker"},
          {"x":0,"y":5,"w":2,"h":5,"i":"A2",component:"mixChart"},
          {"x":2,"y":5,"w":2,"h":5,"i":"A3",component:"mixChart"}
        ]*/
        this.layout = [
          {"x":0,"y":0,"w":2,"h":2.5,"i":"A0",component:""},
          {"x":2,"y":0,"w":2,"h":2.5,"i":"A1",component:""},
          {"x":0,"y":2.5,"w":2,"h":2.5,"i":"A2",component:""},
          {"x":2,"y":2.5,"w":2,"h":2.5,"i":"A3",component:""},
          {"x":0,"y":5,"w":1,"h":2.5,"i":"A4",component:""},
          {"x":1,"y":5,"w":1,"h":2.5,"i":"A5",component:""},
          {"x":2,"y":5,"w":1,"h":2.5,"i":"A6",component:""},
          {"x":3,"y":5,"w":1,"h":2.5,"i":"A7",component:""},
          {"x":0,"y":7.5,"w":1,"h":2.5,"i":"A8",component:""},
          {"x":1,"y":7.5,"w":1,"h":2.5,"i":"A9",component:""},
          {"x":2,"y":7.5,"w":1,"h":2.5,"i":"A10",component:""},
          {"x":3,"y":7.5,"w":1,"h":2.5,"i":"A11",component:""}
        ]
      })
    },
    methods: {
      selectLayoutType() {
        this.layoutDialogVisible = true
      },
      setLayoutType() {
      },
      // 选择布局样式
      layView(item){/*选择layout*/
        this.layouttype= item.laytype;
        if(item.laytype=="type1"){
          /**
           * @desc 关系处理
           *  x 永远处于0
           *  y 之前组件h之和
           *  w 列数最大值(列数自由设置)
           */
          this.layout = [
            {"x":0,"y":0,"w":2,"h":2.5,"i":"A0",component:""},
            {"x":2,"y":0,"w":2,"h":2.5,"i":"A1",component:""},
            {"x":0,"y":2.5,"w":2,"h":2.5,"i":"A2",component:""},
            {"x":2,"y":2.5,"w":2,"h":2.5,"i":"A3",component:""},
            {"x":0,"y":5,"w":1,"h":2.5,"i":"A4",component:""},
            {"x":1,"y":5,"w":1,"h":2.5,"i":"A5",component:""},
            {"x":2,"y":5,"w":1,"h":2.5,"i":"A6",component:""},
            {"x":3,"y":5,"w":1,"h":2.5,"i":"A7",component:""},
            {"x":0,"y":7.5,"w":1,"h":2.5,"i":"A8",component:""},
            {"x":1,"y":7.5,"w":1,"h":2.5,"i":"A9",component:""},
            {"x":2,"y":7.5,"w":1,"h":2.5,"i":"A10",component:""},
            {"x":3,"y":7.5,"w":1,"h":2.5,"i":"A11",component:""}
          ]
        }else if(item.laytype=="type2"){
          this.layout = [
            {"x":0,"y":0,"w":2,"h":5,"i":"B0",component:""},
            {"x":2,"y":0,"w":2,"h":5,"i":"B1",component:""},
            {"x":0,"y":5,"w":2,"h":5,"i":"B2",component:""},
            {"x":2,"y":5,"w":2,"h":5,"i":"B3",component:""},
          ]
        }else if(item.laytype=="type3"){
          this.layout = [
            {"x":0,"y":0,"w":1,"h":3,"i":"C0",component:""},
            {"x":1,"y":0,"w":1,"h":3,"i":"C1",component:""},
            {"x":2,"y":0,"w":1,"h":3,"i":"C2",component:""},
            {"x":3,"y":0,"w":1,"h":3,"i":"C3",component:""},
            {"x":0,"y":3,"w":4,"h":7,"i":"C4",component:""}
          ]
        }
        this.layoutDialogVisible = false;
      },

      // 选择图标种类
      handleCommand(item, index, event) {
        console.log(event)
        if(event === 'line') {
          item.componentType = 'line'
          item.component = 'lineMarker'
          item.componentId = 'line' + index
        }
        if (event === 'pie') {
          item.componentType = 'keyboard'
          item.component = 'keyboard'
          item.componentId = 'keyboard' + index
        }
        if (event === 'text') {
          item.componentType = 'text'
          item.component = 'mixChart'
          item.componentId = 'text' + index
        }
        console.log(this.layout)
      },
      moveEvent: function(i, newX, newY){
        console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
      },
      movedEvent: function(i, newX, newY){
        console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
      },
    }
  }
</script>

<style scoped>
  .pan-btn {
    font-size: 12px;
    color: #fff;
    padding: 3px 15px;
    border-radius: 2px;
    border: none;
    outline: none;
    margin-right: 0;
    transition: all .6s ease;
    position: relative;
    display: inline-block;
  }
  .grid-content {
    height: 204px;
    padding: 6px;
    border: 1px solid rgb(64, 158, 255);
  }
  .grid-content:hover {
    background-color: #50BFFF;
  }
  .grid-content img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .drag-content {
    height: calc(100% - 24px);
    background-color: rgba(64,158,255,0.3);
  }
  .drag-content .el-col{
    height: 100%;
  }
  .griditem {
    padding: 3px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  /*.drag-title {
    margin-top: 20px;
  }*/
  /*.el-button+.el-button {
    margin-left: 0;
  }*/
</style>
