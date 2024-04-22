async function sample() {
    let categoryName = document.getElementById("categoryName").value;

    console.log(categoryName);
    try {
        var response = await fetch('/createcategory/ctable', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ categoryName: categoryName })
        });
        var data = await response.json();
        console.log('response', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    location.reload();
}
async function edit() {
    // const categoryName = document.getElementById("catgeoryName").value;
    let categoryName = document.getElementById("categoryName").value;
    try {
        var response = await fetch('/createcategory/modify/' + $('#id').val(), {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ categoryName: categoryName })
        });
        var data = await response.json();
        console.log('response', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}

jQuery(document).ready(function () {
    $('#submitBtn').show();
    $('#editBtn').hide();
    let assetCategory = $('#asset_category').DataTable({
        "ajax": {
            "url": `/createcategory/category`,
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

        autoWidth: false,
        columns: [
            {
                data: 'id',
                defaultContent: ''
            },
            {
                data: 'categoryName',
                defaultContent: ''
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

    $('#asset_category').on('click', '.edit', function (e) {
        $('#submitBtn').hide();
        $('#editBtn').show();
        e.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: '/createcategory/categoryfetch/' + id,
        }).done(function (response) {
            if (response.success === true) {
                if (response.result) {
                    $('#id').val(response.result.id);
                    $('.categoryName').val(response.result.categoryName || '');
                }
            } else {
                alert(response.error);
            }
        });
        $('#exampleModal').modal('show');
        
    });
});

// $('#formvalidate').validate({
//     submitHandler: function (form, event) {
//         event.preventDefault()
//         $.ajax({
//             type: $(form).attr('method'),
//             url: '/modify/' + $('#id').val(),
//             data: $(form).serializeArray(),
//         }).done(function (response) {
//             if(response.success == true) {
//                 $('#exampleModal').modal('hide');
//                 Categroy.ajax.reload();
//                 alert('category updated');
//             } else {
//                 alert(response.message || response.error);
//             }
//             $('#formvalidate #submitBtn').prop('disabled', false);
//         });
//     }
// })
// });