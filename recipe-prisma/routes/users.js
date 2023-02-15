import express from "express";
import prisma from "../db/index.js"



const router = express.Router()



router.get("/", async (request, response) => {
    try {
        const foundAllUser = await prisma.user.findMany({
            include: {
                recipes: true
            }
        })

        if (foundAllUser) {
            response.status(200).json({
                success: true,
                message: "Found all users",
                foundAllUser
            })
        } else {
            response.status(500).json({
                success: false,
                message: "Users not found"
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

router.get("/:id", async (request, response) => {
    try {
        const foundUser = await prisma.user.findUnique({
            where: {
                id: parseInt(request.params.id)
            },
            include: {
                recipes: true
            }
        })
        if (foundUser) {
            response.status(200).json({
                success: true,
                message: "User found",
                foundUser
            })
        } else {
            response.status(500).json({
                success: false,
                message: "User not found"
            })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
})

router.post("/", async (request, response) => {

    try {
        const newUser = await prisma.user.create({
            data: {
                username: request.body.username,
            }
        })

        if (newUser) {
            response.status(201).json({
                success: true,
                message: "User created"
            })
        } else {
            response.status(500).json({
                success: false,
                message: "Error. User was not created"
            })
            console.log(e)
        }
    }
    catch (e) {
        response.status(500).json({
            success: false,
            message: "Something went wrong"
        })
        console.log(e)
    }

})

router.delete("/:id", async (request, response) => {

    try {
        const deletedUser = await prisma.user.delete({
            where: {
                id: parseInt(request.params.id)
            }
        })

        if (deletedUser) {
            response.status(204).json({
                success: "true",
                message: "User deleted",
                deletedUser
            })
        } else {
            response.status(500).json({
                success: "false",
                message: "User not found"
            })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({
            success: "false",
            message: "Something went wrong"
        })
    }
})


router.put("/:id", async (request, response) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(request.params.id)
            }
            ,
            data: {
                username: request.body.username
            }
        })

        if (updatedUser) {
            response.status(200).json({
                success: "true",
                message: "User updated",
                updatedUser
            })
        } else {
            response.status(500).json({
                success: "false",
                message: "User not found"
            })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({
            success: "false",
            message: "Something went wrong"
        })
    }
})


export default router