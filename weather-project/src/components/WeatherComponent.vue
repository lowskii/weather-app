<script setup>
import { ref } from 'vue';
import axios from 'axios';

const weatherData = ref(null);
const weatherDetails = ref([]);

axios.get('http://localhost:3000/weather').then((response) => {
    weatherData.value = response.data;

    // Фильтрация и обработка данных за сегодняшний день
    weatherData.value.forEach((entry) => {
      const entryDate = entry.date;  
      const entryTime = entry.time; 
        const temp = entry.temperature || 'No data';
        weatherDetails.value.push({
            timePeriod: entryTime,
            temp: temp,
            date: entryDate
        });
    });
});


</script>

<template>
    <div class="weather-container">
      <h1>Данные о погоде</h1>
      <ul>
        <li v-for="detail in weatherDetails" :key="detail.timePeriod">
         {{ detail.date }} {{ detail.timePeriod }}: {{ detail.temp }}°C
        </li>
      </ul>
    </div>
  </template>

<style scoped>
.weather-container {
    width: 600px;
    height: 500px;
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
  }

p, h1, li {
    font-size: 24px;
    font-weight: bold;
    color: black;
}
</style>