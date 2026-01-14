import express from "express";
import {getHome, getLeaf} from "../controllers/merkleController.js";
import type { SelfProof } from "o1js";

const router = express.Router();

router.get('/home', getHome);
router.post('/merkle', getLeaf);



export default router;



