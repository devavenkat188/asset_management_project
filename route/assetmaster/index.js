const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/createasset', controller.createasset);

router.get('/assetfetch/:id', controller.fetch);

router.post('/atable', controller.table);

router.put('/change/:id', controller.change);

router.put('/changes/:id', controller.modify);

router.get('/assetissue/:id', controller.assetissue);

router.get('/issue', controller.issue);

router.put('/empid/:id', controller.empid);

router.get('/assetreturn/:id', controller.assetreturn);

router.put('/return/update/:id', controller.returnupdate);

router.get('/assetscrap/:id', controller.assetscrap);

router.put('/scrap/update/:id', controller.scrapupdate);

module.exports = router;