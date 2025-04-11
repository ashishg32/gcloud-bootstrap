import { Router } from 'express';
import pJSON from '../../package.json';

const router = Router();
router.get('/', ((req, res) => {
    res.json({
        version: pJSON.version
    })
}));

export default router;