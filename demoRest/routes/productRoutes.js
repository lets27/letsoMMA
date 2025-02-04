import { Router } from "express";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
const productRouter = Router();
import crypto from "crypto";

// Login route
// Function to generate a secure CSRF token

productRouter.post("/login", (req, res) => {
  const user = { names: "wagaun", id: 1 };

  sign({ user }, "secretkey", (err, token) => {
    if (err) {
      return res.status(500).json({ message: "Error generating token" });
    }
    res.json({ token });
  });
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const token = bearerHeader.split(" ")[1];

    verify(token, "secretkey", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = decoded.user;
      next();
    });
  } else {
    return res.status(403).json({ message: "No token provided" });
  }
};

// Protected route
productRouter.get("/allproducts", verifyToken, (req, res) => {
  return res.status(200).json({
    message: "Getting all products",
    user: req.user,
  });
});

//get single product route
productRouter.get("/product/:id", (req, res, next) => {
  res.status(200).json({
    message: "here is a product",
  });
});

// add product
productRouter.post("/newProduct", (req, res, next) => {
  res.status(201).json({
    message: "new product added",
  });
});

//delete product
productRouter.delete("/:productid", (req, res, next) => {
  res.status(200).json({
    message: " product deleted",
  });
});

//update product
productRouter.put("/:productid", (req, res, next) => {
  res.status(200).json({
    message: "product updated",
  });
});

export default productRouter;
