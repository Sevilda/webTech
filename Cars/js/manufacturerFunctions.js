function onReady() {
    $.getJSON("https://webtechcars.herokuapp.com/api/manufacturers", function (data) {
        var table = $("#manufacturersTable");
        $.each(data, function (key, value) {
            var row = $("<tr> </tr>");
            var idCell= $("<td class='hidden'>" + value._id+ "</td>")
            var nameCell=$("<td>" + value.name + "</td>");
            var countryCell=$("<td>" + value.country + "</td>");
            var foundedCell=$("<td>" + value.founded + "</td>");

            $(row).append(idCell);
            $(row).append(nameCell);
            $(row).append(countryCell);
            $(row).append(foundedCell);

            $(table).append(row);
        })
    })
}


$(document).ready(onReady());

$("#manufacturersTable").on("click", "tbody tr", function(){
    $(this).addClass('selected').siblings().removeClass('selected');
});

$('.update').on('click', function(e){
    $(".formTable").removeClass("hidden");
    $("#id").val($("#manufacturersTable tr.selected td:first").html());
    $("#name").val($("#manufacturersTable tr.selected td:nth-child(2)").html());
    $("#country").val($("#manufacturersTable tr.selected td:nth-child(3)").html());
    $("#founded").val($("#manufacturersTable tr.selected td:nth-child(4)").html());
    $("#ok").val("Update");
});

$('.add').on('click', function(e){
    resetForm();
    $(".formTable").removeClass("hidden");
    $("#ok").val("Add");
});

$('.delete').on('click', function(e){
    alert("Deleting row: " + $("#manufacturersTable tr.selected td:nth-child(2)").html());
    deleteSelectedRow();
});

$('#ok').on('click', function(e){
    var buttonVal = document.getElementById("ok").value;
    //new entry
    if  (buttonVal== "Add"){
        buildTableRow();
        newEntry();
        resetForm();
    }
    //update existing
    else {
        buildTableRow();
        deleteSelectedRow();
        newEntry()
        resetForm();
    }
});

function deleteSelectedRow() {
    var id= $("#manufacturersTable tr.selected td:first").html();
    $("#manufacturersTable tr.selected td:first").each(function (){
//        alert("Ajax ID " + id);
        var url = "https://webtechcars.herokuapp.com/api/manufacturers" + "/" + id;
        $.ajax({
            type: "DELETE",
            url: url,
        });
    });
    $('tr.selected').remove();
}

function resetForm() {
    $("#id").val("");
    $("#name").val("");
    $("#country").val("");
    $("#founded").val("");
    $(".formTable").addClass("hidden");
}

function entryToJson () {
    var table = $("#manufacturersTable");
    var field =  ["_id", "name", "country", "founded"];
    var row={};

    table.find("tbody tr.new").find("td").each(function (i) {
        var key = field[i],
            value = $(this).html();
        row[key] = value;
    });
    $("#manufacturersTable tr.new").removeClass("new");
    //alert(JSON.stringify(row));
    return (JSON.stringify(row));
}

function buildTableRow() {
    var table = $("#manufacturersTable");

    var row = $("<tr class='new'> </tr>");
    var idCell= $("<td class='hidden'>" + $("#id").val() + "</td>")
    var nameCell=$("<td>" + $("#name").val() + "</td>");
    var countryCell=$("<td>" + $("#country").val()+ "</td>");
    var foundedCell=$("<td>" + $("#founded").val() + "</td>");

    row.append(idCell);
    row.append(nameCell);
    row.append(countryCell);
    row.append(foundedCell);

    table.append(row);
}

function newEntry () {
    var entry = entryToJson();
    $.ajax({
        async:false,
        type: "POST",
        url: "https://webtechcars.herokuapp.com/api/manufacturers",
        data: entry,
        dataType: "json",
        contentType: "application/json",
    });

    reloadManufacturers();
}

function reloadManufacturers() {
    $("#content").load("manufacturers.html");
}