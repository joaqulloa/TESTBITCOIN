const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3001;

app.use(cors()); 

//Bienvenida en '/'
app.get('/', async (req, res) => {
    res.json({ mensaje: '¡Bienvenido a mi aplicación!' });
  });

//GET trades de BTC-CLP
app.get('/consultar-precios', async (req, res) => {
    try {
      //const { mes_inicial, mes_final } = req.query;
      const { mes_inicial, mes_final } = req.query;
  
      // Convertir meses a marcas de tiempo UNIX
      const mesInicialTimestamp = new Date(`${mes_inicial}-01T00:00:00Z`).getTime();
      const mesFinalTimestamp = new Date(`${mes_final}-01T00:00:00Z`).getTime();
  
      // Array para almacenar los resultados de cada mes
      const resultadosPorMes = [];
  
      // Iterar por cada mes en el rango dado
      for (let timestamp = mesInicialTimestamp; timestamp <= mesFinalTimestamp; timestamp += 2629800000) { // Aproximadamente 30 días en milisegundos
        const response = await axios.get('https://www.buda.com/api/v2/markets/btc-clp/trades', {
          params: {
            timestamp: timestamp.toString(),
            limit: 1,
          },
        });
  
        // Almacenar el resultado en el array
        resultadosPorMes.push({
          timestamp: timestamp,
          valorBitcoin: response.data,
        });
      }
  
      res.json(resultadosPorMes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al consultar la API de Buda' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});





