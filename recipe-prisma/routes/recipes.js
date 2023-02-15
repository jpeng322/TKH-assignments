import express from "express";
import prisma from "../db/index.js"



const router = express.Router()



router.get("/", async (request, response) => {
    try {
        const foundAllRecipes = await prisma.recipe.findMany(
            {
                include: {
                    user: true
                }
            }
        )

        if (foundAllRecipes) {
            response.status(200).json({
                success: "true",
                message: "Recipes found",
                foundAllRecipes
            })
        } else {
            response.status(500).json({
                success: "false",
                message: "Recipes not found"
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

router.get("/:id", async (request, response) => {
    try {
        const foundRecipe = await prisma.recipe.findUnique(
            {
                where: { id: parseInt(request.params.id) },
                include: {
                    user: true
                }
            }
        )

        if (foundRecipe) {
            response.status(200).json({
                success: "true",
                message: "Recipe found",
                foundRecipe
            })
        } else {
            response.status(500).json({
                success: "false",
                message: "Recipe not found"
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

router.post("/:userId", async (request, response) => {


    try {
        const newRecipe = await prisma.recipe.create({
            data: {
                title: request.body.title,
                userId: parseInt(request.params.userId)
            }
        })

        if (newRecipe) {
            response.status(200).json({
                success: "true",
                message: "Recipe created"
            })
        } else {
            response.status(500).json({
                success: "false",
                message: "Error. Recipe cannot be created"
            })
        }
    }
    catch (e) {
        console.log(e)
        response.status(500).json({
            success: "false",
            message: "Something went wrong."
        })
    }
})

router.delete("/:id", async (request, response) => {
    try {
        const deletedRecipe = await prisma.recipe.delete({
            where: {
                id: parseInt(request.params.id)
            }
        })

        if (deletedRecipe) {
            response.status(204).json({
                success: true,
                message: "Recipe deleted",
                deletedRecipe
            })
        } else {
            response.status(500).json({
                success: "false",
                message: "Recipe not deleted"
            })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({
            success: "false",
            message: "Something went wrong."
        })
    }
})


router.put("/:id", async (request, response) => {
    try {
        const updatedRecipe = await prisma.recipe.update({
            where: {
                id: parseInt(request.params.id)
            },
            data: {
                title: request.body.title
            }
        })

        if (updatedRecipe) {
            response.status(200).json({
                success: true,
                message: "Recipe updated",
                updatedRecipe
            })
        } else {
            response.status(500).json({
                success: "false",
                message: "No recipe"
            })
        }
    } catch (e) {
        console.log(e)
        response.status(500).json({
            success: "false",
            message: "Something went wrong."
        })
    }
})


export default router