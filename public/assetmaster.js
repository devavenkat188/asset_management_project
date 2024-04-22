

async function sample() {
    const serialNumber = document.getElementById("serialNumber").value;
    const assetName = document.getElementById("assetName").value;
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const cost = document.getElementById("cost").value;

    console.log(serialNumber, assetName, make, model, cost);

    // Fetch data from server
    try {
        var response = await fetch('/asset/atable', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ serialNumber: serialNumber, assetName: assetName, make: make, model: model, cost: cost })
        });
        var data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    location.reload();
}
async function edit() {
    // const categoryName = document.getElementById("catgeoryName").value;
    const serialNumber = document.getElementById("serialNumber").value;
    const assetName = document.getElementById("assetName").value;
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const cost = document.getElementById("cost").value;

    try {
        var response = await fetch('/asset/changes/' + $('#id').val(), {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ serialNumber: serialNumber, assetName: assetName, make: make, model: model, cost: cost })
        });
        var data = await response.json();
        console.log('response', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}


/* New Table */
jQuery(document).ready(function () {
    $('#submitBtn').show();
    $('#editBtn').hide();
    let assetTable = $('#asset_master').DataTable({
        "ajax": {
            // "url": `/asset`,
            "url": `/asset/createasset`,
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
                    }, {
                        extend: 'pdf',
                        className: 'btn btn-primary btn-sm btn-size',
                        text: 'PDF',
                    }
                ],
            }
        },
        autoWidth: false,
        columns: [
            {
                data: 'id',
                defaultContent: ''
            },
            {
                data: 'serialNumber',
                defaultContent: ''
            },
            {
                data: 'assetName',
                defaultContent: ''
            },
            {
                data: 'make',
                defaultContent: ''
            },
            {
                data: 'model',
                defaultContent: ''
            },
            {
                data: 'cost',
                defaultContent: ''
            },
            {
                data: 'EmployeeId',
                defaultContent: ''
            },

            {
                data: null,
                targets: -1,
                orderable: false,
                render: function (data, type, full, meta) {
                    let button = `<a data-id="${full.id}" data-method="submit" class="edit btn btn-primary btn-sm data-bs-toggle="exampleModal"> Edit </a>`;
                    if (full.status && full.status == 1) {
                        button += `<button data-id="${full.id}" data-bs-toggle="modal" data-bs-target="#issueAssetModal" class="issue btn btn-secondary btn-sm">Issue</button>`;
                    }
                    if (full.status && full.status == 2) {
                        button += `<button data-id="${full.id}" data-bs-toggle="modal" data-bs-target="#returnAssetModal" class="return btn btn-success btn-sm">Return</button>`;
                    }
                    let scrapButton = `<button data-id="${full.id}" data-bs-toggle="modal" data-bs-target="#scrapAssetModal" class="scrap btn btn-warning btn-sm">Scrap</button>`;
                    return button + ' ' + scrapButton;
                }
            },
        ]
    })

    $('#asset_master').on('click', '.issue', function (e) {
        $('.issue').show();
        $('.return').hide();
        e.preventDefault();
        // let assetId=document.querySelector('.issue')
        console.log($('.issue').attr('data-id'))
        let id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: '/asset/assetfetch/' + id,
        }).done(function (response) {
            if (response.success === true) {
                // Populate modal fields with asset data
                if (response.result) {
                    $('#id').val(response.result.id);
                    $('.assettype').val(response.result.assetName || '');
                    $('.issueDate').val(response.result.issueDate);
                    $('.reason').val('');
                }
            } else {
                alert(response.error);
            }
        });
        $('#issueAssetModal').modal('show');
    });

    $.ajax({
        type: 'GET',
        dataType: "json",
        // url: '/employee',
        url: '/employee/create',
        success: function (response) {
            if (response.success === true) {
                // $('.verifyBtn, .closeBtn, .show-close').hide(); $('.saveInsuranceBtn').show();
                var employeeTypes = response.result;
                for (let employee of response.result) {
                    $('#employee').append(`<option value='${employee.id}'>${employee.id} - ${employee.name}</option>`);
                }
            } else {
                alert(response.error);
            }
        }
    });

    $('#asset_master').on('click', '.return', function (e) {
        // $('.issue').hide();
        // $('.return').show();
        e.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: '/asset/assetfetch/' + id,
        }).done(function (response) {
            if (response.success === true) {
                // Populate modal fields with asset data
                if (response.result) {
                    $('#id').val(response.result.id);
                    $('.returnDate').val(response.result.returndate);
                    $('.reason').val('');
                }
            } else {
                alert(response.error);
            }
        });
        $('#returnAssetModal').modal('show');
    });

    $.ajax({
        type: 'GET',
        dataType: "json",
        url: '/createhistory/history',
        success: function (response) {
            if (response.success === true) {
                var employeeType = response.result;
                for (let history of response.result) {
                    $('#returndate').append(`<option>${history.returnDate}</option>`);
                }
            } else {
                alert(response.error);
            }
        }
    })

    $('#asset_master').on('click', '.scrap', function (e) {
        // $('.issue').hide();
        // $('.return').show();
        e.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: '/asset/assetfetch/' + id,
        }).done(function (response) {
            if (response.success === true) {
                // Populate modal fields with asset data
                if (response.result) {
                    $('#id').val(response.result.id);
                    $('.scrapDate').val(response.result.scrapdate || '');
                    $('.defects').val(response.result.defects);
                    $('.reason').val('');
                }
            } else {
                alert(response.error);
            }
        });
        $('#scrapAssetModal').modal('show');
    });

    // $.ajax({
    //     type: 'GET',
    //     dataType: "json",
    //     url: '/scrap',
    //     success: function (response) {
    //         if (response.success === true) {
    //             var employeeType = response.result;
    //             for (let scrap of response.result) {
    //                 $('#scrapDate').append(`<option>${history.returnDate}</option>`);
    //             }
    //         } else {
    //             alert(response.error);
    //         }
    //     }
    // })

    $('#asset_master').on('click', '.edit', function (e) {
        $('#submitBtn').hide();
        $('#editBtn').show();
        e.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: '/asset/assetfetch/' + id,
        }).done(function (response) {
            if (response.success === true) {
                if (response.result) {
                    $('#id').val(response.result.id);
                    $('.serialNumber').val(response.result.serialNumber);
                    $('.assetName').val(response.result.assetName);
                    $('.make').val(response.result.make);
                    $('.model').val(response.result.model);
                    $('.cost').val(response.result.cost);
                }
            } else {
                alert(response.error);
            }
        });
        $('#exampleModal').modal('show');
    });

    $('#formvalidate').validate({
        submitHandler: function (form, event) {
            $.ajax({
                type: $(form).attr('method'),
                url: '/asset/change/' + $('#id').val(),
                data: $(form).serializeArray(),
            }).done(function (response) {
                if (response.success == true) {
                    $('#exampleModal').modal('hide');
                    AssetMaster.ajax.reload();
                    alert('asset updated');
                } else {
                    alert(response.message || response.error);
                }
                $('#formValidate #submitBtn').prop('disabled', false);
            });
            location.reload();
        }
        
    })
});

// $('#asset_master').on('click', '.issue', function (e) {
//     // $('#submitBtn').hide();
//     // $('#editBtn').show();
//     e.preventDefault();
//     console.log(document.)
//     let id = $(this).data('id');
//     $.ajax({
//         type: 'GET',
//         url: '/assetfetch/' + id,
//     }).done(function (response) {
//         if (response.success === true) {
//             if (response.result) {
//                 $('#id').val(response.result.id);
//             }
//         } else {
//             alert(response.error);
//         }
//     });
//     $('#exampleModal').modal('show');
// });



/* Issue Asset */
async function simple() {
    const employeeName = document.getElementById("employee").value;
    const assettype = document.getElementById("assettype").value;
    const reason = document.getElementById("reason").value;
    const id = document.getElementById("employee").value;
    const issueDate = document.getElementById("issueDate").value;
    const assetid = document.getElementById("")
    console.log(employeeName, assettype, reason, id);


    // Fetch data from server
    try {
        var response = await fetch('/asset/empid/' + $('#id').val(), {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ employeeName: employeeName, assettype: assettype, reason: reason, id: id, issueDate: issueDate
             })

        });
        if (response.success == false) {
            alert(response.error || 'error issue asset')
        }
        var data = await response.json();
        console.log('response', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
/* Return Asset */
async function model() {
    const returnDate = document.getElementById("returndate").value;
    const reason = document.getElementById("reason").value;

    console.log(returnDate, reason);


    // Fetch data from server $('#id').val(), {
    try {
        var response = await fetch('/asset/return/update/' + $('#id').val(), {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ returnDate: returnDate, reason: reason, id: id })
        });
        if(response.success == false) {
            alert(response.error || 'error issue asset')
        }
        var data = await response.json();
        console.log('response', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
/* Scrap Asset */
async function scrap() {
    const scrapDate = document.getElementById("scrapDate").value;
    const defects = document.getElementById("defects").value;
    const reason = document.getElementById("reason").value;

    console.log(scrapDate, reason);


    // Fetch data from server
    try {
        var response = await fetch('asset/scrap/update/' + $('#id').val(), {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ scrapDate: scrapDate, defects: defects, reason: reason })
        });
        if(response.success == false) {
            alert(response.error || 'Error in Scrap Asset')
        }
        var data = await response.json();
        console.log('response', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}