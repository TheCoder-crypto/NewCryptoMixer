import express from "express";
import router from "./routes/merkleRoute.ts" 
import session from "express-session";


const app = express();


app.use( 
  session({
    name: "session_id",           // cookie name
    secret: "supersecretvalue",   // used to sign the session ID cookie
    resave: false,
    saveUninitialized: true,      // creates session for every visitor automatically
    cookie: {
      httpOnly: true,
      secure: false,              // true if using HTTPS
      maxAge: 1000 * 60 * 60,     // 1 hour
      sameSite: "lax"
    }
  })
);


app.use(express.json());
app.use("/", router);
app.listen(3000, () => console.log("Server running"));




