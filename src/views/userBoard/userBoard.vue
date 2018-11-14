<template>
  <div class="app-container calendar-list-container">
    <!--消息推送-->
    <div id="messageBox">
      <vue-seamless-scroll :data="listData" :class-option="scrollOption" class="seamless-warp">
        <ul class="item">
          <li v-for="item in listData">
            <span class="title" v-text="item.title" :style="{'font-family': item.fontFamily}"></span><span class="date" v-text="item.date"></span>
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

    <div>
      <span style="font-family: Microsoft YaHei">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</span><br>
      <span style="font-family: KaiTi">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</span><br>
      <span style="font-family: Simsun">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</span><br>
    </div>
    <div id="onlineheartbeatmessages" style="font-family: Microsoft YaHei">

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
  import vueSeamless from 'vue-seamless-scroll'
  import {saveLayoutByBoard, getLayoutByBoard} from '@/api/board'
  import {userBoardsList} from '@/api/userBoard'
  import service from '@/utils/request'
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
      vueSeamless
    },
    data() {
      return {
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
          direction: 0,
          limitMoveNum: 1,
          hoverStop: false
        },
        fontFamily: ''
      }
    },
    created() {
      this.getUserBoard()
      this.getMessage()

    },
    mounted() {
      this.$nextTick(() => {
      })
    },
    methods: {
      getUserBoard() {
        userBoardsList().then((res) => {
          if (res.data.data.layoutDetailEntities) {
            let layoutData = res.data.data.layoutDetailEntities
            this.layout = []
            layoutData.forEach((item, index) => {
              let tempItem = Object.assign({}, item)
              tempItem.component = ''
              this.layout.push(tempItem)
              if (item.component.length > 0) {
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

      getMessage() {
        let url = service.defaults.baseURL + '/board-web-socket';
        let socket = new SockJS(url);
        let stompClient = Stomp.over(socket);
        let that = this;
        stompClient.connect({}, function (frame) {
          stompClient.subscribe('/push-messages/192.168.31.134', function (response) {
            let resBody = response.body;
            let resBody2 = resBody.replace(/[\\]/g, '');
            that.webResBody = JSON.parse(resBody2);
            $("#onlineheartbeatmessages").html(resBody);
//debugger;
            that.listData[0].title = that.webResBody.content;

            console.log(that.webResBody.direction)
            if(that.webResBody.direction === 'bottom'){
              that.scrollOption.direction = 0
            }else if(that.webResBody.direction === 'top'){
              that.scrollOption.direction = 1
            }else if(that.webResBody.direction === 'left'){
              that.scrollOption.direction = 2;
            }else if(that.webResBody.direction === 'right'){
              that.scrollOption.direction = 3;
            }

            if(that.webResBody.font === '微软雅黑') {
              that.listData[0].fontFamily = "Microsoft YaHei";
            }else if(that.webResBody.font === '宋体'){
              that.listData[0].fontFamily = 'Simsun';
            }else if(that.webResBody.font === '楷体'){
              that.listData[0].fontFamily = 'KaiTi';
            }

          });
        });
      }
    }
      /*getIPs(callback){
    var ip_dups = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
      || window.mozRTCPeerConnection
      || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking using an iframe
    if(!RTCPeerConnection){
      //NOTE: you need to have an iframe in the page right above the script tag
      //
      //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
      //<script>...getIPs called in here...
      //
      var win = iframe.contentWindow;
      RTCPeerConnection = win.RTCPeerConnection
        || win.mozRTCPeerConnection
        || win.webkitRTCPeerConnection;
      useWebKit = !!win.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
      optional: [{RtpDataChannels: true}]
    };

    var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate){
      //match just the IP address
      var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
      var ip_addr = ip_regex.exec(candidate)[1];

      //remove duplicates
      if(ip_dups[ip_addr] === undefined)
        callback(ip_addr);

      ip_dups[ip_addr] = true;
    }

    //listen for candidate events
    pc.onicecandidate = function(ice){

      //skip non-candidate events
      if(ice.candidate)
        handleCandidate(ice.candidate.candidate);
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result){

      //trigger the stun server request
      pc.setLocalDescription(result, function(){}, function(){});

    }, function(){});

    //wait for a while to let everything done
    setTimeout(function(){
      //read candidate info from local description
      var lines = pc.localDescription.sdp.split('\n');

      lines.forEach(function(line){
        if(line.indexOf('a=candidate:') === 0)
          handleCandidate(line);
      });
    }, 1000);
  }

  //insert IP addresses into the page
  getIPs(function(ip){
    var li = document.createElement("li");
    li.textContent = ip;

    //local IPs
    if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/))
      document.getElementsByTagName("ul")[0].appendChild(li);

    //IPv6 addresses
    else if (ip.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/))
      document.getElementsByTagName("ul")[2].appendChild(li);

    //assume the rest are public IPs
    else
      document.getElementsByTagName("ul")[1].appendChild(li);
  });
  }*/
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
    height: 120px;
    line-height: 60px;
    z-index: 100;
    background-color: red;
    color: yellow;
    font-size: 40px;
  }

  .seamless-warp {
    /*position: absolute;
    top: 0;
    left: 0;*/
    width: 100%;
    height: 120px;
    overflow: hidden;
  }

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
