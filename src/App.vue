<template>

    <div class="container">

        <h2>TEMPERATURE & HUMIDITY</h2>
      <vue-loading v-if="!loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>

        <div class="Chart" v-if="loading">
          <div id="charInfo-left">
          <p>Device Number : {{ devNum }}</p>
          <p>Current-Temperature : {{ curTemp }}</p>
          <p>Current-Humidity : {{ curHumi }}</p>
          </div>

          <div id="charInfo-right">
            <p class="displayName">State of Temperature : <button id="btn-temp" :style="{ 'background-color' :  tColor}" > {{ tempState }}</button> </p>
            <p class="displayName">State of Humidity : <button id="btn-humi" :style="{ 'background-color' :  hColor}" > {{ humiState }}</button></p>

          </div>

          <chart :chartData="data" :options="options" :width="500" :height="250"></chart>
        </div>

    </div>

</template>

<script>
import Chart from './chart.js'
import Moment from "moment"
import vueLoading from 'vue-loading-template'

var tempInfo = [];
var humidInfo = [];
var currenTime = [];

var options = { responsive: true, maintainAspectRatio: false };


export default {
  name: "lineChart",
  data() {
    return {

      data: null,
      options: options,
      devNum: null,
      curTemp: null,
      curHumi: null,
      tempState: '',
      humiState: '',
      tColor: '',
      hColor: '',
      loading : false

    };
  },
  mounted() {
    this.$wamp
      .subscribe(
        "com.test.both",
        function(args, kwArgs, details) {
          // component context is available
          //console.log("Current args: " + args)
          console.log("Current args: " + args[1])
          console.log("Current args: " + args[2])

          var now = new Moment()
          var time = now.format("HH:mm:ss")

          const device = args[0]
          const temp = args[1].toFixed(2)
          const humi = args[2].toFixed(2)

          if( temp  > 34) {this.tempState = 'H'; this.tColor = 'red'}
          else if ( temp < -5) { this.tempState = 'L'; this.tColor= 'blue'}
          else { this.tempState  = 'N'; this.tColor = 'green'}

          if( humi  > 40) {this.humiState = 'H'; this.hColor = 'red'}
          else if ( humi < 22) { this.humiState = 'L'; this.hColor = 'blue'}
          else { this.humiState  = 'N'; this.hColor = 'green'}

          tempInfo.push(temp)
          humidInfo.push(humi)
          currenTime.push(time)

         if(tempInfo.length > 0) { this.loading = true}

          this.devNum = device
          this.curTemp = temp
          this.curHumi = humi


          //return this.foo;

          if (tempInfo.length == 9) {
            tempInfo.shift()
            humidInfo.shift()
            currenTime.shift()
          }

          this.data = {
            labels: currenTime,
            datasets: [
              {
                label: "TEMPERATURE",
                fill: false,
                borderColor: "#FC2525",
                backgroundColor: "#FC2525",
                data: tempInfo
              },
              {
                label: "HUMIDITY",
                fill: false,
                borderColor: "#05CBE1",
                backgroundColor: "#05CBE1",
                data: humidInfo
              }
            ]
          };
        },
        {
          acknowledge: true // option needed for promise, automatically added
        }
      )
      .then(function(s) {
        console.log("AutobahnJS Subscription object: ", s)
      });
  },
  components: {
    Chart,
    vueLoading
  }
}
</script>

<style scoped>
  #charInfo-left {
    float : left;
    margin-left : 10px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  #charInfo-right {
    float : left;
    margin-left : 100px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .displayName {
    margin-top: 20px;
  }


  #btn-temp {
    border-radius: 50%;
    float: right;
    height: 30px;
    width: 30px;
    color: white;
    margin-left: 50px;
  }

  #btn-humi {
    border-radius: 50%;
    float: right;
    height: 30px;
    width: 30px;
    color: white;
    margin-left: 50px;
  }


</style>
