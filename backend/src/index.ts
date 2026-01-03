import express from "express";
import router from "./routes/merkleRoute.js" 


const app = express();

app.use("/menu", router);
app.listen(3000, () => console.log("Server running"));
