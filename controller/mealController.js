import Meal from '../models/mealModel.js';
import {
  createOne,
  deleteAll,
  deleteOne,
  getAll,
  updateOne,
} from './hendlerFactory.js';

// Create Meal -----------------------------------------------------------------------------------
export const createMeal = createOne(Meal);

// Get All Meals -----------------------------------------------------------------------------------
export const getAllMeals = getAll(Meal);

// Update Meal -----------------------------------------------------------------------------------
export const updateMeal = updateOne(Meal);

// Delete Meal -----------------------------------------------------------------------------------
export const deleteMeal = deleteOne(Meal);

// Delete All Meals -----------------------------------------------------------------------------------
export const deleteAllMeals = deleteAll(Meal);
