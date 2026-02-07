import express from 'express';

import {createMeal, getAllMeals ,deleteMeal, updateMeal} from '../controller/mealController.js';


const router = express.Router();

router.route('/').post(createMeal).get(getAllMeals);

router.route('/:id').delete(deleteMeal).patch(updateMeal);

export default router;
