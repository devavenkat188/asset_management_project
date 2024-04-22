const { Asset_Master } = require('../../models');
const Asset_History = require('../../models/asset_history');

exports.history = async(req, res) => {
    try {
        const user = await Asset_History.findAll();

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
        const user = await Asset_History.findOne({
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
    let { issueDate, returnDate, status, scrapDate } = request.body;
    issueDate = moment(issueDate, 'YYYY-MM-DD').toISOString();
    returnDate = moment(returnDate, 'YYYY-MM-DD').toISOString();
    scrapDate = moment(scrapDate, 'YYYY-MM-DD').toISOString();
    try {
        // console.log(dob);
        const value = await Asset_History.create({
            issueDate: issueDate, returnDate: returnDate, status: status,
            scrapDate: scrapDate,

        });
        console.log(value);
        response.send(value);

    }
    catch (error) {
        console.error("Error Creating Table", error);
        response.send("Error");
    }
}

exports.assetname = async(req, res) => {
    try {
        var name = await Asset_Master.findAll({
            attributes: ['id', 'assetName', 'EmployeeId'],
            include: [{
                model: Asset_History,
                required: true
            }],
        })
        res.send({ data: name });
    } catch (error) {
        console.log(error);
    }
}

exports.change = async(request, response) => {
    try {
        var asset = await Asset_History.findOne({
            where: { id: request.params.id }
        });

        if (!asset) {
            return response.send(asset);
            // console.log('Not found');
        }

        asset = await asset.update({
            issueDate: request.body.issueDate && (moment(request.body.issueDate, 'DD MM YYYY HH:ss A').toISOString()) || asset.issueDate && (moment(date, 'DD MM YYYY HH:ss A').toISOString()) || '',
            returnDate: request.body.returnDate && (moment(request.body.returnDate, 'DD MM YYYY HH:ss A').toISOString()) || asset.returnDate && (moment(date, 'DD MM YYYY HH:ss A').toISOString()) || '',
            status: request.body.status || asset.status || '',
            scrapDate: request.body.scrapDate && (moment(request.body.scrapDate, 'DD MM YYYY HH:ss A').toISOString()) || asset.scrapDatemoment && (moment(date, 'DD MM YYYY HH:ss A').toISOString()) || '',
        });
        return ({ success: true });
    } catch (error) {
        console.log(error);
        return ({ success: true, result: "error fetching data" });
    }
}