import Order from '../models/orderModel.js';
import { createOne, deleteOne, getAll, getOne ,updateOne, deleteAll} from './hendlerFactory.js';

// Create Order -----------------------------------------------------------------------------------
export const createOrder = createOne(Order);

// Get All Orders -----------------------------------------------------------------------------------
export const getAllOrders = getAll(Order);

// Get One Order -----------------------------------------------------------------------------------
export const getOrder = getOne(Order);

// Update Order -----------------------------------------------------------------------------------
export const updateOrder = updateOne(Order);

// Delete Order -----------------------------------------------------------------------------------
export const deleteOrder = deleteOne(Order);

// Delete All Orders -----------------------------------------------------------------------------------
export const deleteAllOrders = deleteAll(Order);
