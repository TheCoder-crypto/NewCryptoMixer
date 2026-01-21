import express from "express";
import {JustHelloTest, getLeaf} from "../controllers/merkleController.ts";
///import { sendJsonRequest } from "../controllers/jsonrequest.ts";
import { RandomLeafTesting } from "../controllers/jsonrequest.ts";
import type { Request, Response } from "express";
import { sendJsonRequest } from "../controllers/jsonrequest.ts";

const router = express.Router();

router.get('/home', JustHelloTest);
router.post('/merkle', getLeaf);
router.get('/sendRequest', sendJsonRequest);


export default router;

