const Employee_Master = require('../../models/employee_master');

exports.create = async(req, res) => {
    try {
        const user = await Employee_Master.findAll();

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

exports.table = async(request, response) => {
    console.log('table');
    const { name, designation, dob, mobile, email, branch, status } = request.body;
    try {

        const value = await Employee_Master.create({
            name: name, designation: designation,
            dob: dob, mobile: mobile, email: email, branch: branch, status: status

        });
        console.log(value);
        response.send(value);

    }
    catch (error) {
        console.error("Error Creating Table", error);
        response.send("Error");
    }
}

exports.addemp = async(request, response) => {
    try {
        var employee = await Employee.findOne({
            where: { id: request.params.id }
        });

        if (!employee) {
            return response.send(employee);
            // console.log('Not found');
        }

        employee = await employee.update({
            name: request.body.name || employee.name || '',
            designation: request.body.designation || employee.designation || '',
            dob: request.body.dob || employee.dob || '',
            mobile: request.body.mobile || employee.mobile || '',
            email: request.body.email || employee.email || '',
            branch: request.body.branch || employee.branch || '',
            status: request.body.status || employee.status || '',


        });
        console.log(employee);
        return ({ success: true });
    } catch (error) {
        console.log(error);
        return ({ success: false, result: "error fetching data" });
    }
}

exports.employeeEdit = async(request, response) => {
    try {
        console.log("Employee Edit");
        var employee = await Employee_Master.findOne({
            where: { id: request.params.id }
        });

        if (!employee) {
            return response.send(employee);
            // console.log('Not found');
        }

        employee = await employee.update({
            name: request.body.name || employee.name || '',
            designation: request.body.designation || employee.designation || '',
            dob: request.body.dob || employee.dob || '',
            mobile: request.body.mobile || employee.mobile || '',
            email: request.body.email || employee.email || '',
            branch: request.body.branch || employee.branch || '',
            status: request.body.status || employee.status || '',
        });
        console.log(employee);
        return ({ success: true });
    } catch (error) {
        console.log(error);
        return ({ success: false, result: "error fetching data" });
    }
}