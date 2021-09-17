import { Router } from 'express';
import authController from './controllers/auth-controller';
import mailController from './controllers/mail-controller';
import mirrorController from './controllers/mirror-controller';

import userController from './controllers/user-controller';

const router = Router({ mergeParams: true });

router.post('/create-user', (req, res) => userController.create(req, res));
router.post('/sign-in', (req, res) => authController.signIn(req, res));

router.post('/mirrors', (req, res) => mirrorController.create(req, res));
router.get('/mirrors', (req, res) => mirrorController.show(req, res));
router.post('/mirrors/connect', (req, res) => mirrorController.connect(req, res));
router.delete('/mirrors', (req, res) => mirrorController.disconnect(req, res));
router.get('/mirrors/isConnected', (req, res) => mirrorController.isConnected(req, res));

router.post('/store-token', (req, res) => authController.storeToken(req, res));

router.get('/mails', (req, res) => mailController.list(req, res));

export default router;
