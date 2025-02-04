import { Router } from "express";

const orderRouter = Router();

// get order list
orderRouter.get("/", (req, res, next) => {
  res.status(200).json({
    message: "all orders",
  });
});

//get one order
orderRouter.get("/order/:id", (req, res, next) => {
  res.status(200).json({
    message: "here is a single order",
  });
});

// add order
orderRouter.post("/", (req, res, next) => {
  res.status(201).json({
    message: "new order placed",
  });
});

//delete order
orderRouter.delete("/:orderid", (req, res, next) => {
  res.status(200).json({
    message: " order deleted",
  });
});

export default orderRouter;
