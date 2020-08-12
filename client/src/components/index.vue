<template>
  <div  class=boxForm>
    <h1>Estimate your time to the airport!</h1>
    <p>Flight code: </p>
    <select class="form-control" @change="changeCode($event)">
    <option value="" selected disabled>Choose</option>
    <option v-for="(res,index) in flights" :key="res.flight">{{ res.flight }}</option>
    </select>
    <br><br>
    <div v-if="selectedCode!=null">
      <p class='divBar'>This flight takes off at {{ flights[selectedCode-1].scheduledTime }} </p>
      
      <br><p> Set number of transits: </p>
      <div>
        <input v-model="transits" @keypress="isNumber($event)" >
        <button v-on:click="getDuration">Submit</button>
        <p v-if="durations.length==0">Not enough information for so long paths!</p>
        <br><br>
      </div>
      <br><p> Set how many minutes before the departure time you want to get to the airport </p>
      <div>
        <input type="text" autocomplete="off" required v-model="priorTime" @keypress="isNumber($event)" >
        <button v-on:click="getWeather">Submit</button>
        <br><br>
      </div>
      <div  v-if="done==true" v-for="(d,idx) in durations" :key="durations.path">
      <br><br>
        <div class="divBar">Route {{idx+1}}</div>
        <div>
          <ul>
            <li v-for="t in d.path">{{t}}</li>
          </ul> 
          <table>
            <tr>
              <td>Total path duration</td>
              <td>{{parseInt(d.duration/60)}} min {{d.duration%60}} sec</td>
            </tr>
            <tr>
              <td>Estimated waiting time:</td>
              <td>{{weather[idx]}} min</td>
            </tr>
            <tr>
              <td>Estimated time on starting point</td>
              <td>{{parseInt(d.duration/60+1)+weather[idx]+parseInt(priorTime)}} min</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  
  name: 'Home',
  data() {
      return {  
        flights: {},
        selectedCode: null,
        minutes: 0,
        durations: {},
        transits:0,
        hidden: [],
        weather: [],
        done: false,
        priorTime: 0
      }
    },
    mounted() {
      this.getTimetable();  
    },
    methods: {
      changeCode (event) {
        this.selectedCode = event.target.options[event.target.options.selectedIndex].index
      },
      getTimetable() {
        let self = this;
        axios
          .get("http://localhost:3000/routes")
          .then(
            response => (self.flights = response.data)
            )
          .catch(error => alert(error));
    },
    //https://stackoverflow.com/questions/39782176/filter-input-text-only-accept-number-and-dot-vue-js
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        evt.preventDefault();;
      } else {
        return true;
      }
    },
    getDuration(){
      let self = this;
      
      axios
        .get("http://localhost:3000/duration/"+(parseInt(self.transits)+1).toString())
        .then(
          response => (self.durations = response.data)
          )
        .catch(error => alert(error));
    },
    getWeather(){
      self.weather=[]
      for (var i=0; i<this.durations.length; i++){
        let self = this;
        let date_curr = new Date();
        let day_curr = ("0" + date_curr.getDate()).slice(-2);
        let month_curr = ("0" + (date_curr.getMonth() + 1)).slice(-2);
        let year_curr = date_curr.getFullYear();
        let hours = date_curr.getHours();
        let flightTime = self.flights[self.selectedCode-1].scheduledTime.split(":")[0];
        if (parseInt(flightTime)<parseInt(hours)){
          date_curr.setDate(new Date().getDate()+1); 
          day_curr = ("0" + date_curr.getDate()).slice(-2);
          month_curr = ("0" + (date_curr.getMonth() + 1)).slice(-2);
          year_curr = date_curr.getFullYear();
        }
        let date_ob = new Date(month_curr+'-'+day_curr+'-'+year_curr+' '+flightTime+':00:00 GMT+03:00');
        let unixTime = date_ob.getTime()
        
        let path = self.durations[i].path
        axios
          .get("http://localhost:3000/weather/?deviceId="+path[path.length-1]+"&unixTime="+unixTime )
          .then(
            response => (self.weather.push(response.data))
            )
          .catch(error => alert(error));
      }
      this.done=true 
    }
    
  }
}
</script>




