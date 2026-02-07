import Offer from '../models/offerModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
  deleteAll,
} from './hendlerFactory.js';

// Create Offer -----------------------------------------------------------------------------------
export const createOffer = createOne(Offer);

// Get All Offers -----------------------------------------------------------------------------------
export const getAllOffers = getAll(Offer);

// Update Offer -----------------------------------------------------------------------------------
export const updateOffer = updateOne(Offer);

// Delete Offer -----------------------------------------------------------------------------------
export const deleteOffer = deleteOne(Offer);

// Delete All Offers -----------------------------------------------------------------------------------
export const deleteAllOffers = deleteAll(Offer);
