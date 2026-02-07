import express from 'express';

import { createOffer, getAllOffers,deleteOffer, updateOffer } from '../controller/offersController.js';

const router = express.Router();

router.route('/').post(createOffer).get(getAllOffers);

router.route('/:id').delete(deleteOffer).patch(updateOffer);

export default router;
