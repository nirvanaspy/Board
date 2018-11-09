<template>
  <div class="app-container calendar-list-container">
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
                     class="griditem">
            <!--<el-row class="drag-title">
              &lt;!&ndash;<el-col :span="12">新增人员过滤器{   过滤器：所有人，频率：每天   }</el-col>&ndash;&gt;
              <el-col :span="24" class="ico">
                <el-dropdown trigger="click" @command="handleCommand(item, index, $event)">
									  <span class="el-dropdown-link">
									    <strong>选择图标类型</strong><i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
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
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>-->
            <el-row class="drag-content">
              <el-col :span="24">
                <component v-bind:is="item.component" :id="item.componentId"></component>
              </el-col>
            </el-row>
          </grid-item>
        </grid-layout>
      </div>
    </div>
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
  import { saveLayoutByBoard, getLayoutByBoard } from '@/api/board'
  import { userBoardsList } from '@/api/userBoard'

  let GridLayout = vueGridLayout.GridLayout;
  let GridItem = vueGridLayout.GridItem;
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
      captionChart
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
          {id: 3, src: require("../../assets/images/布局3.png"), laytype: "type3"}
        ]
      }
    },
    created() {
      this.getUserBoard()

    },
    mounted() {
      this.$nextTick(() => {
      })
    },
    methods: {
      getUserBoard() {
        userBoardsList().then((res) => {
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
        })
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
    height: 100%;
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
