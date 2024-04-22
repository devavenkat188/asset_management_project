// const moment = require('moment');
async function sample() {
    const issueDate = document.getElementById("issueDate").value;
    const returnDate = document.getElementById("returnDate").value;
    const status = document.getElementById("status").value;
    const scrapDate = document.getElementById("scrapDate").value;
    

    console.log(issueDate, returnDate, status, scrapDate);

    try {
        var response = await fetch('/createhistory/htable', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ issueDate: issueDate, returnDate: returnDate, status: status, scrapDate: scrapDate })
        });

        var data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
jQuery(document).ready(function () {
    let assetHistory = $('#asset_history').DataTable({
        "ajax": {
            "url": `/createhistory/assetname`,
            "dataType": 'json',
            "type": 'GET',
            "dataSrc": function (json) {
                console.log(json);
                if (json) {
                    return json.data;
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
                data: 'assetName',
                defaultContent: ''
            },
            {
                data: 'issueDate',
                defaultContent: '',
                render: function (data, type, full, meta) {
                    return full.AssetHistories && full.AssetHistories.length && full.AssetHistories[0].issueDate && moment(full.AssetHistories[0].issueDate).format('DD MM YYYY') || '';
                }

            },
            {
                data: 'returnDate',
                defaultContent: '',
                render: function (data, type, full, meta) {
                    return full.AssetHistories && full.AssetHistories.length && full.AssetHistories[0].returnDate && moment(full.AssetHistories[0].returnDate).format('DD MM YYYY') || '';
                }
            },
            {
                data: 'scrapDate',
                defaultContent: '',
                render: function (data, type, full, meta) {
                    return full.AssetHistories && full.AssetHistories.length && full.AssetHistories[0].scrapDate && moment(full.AssetHistories[0].scrapDate).format('DD MM YYYY') || '';
                }
            },
            {
                data: 'EmployeeId',
                defaultContent: '',
                // render: function (data, type, full, meta) {
                //     return full.AssetHistories && full.AssetHistories.length && full.AssetHistories[0].EmployeeId  || '';
                // }
                

            },
            // {
            //     data: null,
            //     targets: -1,
            //     orderable: false,
            //     render: function (data, type, full, meta) {
            //         let button = `<a data-id="${full.id}" data-method="submit" class="edit btn btn-primary data-bs-toggle="exampleModal"> Edit </a>`;
            //         return button;
            //     }
            // },
        ]
    })
    // $("#exampleModal #issueDate").datetimepicker({
    //     format: "DD/MM/YYYY",
    // });

    // $('#asset_history').on('click', '.edit', function (e) {
    //     e.preventDefault();
    //     let id = $(this).data('id');
    //     $.ajax({
    //         type: 'GET',
    //         url: '/historyfetch/' + id,

    //     }).done(function (response) {
    //         if (response.success === true) {
    //             if (response.result) {
    //                 console.log(response.result);
    //                 let issueD = response.result.issueDate && moment(response.result.issueDate).format('MM/DD/YYYY');
    //                 console.log(issueD);
    //                 let returnD = response.result.returnDate && moment(response.result.returnDate).format('MM/DD/YYYY');
    //                 console.log(returnD);
    //                 let scrapD = response.result.scrapDate && moment(response.result.scrapDate).format('MM/DD/YYYY');
    //                 $('#id').val(response.result.id);
    //                 $('.issueDate').val(response.result.issueDate && moment(response.result.issueDate).format('MM/DD/YYYY'));
    //                 $('.returnDate').val(moment(response.result.returnDate).format('MM/DD/YYYY'));
    //                 $('.status').val(response.result.status);
    //                 $('.scrapDate').val(response.result.scrapDate && moment(response.result.scrapDate).format('MM/DD/YYYY'));
    //             }
    //         } else {
    //             alert(response.error);
    //         }
    //     });
    //     $('#exampleModal').modal('show');
    // });

    $('#formvalidate').validate({
        submitHandler: function (form, event) {
            $.ajax({
                type: $(form).attr('method'),
                url: '/createhistory/alter/' + $('#id').val(),
                data: $(form).serializeArray(),
            }).done(function (response) {
                if (response.success == true) {
                    $('#exampleModal').modal('hide');
                    History.ajax.reload();
                    alert('history updated');
                } else {
                    alert(response.message || response.error);
                }
                $('#formValidate #submitBtn').prop('disabled', false);
            });
        }
    })
});