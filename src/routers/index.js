import express from 'express';
import authRouter from './authRouter';
var rootRouter = express.Router();


authRouter(rootRouter);

export default rootRouter;