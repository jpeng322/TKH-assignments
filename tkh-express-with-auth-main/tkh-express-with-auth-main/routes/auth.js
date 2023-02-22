import express from "express";
import jwt from "jsonwebtoken"
// import prisma from "../../db/index.js";
import argon2 from "argon2";
import prisma from "../db/index.js"

const router = express.Router();

router.post("/login", async (request, response) => {

  try {
  const foundUser = await prisma.user.findFirst({
    where: {
      username: request.body.username
    }
  });

    if (foundUser) {
      try {
      const verifyPassword = await argon2.verify(foundUser.password, request.body.password);

      if (verifyPassword) {
        console.log("pass verified")
        const token = jwt.sign({username: foundUser.username, id: foundUser.id}, "thisIsAsECRETkEY")
        
        response.status(200).json({
          success: true,
          token
        })
      } else {
        response.status(401).json({
          success:false,
          message: "Wrong username or password"
        })
      }
 
    } catch(e) {
      console.log(e)
       response.status(500).json({
        success:false,
        message: "Something went wrong"
       })
    }
  }
  //Handle login 
}catch(e) {
  response.status(500).json({
    success:false,
    message: "Something went wrong"})
}}); 

router.post("/signup", async (request, response) => {
  //handle signup
  console.log(request.body.username, request.body.password)
  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        username: request.body.username
      }
    });

    if (foundUser) {
      response.status(401).json({
        success: false,
        message: "User already exists"
      });
    } else {
      try {
        const hashedPassword = await argon2.hash(request.body.password)

        const newUser = await prisma.user.create({
          data: {
            username: request.body.username,
            password: hashedPassword
          }
        });

        if (newUser) {
          response.status(201).json({
            success: true,
            message: "User successfully created"
          })
        } else {
          response.status(500).json({
            success: false,
            message: "User was not created. Something happened"
          });
        };
      } catch (e) {
        response.status(500).json({
          success: false,
          message: "User was not created. Something happened"
        });
      }
    }
  } catch (e) {
    response.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
});

export default router;
