<template>
  <div id="lineChart">
    <div class="container">
      <div class="Chart__list">
        <div class="Chart">
          <h2>TEMPERATURE & HUMIDITY</h2>
          <chart :chart-data="data" :options="options"></chart>
          <!-- <chart :chart-data="displayData" :options="displayOpt"></chart> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from './chart.js'
import Moment from "moment";

const tempInfo = [];
const humidInfo = [];
const currenTime = [];

const options = { responsive: true, maintainAspectRatio: false };

export default {
  name: "lineChart",
  data() {
    return {
      //foo: "bar",
      data: null,
      options: options
    };
  },
  mounted() {

  //  this.$store.dispatch('displayChart');

    this.$wamp
      .subscribe(
        "com.test.both",
        function(args, kwArgs, details) {
          // component context is available
          //console.log("Current args: " + args)
          console.log("Current args: " + args[1]);
          console.log("Current args: " + args[2]);

          var now = new Moment();
          var time = now.format("HH:mm:ss");

          tempInfo.push(args[1]);
          humidInfo.push(args[2]);
          currenTime.push(time);

          //return this.foo;

          if (tempInfo.length == 9) {
            tempInfo.shift();
            humidInfo.shift();
            currenTime.shift();
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
        console.log("AutobahnJS Subscription object: ", s);
      });
  },

  // computed: {
  //   displayData() {
  //     return this.$store.getters.disChartData
  //   },
  //   displayOpt() {
  //     return this.$store.getters.disChartData
  //   }
  // },
  components: {
    Chart
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.container {
  max-width: 800px;
  margin:  0 auto;
}
</style>
