<template>
  <div class="">
    <!--消息推送-->
    <div id="messageBox" v-if="showMesBox">
      <vue-seamless-scroll :data="listData" :class-option="scrollOption" class="seamless-warp" id="scrollComp">
        <ul class="item" id="scrollUl">
          <li :style="{'font-family': item.fontFamily}" v-for="item in listData" v-text="item.title">
            <!--<span class="title" v-text="item.title" :style="{'font-family': item.fontFamily}"></span>-->
          </li>
        </ul>
      </vue-seamless-scroll>
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
          :useCssTransforms="true"
          :vertical-compact="true"
          :margin="margin"
          :use-css-transforms="true">
          <grid-item v-for="(item,index) in layout"
                     :key="item.i"
                     :x="item.x"
                     :y="item.y"
                     :w="item.w"
                     :h="item.h"
                     :i="item.i"
                     :style="{'border': border}"
                     class="griditem">
            <el-row class="drag-content">
              <el-col :span="24">
                <component v-bind:is="item.component" :id="item.componentId"></component>
              </el-col>
            </el-row>
          </grid-item>
        </grid-layout>
      </div>
    </div>

    <!--<div id="onlineheartbeatmessages" style="font-family: Microsoft YaHei">

    </div>-->
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
  import vueSeamless from 'vue-seamless-scroll'
  import { saveLayoutByBoard, getLayoutByBoard, getIPByBoard } from '@/api/board'
  import { userBoardsList } from '@/api/userBoard'
  import Stomp from 'stompjs'
  import SockJS from 'sockjs-client'

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
      captionChart,
      vueSeamless,
      messageAll
    },
    data() {
      return {
        showMesBox: false,
        border: '',
        margin: [0, 0],
        boardId: '',
        layoutDialogVisible: false,
        layouttype: "A",
        layout: [
          {"x": 0, "y": 0, "w": 2, "h": 5, "i": "B0", component: ""},
          {"x": 2, "y": 0, "w": 2, "h": 5, "i": "B1", component: ""},
          {"x": 0, "y": 5, "w": 2, "h": 5, "i": "B2", component: ""},
          {"x": 2, "y": 5, "w": 2, "h": 5, "i": "B3", component: ""},
        ],
        layTable: [
          {id: 1, src: require("../../assets/images/布局1.png"), laytype: "type1"},
          {id: 2, src: require("../../assets/images/布局2.png"), laytype: "type2"},
          {id: 3, src: require("../../assets/images/布局3.png"), laytype: "type3"}
        ],
        listData: [{
          'title': '',
          'date': '',
          'fontFamily': ''
        }],
        scrollOption: {
          /*limitMoveNum: 1,
          hoverStop: false*/
          direction: 2,
          limitMoveNum: 1,
          step: 1,
          hoverStop: false
        },
        fontFamily: '',
        IP: ''
      }
    },
    created() {
      this.getUserBoard()
      this.getIP()
      this.getMessage()
    },
    mounted() {
      this.$nextTick(() => {
      })
    },
    methods: {
      getUserBoard() {
        /*userBoardsList().then((res) => {
          if (res.data.data.layoutDetailEntities) {
            let layoutData = res.data.data.layoutDetailEntities
            this.layout = []
            layoutData.forEach((item, index) => {
              let tempItem = Object.assign({}, item)
              tempItem.component = ''
              this.layout.push(tempItem)
              if (item.component.length > 0) {
                if(item.component === 'messageAll'){
                  this.margin = [0, 0];
                  this.border = 0;
                }else {
                  this.margin = [10, 10];
                  this.border = '1px solid #ddd;';
                }
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
        })*/
        // this.$axios.get('http://192.168.31.13:8080/' + "boards/show-layout",
        // 此处请求的是服务器接口地址
        this.$axios.get('http://192.168.43.114:8080/' + "boards/show-layout",
          {
            // 这个头的作用是为了通过项目的axios请求拦截器，否则会被token超时登出
            headers: {
              roleInfo: 'userBoard'
            }
          }
        ).then((res) => {
          if (res.data.data.layoutDetailEntities) {
            let layoutData = res.data.data.layoutDetailEntities
            this.layout = []
            layoutData.forEach((item, index) => {
              let tempItem = Object.assign({}, item)
              tempItem.component = ''
              this.layout.push(tempItem)
              if (item.component.length > 0) {
                if(item.component === 'messageAll'){
                  this.margin = [0, 0]
                  this.border = 0
                }else {
                  this.margin = [10, 10]
                  this.border = '1px solid #ddd;'
                }
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

      getIP() {
        /*getIPByBoard().then((res) => {
            this.IP = res.data.data
        })*/
        // this.$axios.get('http://192.168.31.13:8080/' + 'boards/IP',
        // 此处请求的是服务器接口地址
        this.$axios.get('http://192.168.43.114:8080/' + 'boards/IP',
          {
            // 这个头的作用是为了通过项目的axios请求拦截器，否则会被token超时登出
            headers: {
              roleInfo: 'userBoard'
            }
          }
        ).then((res) => {
          this.IP = res.data.data
        })
      },

      getMessage() {
        // let url = 'http://192.168.31.13:8080' + '/board-web-socket'
        // 此处请求的是服务器接口地址
        let url = 'http://192.168.43.114:8080' + '/board-web-socket'
        let socket = new SockJS(url)
        let stompClient = Stomp.over(socket);
        let that = this;
        stompClient.connect({}, function (frame) {
          console.log(that.IP)
          stompClient.subscribe('/push-messages/' + that.IP, function (response) {
            let resBody = response.body
            let resBody2 = resBody.replace(/[\\]/g, '')
            that.webResBody = JSON.parse(resBody2)
           // $("#onlineheartbeatmessages").html(resBody);

            if(that.webResBody.content !== null){

              that.showMesBox = true
              console.log(document.getElementById("messageBox"))
              console.log(that.webResBody.direction)
              if (that.webResBody.direction === 'bottom') {
                that.scrollOption.direction = 0
              } else if (that.webResBody.direction === 'top') {
                that.scrollOption.direction = 1
              } else if (that.webResBody.direction === 'left') {
                that.scrollOption.direction = 2
              } else if (that.webResBody.direction === 'right') {
                that.scrollOption.direction = 3
              }

              if (that.webResBody.font === '微软雅黑') {
                that.listData[0].fontFamily = "Microsoft YaHei"
              } else if (that.webResBody.font === '宋体') {
                that.listData[0].fontFamily = 'Simsun'
              } else if (that.webResBody.font === '楷体') {
                that.listData[0].fontFamily = 'KaiTi'
              }

              that.listData[0].title = that.webResBody.content

              that.scrollOption.step = that.webResBody.speed

              let timeOut = that.webResBody.duration * 60 * 60 * 1000

              // let timeOut = 10000;
              setTimeout(() => {
                that.showMesBox = false
                console.log(that.showMesBox)
              },timeOut)
            }

          });

          stompClient.subscribe('/refresh/' + that.IP, function (response) {
            let resBody = response.body
            if(resBody){
              window.location.reload()
            }

          });
        });
      },
    },
    computed: {
      optionLeft () {
        return {
          direction: this.scrollOption.direction,
          limitMoveNum: this.scrollOption.limitMoveNum,
          step: this.scrollOption.step,
          hoverStop: false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .seamless-warp {
    overflow: hidden;
    height: 70px;
    /*width: 380px;*/
    width: 1366px;
    ul.item {
      width: 1566px;
      float: right;
      li {
        float: right;
        margin-right: 10px;
        margin-top: -20px;
        z-index: 1000;
      }
    }
  }

  ul {
    list-style: none;
  }


  /*.item {

    width: 100%;
  }*/

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

  .drag-content .el-col {
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
    background-color: rgba(64, 158, 255, 0.6);
    border-radius: 3px 3px 0 0;
  }

  .drag-title .el-dropdown-link {
    /*color: #fff;*/
    color: #777;
  }

  #messageBox {
    position: absolute;
    width: 100%;
    height: 70px;
    line-height: 50px;
    z-index: 100;
    background-color: red;
    color: yellow;
    font-size: 30px;
  }

  /*.seamless-warp {
    !*position: absolute;
    top: 0;
    left: 0;*!
    width: 100%;
    height: 70px;
    overflow: hidden;
  }

  .seamless-warp {
    overflow: hidden;
    height: 70px;
    !*width: 380px;*!
  }*/
  /*ul.item {
    width: 580px;
  }*/

    /*li {
      float: left;
      margin-right: 10px;
    }

  .title {
    width: 100%;
  }*/

  /*.seamless-warp ul.item {
    width: 580px;
  }
  .seamless-warp ul.item li {
    float: left;
    margin-right: 10px;
  }*/
  /*.drag-title {
    margin-top: 20px;
  }*/
  /*.el-button+.el-button {
    margin-left: 0;
  }*/
</style>
