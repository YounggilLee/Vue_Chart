<template>
  <div id="app">
    <div class="container">
      <div class="Chart__list">
        <div class="Chart">
          <h2>Linechart</h2>
          <line-example :data="data" :options="options"></line-example>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineExample from './LineChart.js'

var data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Data One',
        fill: false,
        borderColor: '#FC2525',
        backgroundColor: '#FC2525',
        data: [40, 39, 10, 40, 39, 80, 40]
      },{
        label: 'Data Two',
        fill: false,
        borderColor: '#05CBE1',
        backgroundColor: '#05CBE1',
        data: [60, 55, 32, 10, 2, 12, 53]
      }
    ]
  }

  var options = {responsive: true, maintainAspectRatio: false}


export default {
  name: 'app',
  data() {
      return {
        foo: 'bar',
        data : data,
        options: options

      };
    },
    mounted() {
        this.$wamp.subscribe('com.test.both', function(args, kwArgs, details) {
            // component context is available
           
            return this.foo;
        }, {
            acknowledge: true // option needed for promise, automatically added
        }).then(function(s) {
            console.log('AutobahnJS Subscription object: ', s); 
        });
    },
  components: {
    LineExample
  }
}
</script>

<style>
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