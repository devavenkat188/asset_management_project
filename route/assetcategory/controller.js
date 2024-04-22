const Asset_Category_Master = require('../../models/asset_category_master');

exports.category = async(req, res) => {
    try {
        const user = await Asset_Category_Master.findAll();

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
        const user = await Asset_Category_Master.findOne({
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
    let { categoryName } = request.body;
    try {
        // console.log(dob);
        const value = await Asset_Category_Master.create({
            categoryName: categoryName,

        });
        console.log(value);
        response.send(value);

    }
    catch (error) {
        console.error("Error Creating Table", error);
        response.send("Error");
    }
}

exports.modify = async(request, response) => {
    try {
        var asset = await Asset_Category_Master.findOne({
            where: { id: request.params.id }
        });

        if (!asset) {
            return response.send(asset);
            // console.log('Not found');
        }

        asset = await asset.update({
            categoryName: request.body.categoryName || asset.categoryName || '',
        });
        return ({ success: true });
    } catch (error) {
        console.log(error);
        return ({ success: true, result: "error fetching data" });
    }
}