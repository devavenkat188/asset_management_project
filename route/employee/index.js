const express = require('express');
const router = express.Router();
const controller = require('./controller');
const moment = require('moment');

router.get('/create', controller.create);

router.get('/employeefetch/:id', controller.fetch);

router.post('/table', controller.table);

router.put('/edits/:id', controller.addemp);

router.put('/edit/:id', controller.employeeEdit);

module.exports = router;