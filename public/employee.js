
// Move form data retrieval inside the sample function


async function sample() {
    const name = document.getElementById("names").value;
    const designation = document.getElementById("designation").value;
    const dob = document.getElementById("dob").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const branch = document.getElementById("branch").value;
    const status = document.getElementById("status").value;


    console.log(name, designation, dob, mobile, email, branch, status);


    // Fetch data from server
    try {
        var response = await fetch('/employee/table', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: name, designation: designation, dob: dob, mobile: mobile, email: email, branch: branch, status: status })
        });
        var data = await response.json();
        // alert(data.success)
        console.log(data);
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}

async function edit() {
    const name = document.getElementById("names").value;
    const designation = document.getElementById("designation").value;
    const dob = document.getElementById("dob").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const branch = document.getElementById("branch").value;
    const status = document.getElementById("status").value;


    // Fetch data from server
    try {
        var response = await fetch('/employee/edits/' + $('#id').val(), {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: name, designation: designation, dob: dob, mobile: mobile, email: email, branch: branch, status: status })
        });
        var data = await response.json();
        // alert(data.success)
        console.log('response', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

/* New Table */
jQuery(document).ready(function () {
    $('#submitBtn').show();
    $('#editBtn').hide();
    let employeeTable = $('#employee_master').DataTable({
        "ajax": {
            // "url": `/employee`,
            "url": `/employee/create`,
            "dataType": 'json',
            "type": 'GET',
            "dataSrc": function (json) {
                if (json.success == true) {
                    return json.result;
                } else {
                    alert(json.error || 'Unable to load data');
                    return [];
                }
            }
        },
        layout: {
            topstart: {
                buttons: [
                    {
                        extend: 'copy',
                        className: 'btn btn-primary btn-sm btn-size',
                        text: 'Copy'
                    }, {
                        extend: 'excel',
                        className: 'btn btn-primary btn-sm btn-size',
                        text: 'Excel',
                        title: 'Employees'
                    }, {
                        extend: 'pdf',
                        className: 'btn btn-primary btn-sm btn-size',
                        text: 'PDF',
                        title: 'Employee'
                    }
                ],
            }
        },

        // layout: {
        //     topStart: {
        //         buttons: ['copy', 'excel', 'pdf']
        //     }
        // },
        // "dom": '<"top-filters-1"lBf><"table-body"rt><"bottom-filters-1"ip>',
        autoWidth: false,
        columns: [
            {
                data: 'id',
                // class: 'word-wrap',
                defaultContent: ''
            },
            {
                data: 'name',
                // class: 'word-wrap',
                defaultContent: ''
            },
            {
                data: 'designation',
                defaultContent: ''
            },
            {
                data: 'dob',
                defaultContent: '',
                render: function (data, type, full, meta) {
                    return data && moment(data).format('l') || '';
                }
            },
            {
                data: 'mobile',
                defaultContent: '',
            },
            {
                data: 'email',
                defaultContent: '',
            },
            {
                data: 'branch',
                defaultContent: '',
            },
            {
                data: 'status',
                defaultContent: '',
            },
            {
                data: null,
                targets: -1,
                orderable: false,
                render: function (data, type, full, meta) {
                    let button = `<a data-id="${full.id}" data-method="submit" class="edit btn btn-primary btn-sm data-bs-toggle="exampleModal"> Edit </a>`;
                    return button;
                }
            }
        ],
    });


    $('#employee_master').on('click', '.edit', function (e) {
        $('#submitBtn').hide();
        $('#editBtn').show();
        e.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: '/employee/employeefetch/' + id,
        }).done(function (response) {
            if (response.success === true) {
                // $('.verifyBtn, .closeBtn, .show-close').hide(); $('.saveInsuranceBtn').show();
                if (response.result) {
                    $('#id').val(response.result.id);
                    $('.names').val(response.result.name || '');
                    $('.designation').val(response.result.designation || '');
                    $('.dob').val(response.result.dob || moment((response.result.dob).format('MM/DD/YYYY')) || '');
                    console.log(moment(response.result.dob).format('MM/DD/YYYY'));
                    $('.mobile').val(response.result.mobile || '');
                    $('.email').val(response.result.email || '');
                    $('.branch').val(response.result.branch || '');
                    $('.status').val(response.result.status || '');
                }
            } else {
                alert(response.error);
            }

        });
        $('#exampleModal').modal('show');

    });
    // $("#exampleModal #dob").datetimepicker({
    //     format: "DD_MM_YYYY HH:mm A",
    //     minDate: moment(),
    // });


    $('#formvalidate').validate({
        submitHandler: function (form, event) {
            // event.preventDefault()
            $.ajax({
                type: $(form).attr('method'),
                url: '/employee/edit/' + $('#id').val(),
                data: $(form).serializeArray(),
            }).done(function (response) {
                if (response.success == true) {
                    $('#exampleModal').modal('hide');
                    EmployeeMaster.ajax.reload();
                    alert('employee updated');
                } else {
                    alert(response.message || response.error);
                }
                $('#formvalidate #submitBtn').prop('disabled', false);

            });
            location.reload();
        }
    })

});



// let formData;

// //const form = document.getElementById("form");
// //const id = document.getElementById("id").value;
// // console.log(id);
// const employeeName = document.getElementById("employeeName").value;
// const designation = document.getElementById("designation");
// const dob = document.getElementById("dob").value = moment(dob).format(dd/mm/yyyy);
// const mobileNumber = document.getElementById("mobileNumber").value;
// const salary = document.getElementById("salary").value;
// const experience = document.getElementById("experience").value;
// const status = document.getElementById("status").value;


// async function sample() {
//     // console.log('utyuy');
//     console.log(employeeName);
//     console.log(designation);
//     console.log(dob);
//     console.log(mobileNumber);
//     console.log(salary);
//     console.log(experience);
//     console.log(status);
//     var response = await fetch('/create', {
//         method: 'POST',
//         headers: { 'content-type': 'application/json' },
//         body: JSON.stringify({ employeeName: employeeName, designation: designation, dob: dob, mobileNumber: mobileNumber, salary: salary, experience: experience, status: status })
//     });
//     var data = await response.json()
//     console.log(data);
// }



// /*
// form.addEventListener('submit', function (e) {

//     e.preventDefault();

//     if (!validateInputs()) {
//         return;
//     }

// });
// */
// data();

// async function data() {
//     var response = await fetch('/employee_master')
//     var data = await response.json();
//     console.log(data);

//     let table = new DataTable('#employee_master');
//     $('#employee_master').DataTable({
//         data: data,
//         columns: [
//             { data: 'id' },
//             { data: 'Employee_Name' },
//             { data: 'Designation' },
//             { data: 'DOB' },
//             { data: 'Mobile_Number' },
//             { data: 'Salary' },
//             { data: 'Experience' },
//             { data: 'Status' },
//             { data: null, 'render': function (data){
//                 return `
//                 <button type="edit" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> Edit </button>`
//             }},
//         ]
//     });
// }
/*
function validateInputs() {
    const employeeNameVal = employeeName.value.trim();
    const designationVal = designation.value.trim();
    const dateVal = dob.value.trim();
    const mobileNumberVal = mobileNumber.value.trim();
    const salaryVal = salary.value.trim();
    const experienceVal = experience.value.trim();
    const statusVal = status.value.trim();

    let success = true;


    if (success) {
        // Create an object to store all the form data
        const formData = {
            id: idVal,
            employeeName: employeeNameVal,
            designation: designationVal,
            dob: dateVal,
            mobileNumber: mobileNumberVal,
            salary: salaryVal,
            experience: experienceVal,
            status: statusVal,
        };

        // const formDataJSON = JSON.stringify(formData);


        // localStorage.setItem('formData', formDataJSON);
    }

    if (!id || !employeeName || !designation || !mobileNumber || !salary || !experience || !status) {
        console.error('Invalid elements detected.');
        return false;
    }
    // If all inputs are valid, store the data in local storage

    if (employeeNameVal === '') {
        success = false;
        setError(employeeName, "EmployeeName is Required");
    } else if (employeeNameVal.length < 4) {
        success = false;
        setError(employeeName, "FirstName should be minimum 4 characters");
    } else if (employeeNameVal.length > 14) {
        success = false;
        setError(employeeName, "FirstName should not exceeds to 14 characters");
    } else {
        employeeName.value = employeeNameCap(employeeNameVal);
        setSuccess(employeeName);
    }

    if (designationVal === '') {
        success = false;
        setError(designation, "Please enter your Designation");
    } else if (designationVal.length < 2) {
        success = false;
        setError(designation, "Designation should be minimum 2 characters");
    } else if (designationVal.length > 20) {
        success = false;
        setError(designation, "Designation should not exceeds to 20 characters")
    } else {
        designation.value = designationCap(designationVal);
        setSuccess(designation);
    }

    if (dateVal === '') {
        success = false;
        setError(dob, "Please select the Date");
    } else if (!validateDate(dateVal)) {
        success = false;
        setError(dob, "Please enter the correct dob of age greater than 18");
    } else {
        setSuccess(dob);
    }

    if (mobileNumberVal === '') {
        success = false;
        setError(mobileNumber, "Phone Number is Required");
    } else if (!validatePhoneNumber(mobileNumberVal)) {
        success = false;
        setError(mobileNumber, "Phone Number must have 10 numbers");
    } else {
        setSuccess(mobileNumber);
    }

    if (salaryVal === '') {
        success = false;
        setError(salary, "Please provide your Salary");
    } else if (salary > 10000) {
        success = false;
        setError(salary, "Salary should be minimum 10000");
    } else if (salary < 80000) {
        success = false;
        setError(salary, "Salary should not exceeds to 80000");
    } else {
        setSuccess(salary);
    }

    if (experienceVal === '') {
        success = false;
        setError(experience, "Experience is Required.");
    } else if (!validateExperience(experienceVal)) {
        success = false;
        setError(experience, "Experience range is between 1 to 15");
    } else {
        setSuccess(experience);
    }

    if (statusVal === '') {
        success = false;
        setError(status, "Status is required.");
    } else if (statusv !== 'active' && status !== 'inactive') {
        success = false;
        setError(status, "Check the status is active / inactive");
    } else {
        setSuccess(status);
    }

    return success;
}
function setError(element, message) {
    if (!element) {
        console.error('Invalid element:', element);
        return;
    }

    const inputGroup = element.parentElement;
    if (!inputGroup) {
        console.error('Parent element not found for input:', element);
        return;
    }

    const errorElement = inputGroup.querySelector('.error');
    if (errorElement) {
        errorElement.innerText = message;
        inputGroup.classList.add('error');
        inputGroup.classList.remove('success');
    } else {
        console.error('Error element not found for input:', element);
    }
}

function setSuccess(element) {
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error');
    errorElement.innerText = '';
    inputGroup.classList.add('success');
    inputGroup.classList.remove('error');

}
const employeeNameCap = function (firstName) {
    let str = firstName.split(" ");
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].substring(1);
    }
    return str.join(" ");
};
const designationCap = (designation) => {
    let str = designation.split(" ");
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].substring(1);
    }
    return str.join(" ");
};
const validateDate = (dob) => {
    const currentDate = new Date();
    const enteredDate = new Date(dob);
    const ageDifference = currentDate.getFullYear() - enteredDate.getFullYear();
    if (ageDifference < 18) {
        return false;

    }
    else {
        return true;
    }
};
const validateMobileNumber = (mobileNumber) => {
    return String(mobileNumber).match(/^([0-9]{10})$/);
};
const validateExperience = (experience) => {
    const vaildateExp = parseInt(experience);
    if (!isNaN(vaildateExp) && vaildateExp >= 1 && vaildateExp <= 15) {
        return validateExperience;
    }

};

*/


