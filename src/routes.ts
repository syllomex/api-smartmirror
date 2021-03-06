import { Router } from 'express';
import agendaController from './controllers/agenda-controller';
import authController from './controllers/auth-controller';
import mailController from './controllers/mail-controller';
import mirrorController from './controllers/mirror-controller';

import userController from './controllers/user-controller';
import weatherController from './controllers/weather-controller';

const router = Router({ mergeParams: true });

router.post('/create-user', (req, res) => userController.create(req, res));
router.post('/sign-in', (req, res) => authController.signIn(req, res));

router.post('/geolocation', (req, res) => userController.storeGeolocation(req, res));

router.post('/mirrors', (req, res) => mirrorController.create(req, res));
router.get('/mirrors', (req, res) => mirrorController.show(req, res));
router.post('/mirrors/connect', (req, res) => mirrorController.connect(req, res));
router.delete('/mirrors', (req, res) => mirrorController.disconnect(req, res));
router.get('/mirrors/isConnected', (req, res) => mirrorController.isConnected(req, res));
router.get('/mirrors/widgets', (req, res) => mirrorController.widgets(req, res));

router.post('/store-token', (req, res) => authController.storeToken(req, res));

router.get('/mails', (req, res) => mailController.list(req, res));
router.get('/calendars', (req, res) => agendaController.list(req, res));

router.get('/weather', (req, res) => weatherController.get(req, res));

export default router;
