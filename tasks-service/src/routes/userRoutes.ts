import { Router } from 'express';

import { getUsers } from "../controllers/ExternalAPIController";

const router = Router();
router.get('/', getUsers);

export default router;


