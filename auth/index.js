const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const db = require("../db")
require("dotenv").config();


//Register a new user
//Works!
router.post("/register", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      const userId = user.id;
  

      const token = jwt.sign({ id: userId }, process.env.JWT);
      res.status(201).send({ token });
    } catch (error) {
      next(error);
    }
  });

//Login an existing user
//Works!
  router.post("/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      console.log(user);
  
      if (!user) {
        return res.status(401).send("Invalid login credentials.");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(402).send("Wrong login credentials.");
      }
      const userId = user.id;
  
      // Create a token with the user id
      const token = jwt.sign({ id: userId }, process.env.JWT);
  
      res.send({ token });
    } catch (error) {
      next(error);
    }
  });
  


  module.exports = router;
