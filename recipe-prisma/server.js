import express from "express"
import recipeRouter from "./routes/recipes.js"
import userRouter from "./routes/users.js"
const app = express()

app.use(express.json())

app.use("/recipes", recipeRouter)

app.use("/users", userRouter)

app.listen(3000, err => {
    console.log("Server listening on 3000")
}) 