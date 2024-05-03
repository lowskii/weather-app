const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;
const parser = new xml2js.Parser();
const yrApiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/classic?lat=55.45&lon=37.36&altitude=144`;


app.use(cors({
    origin: 'http://localhost:5173'  // Укажите URL вашего клиентского приложения
}));

app.get('/weather', async (req, res) => {
    try {
        const response = await axios.get(yrApiUrl, {
            headers: { 'User-Agent': 'WeatherApp lowskillboy03@gmail.com' }
        });
        const xmlData = response.data;
        const parser = new xml2js.Parser();

        // Парсинг XML данных
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                res.status(500).send('Failed to parse XML data');
                return;
            }
        
            // Обработка данных
            const weatherEntries = result.weatherdata.product[0].time;
            const structuredData = [];
        
            weatherEntries.forEach((entry, index) => {
                const from = entry.$.from;
                const to = entry.$.to;
                const location = entry.location[0];
        
                if (from === to) {
                    const weatherInfo = {
                        date: from.split('T')[0],
                        time: from.split('T')[1].substring(0, 5),
                        toTime: to.split('T')[1].substring(0, 5),
                        temperature: location.temperature ? location.temperature[0].$.value : undefined,
                        precipitation: (index > 0 && weatherEntries[index - 1].$.from === from) ? weatherEntries[index - 1].location[0].precipitation[0].$.value : undefined
                    };
        
                    structuredData.push(weatherInfo);
                }
            });
        
            // Отправка данных
            res.json(structuredData);
        });

    } catch (error) {
        console.error('Failed to retrieve weather data:', error);
        res.status(500).send('Failed to retrieve data');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});