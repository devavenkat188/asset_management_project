const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 5050;
const { Employee_Master, Asset_Master, Asset_Category_Master, Asset_History } = require('./models/index');
const Employee = require('./models/employee_master');
const Asset = require('./models/asset_master');
const Category = require('./models/asset_category_master');
const History = require('./models/asset_history');
const { error, log } = require('console');
const moment = require('moment');
const User = require('./models/register');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Emp = require('./route/employee/index');
const AssetMas = require('./route/assetmaster/index');
const AssetCat = require('./route/assetcategory/index');
const AssetHis = require('./route/assethistory/index');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('pg');
app.use(bodyParser.json());
app.use(cookieParser());
// const Login = require('/login');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/employee',Emp);
app.use('/asset', AssetMas);
app.use('/createcategory', AssetCat);
app.use('/createhistory', AssetHis);

// app.get('/employee', async (req, res) => {
    // app.get('/create', async (req, res) => {
    // try {
    //     const user = await Employee_Master.findAll();

    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }
    //     // let result;
    //     // result = user
    //     // result.nameupd = user.name.toupper()
    //     console.log(user);
    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }

// });

app.post('/register', async(req, res) => {
    try {
        const { firstName, lastName, email, userName, password, confirmPassword } = req.body;
       
       
        const user = await User.findOne({
            where: {
            firstName: firstName,
            }
        });

        if (user) {
            return res.send({ success: false, error: 'User Will already Exist' });
        }

        const value = await User.create({
            firstName: firstName, lastName: lastName,
            email: email, userName: userName, password: password, confirmPassword: confirmPassword

        });
        console.log(value);
        res.send(value);

        console.log(user);
        return res.send({ success: true, result: user });
    }
    catch (error) {
        return res.send({ success: false, error: error });
    }
});

app.get('/createregister', async (request, response) => {
    // response.sendFile(path.join(__dirname, 'register.pug'));
    response.render('register');
});

app.post('/login', async (req,res) =>  {
            
            const user = await User.findOne({
                where: {
                    userName: req.body.userName,
                }
            });
        
            if(!user) {
                return res.send({success: false, error: 'Invalid User Name'});
            }

            if(user.password != req.body.password) {
                return res.send({success: false, error: 'Invalid Password'});
            }
        
            const payload = { userName: user.userName };
            const secretKey = 'mySecretKey';
            const token = jwt.sign(payload, secretKey);
            
            // res.cookie('jwt', token, { httpOnly: true });
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            });

            return res.send({success: true, message: 'Login Successfull' });
});

// app.get('/logout', async (req,res) => {
//     res.clearCookie('access_token');
//     // res.render('createlogin')
//     res.redirect('/createlogin');
// });
app.get('/logout', async (req, res) => {
    res.clearCookie('access_token');
    // res.render('createlogin');
    res.redirect('/createlogin');
});


function loginurl (req,res,next) {
    const token = req.cookies.access_token;
    if(token) {
        jwt.verify(token, 'mySecretKey', (err, payload)=> {
            if(err) {
                res.redirect('/createlogin');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/createlogin');
    }
};

app.get('/login', loginurl, (req, res) => {
    res.render('login'); 
}); // middleware file

app.get('/', loginurl, async(req, res) => {
    res.redirect('/createlogin');
    // res.render('createlogin')
})

app.get('/createlogin', async (request, response) => {
    // response.sendFile(path.join(__dirname, 'login.pug'));
    response.render('login');
});

const Sequelize = require('sequelize');
app.get('/chart/employee', async (req, res) => {
  try {
    // Query for employee status counts
    const counts = await Employee.findAll({
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
      group: ['status'],
    });

    // const labels = counts.map(entry => entry.get('status'));
    // const countsArray = counts.map(entry => entry.get('count'));

    res.json({ counts });
  } catch (error) {
    console.error("Error fetching Employee Data:", error);
    res.status(500).json({ error: 'Internal server Error'});
  }
});

app.get('/chart/asset', async(req, res) => {
    try {
        // const counts = await Asset.findAll({
        //     attributes: ['name', [Sequelize.fn('COUNT', Sequelize.col('name')), 'count']],
        //     group: ['status'],
        // });
        const counts = await Asset.findAll({
            attributes: ['assetName', [Sequelize.fn('COUNT', Sequelize.col('status')), 'status']],
            where: {
              status:  1
            },
            group: ['assetName']
          });
        // res.json({ counts });

        const getback = await Asset.findAll({
            attributes: ['assetName', [Sequelize.fn('COUNT', Sequelize.col('status')), 'status']],
            where: {
              status:  2
            },
            group: ['assetName']
          });
        // res.json({ getback });

        const scrap = await Asset.findAll({
            attributes: ['assetName', [Sequelize.fn('COUNT', Sequelize.col('status')), 'status']],
            where: {
              status:  3
            },
            group: ['assetName']
          });
        res.json({ counts, getback, scrap });

    } catch (error) {
        console.error("Error fetching Asset Data:", error);
        res.status(500).json({ error: 'Internal server Error'});
    }
});


app.get('/chart/emp', loginurl, async (request, response) => {
    // response.sendFile(path.join(__dirname, 'chart.pug'));
    response.render('chart');
});

app.get('/employee', loginurl, async (request, response) => {
    // response.sendFile(path.join(__dirname, 'employee.pug'));
    response.render('employee');
});

app.get('/employee_master', async (request, response) => {
    var value = await Employee_Master.findAll();
    response.send(value);
});

app.get('/asset', loginurl, async (request, response) => {
    // response.sendFile(path.join(__dirname, 'asset_master.pug'));
    response.render('asset_master');
});

app.get('/asset_master', async (request, response) => {
    var value = await Asset_Master.findAll();
    response.send(value);
});

app.get('/createcategory', loginurl, async (request, response) => {
    // response.sendFile(path.join(__dirname, 'asset_category.pug'));
    response.render('asset_category');
}); // for render

app.get('/asset_category', async (request, response) => {
    var value = await Asset_Category.findAll();
    response.send(value);
});

app.get('/createhistory', loginurl, async (request, response) => {
    // response.sendFile(path.join(__dirname, 'asset_history.pug'));
    response.render('asset_history');
}); // for render

app.get('/asset_history', async (request, response) => {
    var value = await Asset_History.findAll();
    response.send(value);
});

app.listen(port, () => {
    console.log(`The app listen on port http://localhost:${port}`);
});

// app.get('/employeefetch/:id', async (req, res) => {
    // try {
    //     const user = await Employee_Master.findOne({
    //         where: {
    //             id: req.params.id
    //         }
    //     });


    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }
    //     // let result;
    //     // result = user
    //     // result.nameupd = user.name.toupper()
    //     // console.log(user);
    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });
// app.get('/assetissue/:id', async (req, res) => {
    // try {
    //     const user = await Employee_Master.findOne({
    //         where: {
    //             id: req.params.id
    //         }
    //     });


    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }
    //     // let result;
    //     // result = user
    //     // result.nameupd = user.name.toupper()
    //     // console.log(user);
    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });

// app.get('/assetreturn/:id', async (req, res) => {
    // try {
    //     const user = await Employee_Master.findOne({
    //         where: {
    //             id: req.params.id
    //         }
    //     });


    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }
    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });

// app.get('/assetscrap/:id', async (req, res) => {
    // try {
    //     const user = await Employee_Master.findOne({
    //         where: {
    //             id: req.params.id
    //         }
    //     });

    //     if(!user) {
    //         return res.send({success: true, error: 'No Data Found' });
    //     }
    //     return res.send({ success: true, result: user });
    // } catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });
// app.get('/', async (request, response) => {

//     response.sendFile(path.join(__dirname, "index.html"));

// });

// app.get('/create', loginurl, async (request, response) => {
//     // response.sendFile(path.join(__dirname, 'employee.pug'));
//     response.render('employee');
// }); // for render
// app.get('/employee', loginurl, async (request, response) => {
//     // response.sendFile(path.join(__dirname, 'employee.pug'));
//     response.render('employee');
// });


// app.post('/table', async (request, response) => {
    // const id = request.body.id; --> which is used to fetch the data from the fetch.
    // console.log('table');
    // const { name, designation, dob, mobile, email, branch, status } = request.body;
    // try {

    //     const value = await Employee_Master.create({
    //         name: name, designation: designation,
    //         dob: dob, mobile: mobile, email: email, branch: branch, status: status

    //     });
    //     console.log(value);
    //     response.send(value);

    // }
    // catch (error) {
    //     console.error("Error Creating Table", error);
    //     response.send("Error");
    // }
// });
// app.get('/employee_master', async (request, response) => {
//     var value = await Employee_Master.findAll();
//     response.send(value);
// });

// app.put('/edit/:id', async (request, response) => {
    // try {
    //     var employee = await Employee.findOne({
    //         where: { id: request.params.id }
    //     });

    //     if (!employee) {
    //         return response.send(employee);
    //         // console.log('Not found');
    //     }

    //     employee = await employee.update({
    //         name: request.body.name || employee.name || '',
    //         designation: request.body.designation || employee.designation || '',
    //         dob: request.body.dob || employee.dob || '',
    //         mobile: request.body.mobile || employee.mobile || '',
    //         email: request.body.email || employee.email || '',
    //         branch: request.body.branch || employee.branch || '',
    //         status: request.body.status || employee.status || '',


    //     });
    //     return ({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }
// });


/* Asset Table */

// app.get('/asset', async (req, res) => {
    // app.get('/createasset', async(req, res) => {
    // try {
    //     const user = await Asset_Master.findAll();

    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }
    //     // let result;
    //     // result = user
    //     // result.nameupd = user.name.toupper()
    //     console.log(user);
    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });
// app.get('/assetfetch/:id', async (req, res) => {
    // try {
    //     const user = await Asset_Master.findOne({
    //         where: {
    //             id: req.params.id
    //         }
    //     });


    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }

    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });

// app.get('/createasset', loginurl, async (request, response) => {
//     // response.sendFile(path.join(__dirname, 'asset_master.pug'));
//     response.render('asset_master');
// }); // for render
// app.get('/asset', loginurl, async (request, response) => {
//     // response.sendFile(path.join(__dirname, 'asset_master.pug'));
//     response.render('asset_master');
// });

// app.post('/atable', async (request, response) => {
    // const id = request.body.id; --> which is used to fetch the data from the fetch.
    // console.log('table');
    // const { serialNumber, assetName, make, model, cost } = request.body;
    // try {
    //     // console.log(dob);
    //     const value = await Asset_Master.create({
    //         serialNumber: serialNumber, assetName: assetName,
    //         make: make, model: model, cost: cost, status: 1

    //     });
    //     console.log(value);
    //     response.send(value);

    // }
    // catch (error) {
    //     console.error("Error Creating Table", error);
    //     response.send("Error");
    // }
// });

// app.get('/asset_master', async (request, response) => {
//     var value = await Asset_Master.findAll();
//     response.send(value);
// });

// app.put('/change/:id', async (request, response) => {
    // try {
    //     var asset = await Asset.findOne({
    //         where: { id: request.params.id }
    //     });

    //     if (!asset) {
    //         return response.send(asset);
    //         // console.log('Not found');
    //     }

    //     asset = await asset.update({
    //         serialNumber: request.body.serialNumber || asset.serialNumber || '',
    //         assetName: request.body.assetName || asset.assetName || '',
    //         make: request.body.make || asset.make || '',
    //         model: request.body.model || asset.model || '',
    //         cost: request.body.cost || asset.cost || '',
    //     });
    //     return ({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }
// });

/* Category Table */
// app.get('/category', async (req, res) => {
    // try {
    //     const user = await Asset_Category_Master.findAll();

    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }
    //     // let result;
    //     // result = user
    //     // result.nameupd = user.name.toupper()
    //     console.log(user);
    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });
// app.get('/categoryfetch/:id', async (req, res) => {
    // try {
    //     const user = await Asset_Category_Master.findOne({
    //         where: {
    //             id: req.params.id
    //         }
    //     });


    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }

    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });

// app.get('/createcategory', loginurl, async (request, response) => {
//     // response.sendFile(path.join(__dirname, 'asset_category.pug'));
//     response.render('asset_category');
// }); // for render

// app.post('/ctable', async (request, response) => {
    // const id = request.body.id; --> which is used to fetch the data from the fetch.
    // console.log('table');
    // let { categoryName } = request.body;
    // try {
    //     // console.log(dob);
    //     const value = await Asset_Category_Master.create({
    //         categoryName: categoryName,

    //     });
    //     console.log(value);
    //     response.send(value);

    // }
    // catch (error) {
    //     console.error("Error Creating Table", error);
    //     response.send("Error");
    // }
// });

// app.get('/asset_category', async (request, response) => {
//     var value = await Asset_Category.findAll();
//     response.send(value);
// });

// app.put('/modify/:id', async (request, response) => {
    // try {
    //     var asset = await Category.findOne({
    //         where: { id: request.params.id }
    //     });

    //     if (!asset) {
    //         return response.send(asset);
    //         // console.log('Not found');
    //     }

    //     asset = await asset.update({
    //         categoryName: request.body.categoryName || asset.categoryName || '',
    //     });
    //     return ({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }
// });

// app.put('/changes/:id', async (request, response) => {
    // try {
    //     var asset = await Asset_Master.findOne({
    //         where: { id: request.params.id }
    //     });

    //     if (!asset) {
    //         return response.send(asset);
    //         // console.log('Not found');
    //     }

    //     asset = await asset.update({
    //         serialNumber: request.body.serialNumber || asset.serialNumber || '',
    //         assetName: request.body.assetName || asset.assetName || '',
    //         make: request.body.make || asset.make || '',
    //         model: request.body.model || asset.model || '',
    //         cost: request.body.cost || asset.cost || '',
    //     });
    //     return ({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }
// });

// app.put('/employee/edit/:id', async (request, response) => {
    // try {
    //     var employee = await Employee.findOne({
    //         where: { id: request.params.id }
    //     });

    //     if (!employee) {
    //         return response.send(employee);
    //         // console.log('Not found');
    //     }

    //     employee = await employee.update({
    //         names: request.body.names || employee.names || '',
    //         designation: request.body.designation || employee.designation || '',
    //         dob: request.body.dob || employee.dob || '',
    //         mobile: request.body.mobile || employee.mobile || '',
    //         email: request.body.email || employee.email || '',
    //         branch: request.body.branch || employee.branch || '',
    //         status: request.body.status || employee.status || '',
    //     });
    //     return ({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }
// });

/* Asset History */
// app.get('/history', async (req, res) => {
    // try {
    //     const user = await Asset_History.findAll();

    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }
    //     // let result;
    //     // result = user
    //     // result.nameupd = user.name.toupper()
    //     console.log(user);
    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });
// app.get('/historyfetch/:id', async (req, res) => {
    // try {
    //     const user = await Asset_History.findOne({
    //         where: {
    //             id: req.params.id
    //         }
    //     });


    //     if (!user) {
    //         return res.send({ success: true, error: 'No Data Found' });
    //     }

    //     return res.send({ success: true, result: user });
    // }
    // catch (error) {
    //     return res.send({ success: false, error: error });
    // }
// });

// app.get('/createhistory', loginurl, async (request, response) => {
//     // response.sendFile(path.join(__dirname, 'asset_history.pug'));
//     response.render('asset_history');
// }); // for render

// app.post('/htable', async (request, response) => {
    // const id = request.body.id; --> which is used to fetch the data from the fetch.
    // console.log('table');
    // let { issueDate, returnDate, status, scrapDate } = request.body;
    // issueDate = moment(issueDate, 'YYYY-MM-DD').toISOString();
    // returnDate = moment(returnDate, 'YYYY-MM-DD').toISOString();
    // scrapDate = moment(scrapDate, 'YYYY-MM-DD').toISOString();
    // try {
    //     // console.log(dob);
    //     const value = await Asset_History.create({
    //         issueDate: issueDate, returnDate: returnDate, status: status,
    //         scrapDate: scrapDate,

    //     });
    //     console.log(value);
    //     response.send(value);

    // }
    // catch (error) {
    //     console.error("Error Creating Table", error);
    //     response.send("Error");
    // }
// });

// app.get('/asset_history', async (request, response) => {
//     var value = await Asset_History.findAll();
//     response.send(value);
// });

// app.put('/alter/:id', async (request, response) => {
    // try {
    //     var asset = await History.findOne({
    //         where: { id: request.params.id }
    //     });

    //     if (!asset) {
    //         return response.send(asset);
    //         // console.log('Not found');
    //     }

    //     asset = await asset.update({
    //         issueDate: request.body.issueDate && (moment(request.body.issueDate, 'DD MM YYYY HH:ss A').toISOString()) || asset.issueDate && (moment(date, 'DD MM YYYY HH:ss A').toISOString()) || '',
    //         returnDate: request.body.returnDate && (moment(request.body.returnDate, 'DD MM YYYY HH:ss A').toISOString()) || asset.returnDate && (moment(date, 'DD MM YYYY HH:ss A').toISOString()) || '',
    //         status: request.body.status || asset.status || '',
    //         scrapDate: request.body.scrapDate && (moment(request.body.scrapDate, 'DD MM YYYY HH:ss A').toISOString()) || asset.scrapDatemoment && (moment(date, 'DD MM YYYY HH:ss A').toISOString()) || '',
    //     });
    //     return ({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }
// });

/* Issue Asset */

// app.get('/issue/', async (request, response) => {
    // try {
    //     var asset = await Category.findOne({
    //         where: { id: request.body.id }
    //     });

    //     if (!asset) {
    //         return response.send(asset);
    //         // console.log('Not found');
    //     }

    //     asset = await asset.update({
    //         name: request.body.name || name || '',
    //     });
    //     return ({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }
// });

// app.get('/assetname/', async (req, res) => {
    // try {
    //     var name = await Asset_Master.findAll({
    //         attributes: ['id', 'assetName', 'EmployeeId'],
    //         include: [{
    //             model: Asset_History,
    //             required: true
    //         }],
    //         // {
    //         //     attributes: ['assetName', 'employee'],
    //         //     model: employee,
    //         // }],
    //     })
    //     res.send({ data: name });
    // } catch (error) {
    //     console.log(error);
    // }
// });

// app.put('/empid/:id', async (req, response) => {
    // try {
    //     if (!req.body.employeeName) {
    //         return response.send({ success: false, error: 'employee id missing' });
    //     }
    //     var asset = await Asset.findOne({
    //         where: { id: req.params.id }
    //     });

    //     if (!asset) {
    //         return response.send(asset);
    //     }
    //     let AssetHistory = await Asset_History.create({
    //         EmployeeId: req.body.employeeName,
    //         issueDate:  moment(req.body.issueDate, 'YYYY-MM-DD').toISOString(),
    //         AssetMasterId: req.params.id,
    //     });
    //     if (!AssetHistory) {
    //         return response.send({success: false, error:'Asset History not created'});
    //     }

    //     asset = await asset.update({
    //         EmployeeId: req.body.employeeName,
    //         status: 2
    //     });

    //     return ({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }

// });

// app.put('/return/update/:id', async (req, response) => {
    // try {
    //     // if (!req.body.employeeName) {
    //     //     return response.send({ success: false, error: 'employee id missing' });
    //     // }
    //     var asset = await Asset.findOne({
    //         where: { id: req.params.id }
    //     });

    //     if (!asset) {
    //         return response.send({success: true},'Asset Not Found');
    //     }
    //     var asset = await asset.update({
    //         EmployeeId: null,
    //         status: 1
    //     });

    //     let AssetHistory = await Asset_History.findOne({
    //         where: {AssetMasterId: req.params.id}
    //     });



    //     AssetHistory = await AssetHistory.update({
    //         returnDate:  moment(req.body.returnDate, 'YYYY-MM-DD').toISOString(),
    //         AssetMasterId: req.params.id,
            
    //     });
    //     // return ({ success: true });
    //     return response.send({ success: true, assetId: req.params.id });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }

// });

// app.put('/scrap/update/:id', async (req, response) => {
    // try {
    //     // if (!req.body.employeeName) {
    //     //     return response.send({ success: false, error: 'employee id missing' });
    //     // }
    //     var asset = await Asset.findOne({
    //         where: { id: req.params.id }
    //     });

    //     if (!asset) {
    //         return response.send({success: true}, 'Asset Not Found');
    //     }
    //     asset = await asset.update({
    //         EmployeeId: null,
    //         status: 3
    //     });

    //     let AssetHistory = await Asset_History.findOne({
    //         where: {AssetMasterId: req.params.id}
    //     });

    //     AssetHistory = await AssetHistory.update({
    //         scrapDate:  moment(req.body.scrapDate, 'YYYY-MM-DD').toISOString(),
    //         AssetMasterId: req.params.id,
    //     });
    //     return ({ success: true });
    // } catch (error) {
    //     console.log(error);
    //     return ({ success: true, result: "error fetching data" });
    // }

// });
/* Return Asset */
// app.get('/return/', async (request, response) => {
//     try {
//         var asset = await Asset.findOne({
//             where: { id: request.params.id }
//         });

//         if (!asset) {
//             return response.send(asset);
//             // console.log('Not found');
//         }

//         asset = await asset.update({
//             name: request.body.name || name || '',
//         });

//         await ashis.update({
//             returndate: moment().toISOString()
//         },
//             {
//                 where: {
//                     AssetId: asset.id
//                 }
//             });
//         return ({ success: true });
//     } catch (error) {
//         console.log(error);
//         return ({ success: true, result: "error fetching data" });
//     }
// });

// // Scrap Asset

// app.get('/scrap/', async (request, response) => {
//     try {
//         var asset = await Asset.findOne({
//             where: { id: request.params.id }
//         });

//         if (!asset) {
//             return response.send(asset);
//             // console.log('Not found');
//         }

//         asset = await asset.update({
//             name: request.body.name || name || '',
//         });

//         await ashis.update({
//             returndate: moment().toISOString()
//         },
//             {
//                 where: {
//                     AssetId: asset.id
//                 }
//             });
//         return ({ success: true });
//     } catch (error) {
//         console.log(error);
//         return ({ success: true, result: "error fetching data" });
//     }
// });

// app.post('/issue', async (request, response) => {
//     // const id = request.body.id; --> which is used to fetch the data from the fetch.
//     console.log('issue');
//     const { employeeName, assettype, reason } = request.body;
//     try {
//         console.log(dob);
//         const value = await Issue_Asset.create({
//             employeeName: employeeName, assettype: assettype,
//             reason: reason

//         });
//         console.log(value);
//         response.send(value);

//     }
//     catch (error) {
//         console.error("Error Creating Table", error);
//         response.send("Error");
//     }
// });
// app.listen(port, () => {
//     console.log(`The app listen on port http://localhost:${port}`);
// });