import axios from 'axios';
import { Route } from '../../types/http';
import { BadRequest, createController, Handlers } from '../controller';

const get: Route = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) throw new BadRequest('Latitude ou longitude não informadas.');

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_KEY}&lang=pt_br&units=metric`;

  const response = await axios.get(url);

  const data = {
    description: response.data.weather[0].description,
    temperature: response.data.main.temp,
    icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
  };

  return res.json({ success: true, data });
};

const weatherController: Handlers = {
  get: async (req, res) => createController(get, req, res),
};

export default weatherController;
