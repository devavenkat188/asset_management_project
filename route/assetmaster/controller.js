const { Asset_Category_Master, Asset_History } = require('../../models');
const Asset_Master = require('../../models/asset_master');
const moment = require('moment');

exports.createasset = async(req, res) => {
    try {
        const user = await Asset_Master.findAll();

        if (!user) {
            return res.send({ success: true, error: 'No Data Found' });
        }
        console.log(user);
        return res.send({ success: true, result: user });
    }
    catch (error) {
        return res.send({ success: false, error: error });
    }
}

exports.fetch = async(req, res) => {
    try {
        const user = await Asset_Master.findOne({
            where: {
                id: req.params.id
            }
        });


        if (!user) {
            return res.send({ success: true, error: 'No Data Found' });
        }

        return res.send({ success: true, result: user });
    }
    catch (error) {
        return res.send({ success: false, error: error });
    }
}

exports.table = async(request, response) => {
    const { serialNumber, assetName, make, model, cost } = request.body;
    try {
        // console.log(dob);
        const value = await Asset_Master.create({
            serialNumber: serialNumber, assetName: assetName,
            make: make, model: model, cost: cost, status: 1

        });
        console.log(value);
        response.send(value);

    }
    catch (error) {
        console.error("Error Creating Table", error);
        response.send("Error");
    }
}

exports.change = async(request, response) => {
    try {
        var asset = await Asset.findOne({
            where: { id: request.params.id }
        });

        if (!asset) {
            return response.send(asset);
            // console.log('Not found');
        }

        asset = await asset.update({
            serialNumber: request.body.serialNumber || asset.serialNumber || '',
            assetName: request.body.assetName || asset.assetName || '',
            make: request.body.make || asset.make || '',
            model: request.body.model || asset.model || '',
            cost: request.body.cost || asset.cost || '',
        });
        return ({ success: true });
    } catch (error) {
        console.log(error);
        return ({ success: true, result: "error fetching data" });
    }
}

exports.modify = async(request, response) => {
    try {
        var asset = await Asset_Master.findOne({
            where: { id: request.params.id }
        });

        if (!asset) {
            return response.send(asset);
            // console.log('Not found');
        }

        asset = await asset.update({
            serialNumber: request.body.serialNumber || asset.serialNumber || '',
            assetName: request.body.assetName || asset.assetName || '',
            make: request.body.make || asset.make || '',
            model: request.body.model || asset.model || '',
            cost: request.body.cost || asset.cost || '',
        });
        return ({ success: true });
    } catch (error) {
        console.log(error);
        return ({ success: true, result: "error fetching data" });
    }
}

exports.assetissue = async(req, res) => {
    try {
        const user = await Employee_Master.findOne({
            where: {
                id: req.params.id
            }
        });


        if (!user) {
            return res.send({ success: true, error: 'No Data Found' });
        }
        return res.send({ success: true, result: user });
    }
    catch (error) {
        return res.send({ success: false, error: error });
    }
}

exports.issue = async(request, response) => {
    try {
        var asset = await Asset_Category_Master.findOne({
            where: { id: request.body.id }
        });

        if (!asset) {
            return response.send(asset);
            // console.log('Not found');
        }

        asset = await asset.update({
            name: request.body.name || name || '',
        });
        return ({ success: true });
    } catch (error) {
        console.log(error);
        return ({ success: true, result: "error fetching data" });
    }
}

exports.empid = async(req, response) => {
    try {
        if (!req.body.employeeName) {
            return response.send({ success: false, error: 'employee id missing' });
        }
        var asset = await Asset_Master.findOne({
            where: { id: req.params.id }
        });

        if (!asset) {
            return response.send(asset);
        }
        let AssetHistory = await Asset_History.create({
            EmployeeId: req.body.employeeName,
            issueDate:  moment(req.body.issueDate, 'YYYY-MM-DD').toISOString(),
            AssetMasterId: req.params.id,
        });
        if (!AssetHistory) {
            return response.send({success: false, error:'Asset History not created'});
        }

        asset = await asset.update({
            EmployeeId: req.body.employeeName,
            status: 2
        });

        return ({ success: true });
    } catch (error) {
        console.log(error);
        return ({ success: true, result: "error fetching data" });
    }
}

exports.assetreturn = async(req, res) => {
    try {
        const user = await Employee_Master.findOne({
            where: {
                id: req.params.id
            }
        });


        if (!user) {
            return res.send({ success: true, error: 'No Data Found' });
        }
        return res.send({ success: true, result: user });
    }
    catch (error) {
        return res.send({ success: false, error: error });
    }
}

exports.returnupdate = async(req, response) => {
    try {
        var asset = await Asset_Master.findOne({
            where: { id: req.params.id }
        });

        if (!asset) {
            return response.send({success: true},'Asset Not Found');
        }
        var asset = await asset.update({
            EmployeeId: null,
            status: 1
        });

        let AssetHistory = await Asset_History.findOne({
            where: {AssetMasterId: req.params.id}
        });



        AssetHistory = await AssetHistory.update({
            returnDate:  moment(req.body.returnDate, 'YYYY-MM-DD').toISOString(),
            AssetMasterId: req.params.id,
            
        });
        // return ({ success: true });
        return response.send({ success: true, assetId: req.params.id });
    } catch (error) {
        console.log(error);
        return ({ success: true, result: "error fetching data" });
    }

}

exports.assetscrap = async(req, res) => {
    try {
        const user = await Employee_Master.findOne({
            where: {
                id: req.params.id
            }
        });

        if(!user) {
            return res.send({success: true, error: 'No Data Found' });
        }
        return res.send({ success: true, result: user });
    } catch (error) {
        return res.send({ success: false, error: error });
    }
}

exports.scrapupdate = async(req, response) => {
    try {
        var asset = await Asset_Master.findOne({
            where: { id: req.params.id }
        });

        if (!asset) {
            return response.send({success: true}, 'Asset Not Found');
        }
        asset = await asset.update({
            EmployeeId: null,
            status: 3
        });

        let AssetHistory = await Asset_History.findOne({
            where: {AssetMasterId: req.params.id}
        });

        AssetHistory = await AssetHistory.update({
            scrapDate:  moment(req.body.scrapDate, 'YYYY-MM-DD').toISOString(),
            AssetMasterId: req.params.id,
        });
        return ({ success: true });
    } catch (error) {
        console.log(error);
        return ({ success: true, result: "error fetching data" });
    }
}