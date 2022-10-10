import express from "express";
import {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder
} from "../../controller/orderController";

import {
  authorizeRoles,
  isAuthenticatedUser
} from "../../middleware/authentication";

const orderRoute = express.Router();

orderRoute.route("/order/new").post(isAuthenticatedUser, newOrder);

orderRoute.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

orderRoute.route("/orders/details").get(isAuthenticatedUser, myOrders);

orderRoute
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

orderRoute
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default orderRoute;
