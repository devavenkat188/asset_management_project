const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/category', controller.category);

router.get('/categoryfetch/:id', controller.fetch);

router.post('/ctable', controller.table);

router.put('/modify/:id', controller.modify);
module.exports = router;