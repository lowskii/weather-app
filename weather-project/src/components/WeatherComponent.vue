<script setup>
import { ref } from 'vue';
import axios from 'axios';

const weatherData = ref(null);
const weatherDetails = ref([]);
const currentDate = new Date().toISOString().split('T')[0];

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
            date: entryDate,
            isCurrentDate: entryDate === currentDate
        });
    });
});

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('ru-RU', options);
};
</script>

<template>
  <div class="weather-container">
    <h1>Данные о погоде</h1>
    <ul>
      <li v-for="detail in weatherDetails" :key="detail.timePeriod" :class="{'current-date': detail.isCurrentDate, 'other-date': !detail.isCurrentDate}">
        <div v-if="detail.isCurrentDate || detail.timePeriod === '14:00'">
          {{ formatDate(detail.date) }} {{ detail.timePeriod }}: {{ detail.temp }}°C
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.weather-container {
    width: 600px;
    height: auto;
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

.current-date {
    background-color: #e0e0e0;
}

.other-date {
    background-color: #c0c0c0;
    display: inline-block;
    padding: 5px;
    margin: 5px;
}

.other-date:not(:hover) {
    cursor: pointer;
    transition: transform 0.3s;
}

.other-date:hover {
    transform: scale(1.1);
}
</style>
