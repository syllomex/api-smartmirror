import axios from 'axios';
import User from '../../models/User';
import { Route } from '../../types/http';
import {
  BadRequest, createController, Handlers, NotFound,
} from '../controller';

const get: Route = async (req, res) => {
  const { latitude, longitude, id } = req.query;

  if (!id && (!latitude || !longitude)) throw new BadRequest('Informe o ID do usuário ou a latitude e longitude.');

  const coords = await (async () => {
    if (latitude && longitude) return { lat: latitude, lon: longitude };

    const user = await User.findById(id);
    if (!user) return null;

    return { lat: user.latitude, lon: user.longitude };
  })();

  if (coords === null) throw new NotFound('Geolocalização do usuário não encontrada.');

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${process.env.OPEN_WEATHER_KEY}&lang=pt_br&units=metric`;

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
