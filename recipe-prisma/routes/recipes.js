import express from "express";
import prisma from "../db/index.js"
import passport from "passport";


const router = express.Router()



//GET Get all recipes without logging in

router.get("/", async (request, response) => {
    try {
        const foundAllRecipes = await prisma.recipe.findMany(
            {
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    }
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


//GET logged in user's recipes -- order of /user and /:id route matters
router.get("/user", passport.authenticate("jwt", { session: false }), async (request, response) => {
    try {
        const foundRecipe = await prisma.recipe.findMany(
            {
                where: {
                    userId: request.user.id
                },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            }
        )
        console.log(foundRecipe)
        if (foundRecipe.length > 0) {
            response.status(200).json({
                success: "true",
                message: "Recipes found",
                foundRecipe
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


//GET Recipe without logging in

router.get("/:id", async (request, response) => {
    try {
        const foundRecipe = await prisma.recipe.findUnique(
            {
                where: { id: parseInt(request.params.id) },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    }
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



//POST recipe linked to logged in user

router.post("/", passport.authenticate("jwt", { session: false }), async (request, response) => {

    try {
        const newRecipe = await prisma.recipe.create({
            data: {
                title: request.body.title,
                userId: request.user.id
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


//Delete recipe only if it is linked to logged in user

router.delete("/:recipeId", passport.authenticate("jwt", { session: false }), async (request, response) => {
    console.log(typeof request.user.id, request.user.id)
    try {
        const deletedRecipe = await prisma.recipe.deleteMany({
            where: {
                id: parseInt(request.params.recipeId),
                userId: request.user.id
            }
        })
        console.log(deletedRecipe.count > 0)

        if (deletedRecipe.count > 0) {
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


//Update recipe only if it is linked to logged in user
router.put("/:recipeId", passport.authenticate("jwt", { session: false }), async (request, response) => {
    try {
        const updatedRecipe = await prisma.recipe.updateMany({
            where: {
                id: parseInt(request.params.recipeId),
                userId: request.user.id
            },
            data: {
                title: request.body.title
            }
        })
        console.log(updatedRecipe)
        if (updatedRecipe.count > 0) {
            response.status(200).json({
                success: true,
                message: `Recipe updated to ${request.body.title}`,
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