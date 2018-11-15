<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="height: 40px;">
      <el-button class="filter-item" style="margin-right: 10px;float:right;" @click="selectLayoutType" type="success"
                 icon="">选择布局
      </el-button>
      <el-button class="filter-item" style="margin-right: 10px;float:right;" @click="saveLayout" type="primary"
                 icon="">保存布局
      </el-button>
    </div>

    <!--布局容器-->
    <div>
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
              <el-col :span="24" class="ico">
                <el-dropdown trigger="click" @command="handleCommand(item, index, $event)">
									  <span class="el-dropdown-link">
									    <strong>选择图标类型</strong><i class="el-icon-arrow-down el-icon--right"></i>
									  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="lineMarker">曲线图</el-dropdown-item>
                    <el-dropdown-item command="line">折线图</el-dropdown-item>
                    <el-dropdown-item command="pie">饼图</el-dropdown-item>
                    <el-dropdown-item command="bar">柱状图</el-dropdown-item>
                    <el-dropdown-item command="reddar">雷达图</el-dropdown-item>
                    <el-dropdown-item command="mixed">混合图</el-dropdown-item>
                    <el-dropdown-item command="workshopTitle">车间标题</el-dropdown-item>
                    <el-dropdown-item command="caption">车间产量</el-dropdown-item>
                    <el-dropdown-item command="message">推送消息</el-dropdown-item>
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
          <el-col :span="12" v-for="(item,index) in layTable" :key="item.id">
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
  import pieChart from '@/views/charts/PieChart'
  import barChart from '@/views/charts/BarChart'
  import reddarChart from '@/views/charts/RaddarChart'
  import lineChart from '@/views/charts/LineChart'
  import mixedChart from '@/views/boardCharts/originMixChart'
  import workshopTitle from '@/views/caption/plantTitle'
  import captionChart from '@/views/caption/plantTitle2'
  import messageAll from '@/views/caption/messageAll'
  import { saveLayoutByBoard, getLayoutByBoard } from '@/api/board'

  var GridLayout = vueGridLayout.GridLayout;
  var GridItem = vueGridLayout.GridItem;
  export default {
    name: 'myGridLayout',
    components: {
      GridLayout,
      GridItem,
      keyboard,
      lineMarker,
      mixChart,
      pieChart,
      barChart,
      reddarChart,
      lineChart,
      mixedChart,
      workshopTitle,
      captionChart,
      messageAll
    },
    data() {
      return {
        boardId: '',
        layoutDialogVisible: false,
        layouttype:"A",
        layout:[
          {"x":0,"y":0,"w":2,"h":5,"i":"B0",component:""},
          {"x":2,"y":0,"w":2,"h":5,"i":"B1",component:""},
          {"x":0,"y":5,"w":2,"h":5,"i":"B2",component:""},
          {"x":2,"y":5,"w":2,"h":5,"i":"B3",component:""},
        ],
        layTable:[
          {id: 1, src: require("../../assets/images/布局1.png"), laytype: "type1"},
          {id: 2, src: require("../../assets/images/布局2.png"), laytype: "type2"},
          {id: 3, src: require("../../assets/images/布局3.png"), laytype: "type3"},
          {id: 4, src: require("../../assets/images/messageAll.png"), laytype: "type4"}
        ]
      }
    },
    created() {
      this.boardId = this.$route.params.id
      getLayoutByBoard(this.boardId).then((res) => {
        // this.layout = res.data.data.layoutDetailEntities
        if(res.data.data.layoutDetailEntities) {
          let layoutData = res.data.data.layoutDetailEntities
          this.layout = []
          layoutData.forEach((item, index) => {
            let tempItem = Object.assign({}, item)
            tempItem.component = ''
            this.layout.push(tempItem)
            if(item.component.length > 0) {
              item.componentId = item.component + index
            }
          })
          this.$nextTick(() => {
            this.layout = layoutData
          })
          this.$notify({
            title: '成功',
            message: '布局获取成功',
            type: 'success',
            duration: 2000
          })
        }
      })/*.catch(() => {
        /!*this.$notify({
          title: '失败',
          message: '布局获取失败',
          type: 'error',
          duration: 2000
        })*!/
      })*/

    },
    mounted() {
      this.$nextTick(() => {
      })
      /*this.$nextTick(() => {
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
      })*/
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
        this.$confirm('确认选择当前布局吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(item.laytype=="type1"){
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
          }else if(item.laytype=="type4"){
            this.layout = [
              {"x":0,"y":0,"w":4,"h":10,"i":"D0",component:""}
            ]
          }
          this.layoutDialogVisible = false;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消选择'
          })
        })
      },

      // 选择图表种类
      handleCommand(item, index, event) {
        console.log(event)
        if (event === 'lineMarker') {
          item.componentType = 'lineMarker'
          item.component = 'lineMarker'
          item.componentId = 'lineMarker' + index
        }
        if(event === 'line') {
          item.componentType = 'line'
          item.component = 'lineChart'
          item.componentId = 'lineChart' + index
        }
        if (event === 'pie') {
          item.componentType = 'pieChart'
          item.component = 'pieChart'
          item.componentId = 'pieChart' + index
        }
        if (event === 'bar') {
          item.componentType = 'barChart'
          item.component = 'barChart'
          item.componentId = 'barChart' + index
        }
        if (event === 'reddar') {
          item.componentType = 'reddarChart'
          item.component = 'reddarChart'
          item.componentId = 'reddarChart' + index
        }
        if (event === 'mixed') {
          item.componentType = 'mixedChart'
          item.component = 'mixedChart'
          item.componentId = 'mixedChart' + index
        }
        if (event === 'workshopTitle') {
          item.componentType = 'workshopTitle'
          item.component = 'workshopTitle'
          item.componentId = 'workshopTitle' + index
        }
        if (event === 'caption') {
          item.componentType = 'captionChart'
          item.component = 'captionChart'
          item.componentId = 'captionChart' + index
        }
        if (event === 'message') {
          item.componentType = 'messageAll'
          item.component = 'messageAll'
          item.componentId = 'messageAll' + index
        }
        console.log(this.layout)
      },
      moveEvent: function(i, newX, newY){
        console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
      },
      movedEvent: function(i, newX, newY){
        console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
      },
      // 保存看板布局
      saveLayout() {
        var qs = require('qs')
        let params = {
          // layoutDetails: JSON.stringify(this.layout)
          layoutDetails: this.layout
        }
        // let dataPost = qs.stringify(params)
        let dataPost = JSON.stringify(this.layout)


        // let params = new URLSearchParams();
        // params.append('layoutDetails',this.layout);
        // params.append('layoutDetails',JSON.stringify(this.layout));
        // let dataPost = qs.stringify({ 'layoutDetails': JSON.stringify(this.layout)}, { indices: false });
        // let dataPost = qs.stringify({ 'layoutDetails': this.layout});
        // let dataPost = qs.stringify({ 'layoutDetails': this.layout}, {arrayFormat: 'indices', allowDots: true})
        saveLayoutByBoard(this.boardId, dataPost).then((res) => {
          this.$notify({
            title: '成功',
            message: '布局保存成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '布局保存失败',
            type: 'error',
            duration: 2000
          })
        })
      }
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
    height: calc(100% - 30px);
    /*background-color: rgba(64,158,255,0.3);*/
  }
  .drag-content .el-col{
    height: 100%;
  }
  .griditem {
    /*padding: 3px;*/
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: rgb(140, 140, 140) 0.2em 0.2em 0.5em;
    /*box-shadow: rgb(102, 102, 102) 0.2em 0.2em 0.5em;*/
  }
  .drag-title .el-dropdown {
    float: right;
    margin-right: 10px;
    cursor: pointer;
  }
  .drag-title .ico {
    height: 30px;
    line-height: 30px;
    background-color: rgba(64,158,255,0.6);
    border-radius:3px 3px 0 0;
  }
  .drag-title .el-dropdown-link {
    /*color: #fff;*/
    color: #777;
  }
  /*.drag-title {
    margin-top: 20px;
  }*/
  /*.el-button+.el-button {
    margin-left: 0;
  }*/
</style>
