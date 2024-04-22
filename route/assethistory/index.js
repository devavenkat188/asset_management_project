const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/history', controller.history);

router.get('/historyfetch/:id', controller.fetch);

router.post('/htable', controller.table);

router.get('/assetname/', controller.assetname);

router.put('/alter/:id', controller.change);

module.exports = router;