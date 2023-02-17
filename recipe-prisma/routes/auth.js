import express from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import prisma from "../db/index.js";

const router = express.Router()

router.post("/login", async (request, response) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: request.body.username
            }
        })

        try {

            if (user) {
                const verifiedPassword = await argon2.verify(user.password, request.body.password)

                if (verifiedPassword) {
                    const token = jwt.sign({ username: user.username, id: user.id }, "catcatcat")

                    response.status(200).json({
                        success: true,
                        token
                    })
                } else {
                    response.status(401).json({
                        success: false,
                        message: "Wrong username or password"
                    })
                }

            } else {
                response.status(401).json({
                    success: false,
                    message: "User does not exist"
                })
            }
        }

        catch (e) {
            console.log(e)
            response.status(500).json({
                success: false,
                message: "Something went wrong."
            })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }


})

router.post("/signup", async (request, response) => {
    try {
        const foundUser = await prisma.user.findFirst({
            where: {
                username: request.body.username
            }
        })
        if (foundUser) {
            response.status(400).json({
                success: false,
                message: "User already exists."
            })
        } else {
            try {
                const hashedPassword = await argon2.hash(request.body.password)

                const newUser = await prisma.user.create({
                    data: {
                        username: request.body.username,
                        password: hashedPassword
                    }
                })
                if (newUser) {
                    response.status(201).json({
                        success: true,
                        message: "User created successfully"
                    })
                } else {
                    response.status(500).json({
                        success: false,
                        message: "User could not be created"
                    })
                }
            } catch (e) {
                console.log(e)
                response.status(500).json({
                    success: false,
                    message: "User could not be created. Something went wrong."
                })

            }
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({
            success: false,
            message: "User could not be created. Something went wrong."
        })
    }
})

export default router