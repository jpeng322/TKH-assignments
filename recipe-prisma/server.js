import express from "express"
import recipeRouter from "./routes/recipes.js"
import userRouter from "./routes/users.js"
import passport from "passport"
import authRouter from "./routes/auth.js"
import setupJWTStrategy from "./auth/index.js"

const app = express()

app.use(express.json())

setupJWTStrategy(passport)

app.use("/auth", authRouter)


app.use("/recipes", recipeRouter)

app.use("/users", userRouter)

app.listen(3000, err => {
    console.log("Server listening on 3000")
}) 