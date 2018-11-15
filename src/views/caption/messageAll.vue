<template>
  <div style="width: 100%;height: 100%;background: red;color: yellow;position: absolute;
display: flex;align-items: center;justify-content: center;">
    <h1>
      {{ msg }}
    </h1>

  </div>
</template>

<script>
  /*eslint-disable*/
  export default {
    name: "message-all",
    data() {
      return {
        msg: '看板系统支持在船厂车间部署数字化显示设备为车间工人提供相关生产信息显示。'
      }
    },
    created() {
      this.lang()
    },
    methods: {
      lang() {
        let that = this;

        setInterval(function () {  //定时任务
          //console.log(that.msg);
          let first = that.msg.substring(0, 1);
          let end = that.msg.substring(1);
          that.msg = end + first;
        }, 600);
      }
    }
  }
</script>

<style scoped>

</style>
