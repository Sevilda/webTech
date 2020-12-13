function onReady() {
    $.getJSON("https://webtechcars.herokuapp.com/api/cars", function (data) {
        var table = $("#cartable");
        $.each(data, function (key, value) {
            var row = $("<tr> </tr>");
            var idCell= $("<td class='hidden'>" + value._id+ "</td>")
            var nameCell=$("<td>" + value.name + "</td>");
            var consumptionCell=$("<td>" + value.consumption + "</td>");
            var colorCell=$("<td>" + value.color + "</td>");
            var manufacturerCell=$("<td>" + value.manufacturer + "</td>");
            var availableCell=$("<td>" + value.avaiable + "</td>");
            var yearCell=$("<td>" + value.year + "</td>");
            var horsepowerCell=$("<td>" + value.horsepower + "</td>");

            $(row).append(idCell);
            $(row).append(nameCell);
            $(row).append(consumptionCell);
            $(row).append(colorCell);
            $(row).append(manufacturerCell);
            $(row).append(availableCell);
            $(row).append(yearCell);
            $(row).append(horsepowerCell);

            $(table).append(row);
        })
    })
}

$(document).ready(onReady());
$(document).ready(setManufacturers());

$("#cartable").on("click", "tbody tr", function(){
    $(this).addClass('selected').siblings().removeClass('selected');
    var value=$(this).find('td:first').html();
});

$('.update').on('click', function(e){
    $(".formTable").removeClass("hidden");
    $("#id").val($("#cartable tr.selected td:first").html());
    $("#name").val($("#cartable tr.selected td:nth-child(2)").html());
    $("#consumption").val($("#cartable tr.selected td:nth-child(3)").html());
    $("#color").val($("#cartable tr.selected td:nth-child(4)").html());
    $("#manufacturer").val($("#cartable tr.selected td:nth-child(5)").html());
    $("#available").val($("#cartable tr.selected td:nth-child(6)").html());
    $("#year").val($("#cartable tr.selected td:nth-child(7)").html());
    $("#horsepower").val($("#cartable tr.selected td:nth-child(8)").html());
    $("#ok").val("Update");
});

$('.add').on('click', function(e){
    resetForm();
    $(".formTable").removeClass("hidden");
    $("#ok").val("Add");

});

$('.delete').on('click', function(e){
    alert("Deleting row: " + $("#cartable tr.selected td:nth-child(2)").html());
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
    var id= $("#cartable tr.selected td:first").html();
    $("#cartable tr.selected td:first").each(function (){
//        alert("Ajax ID " + id);
        var url = "https://webtechcars.herokuapp.com/api/cars" + "/" + id;
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
    $("#consumption").val("");
    $("#color").val("");
    $("#manufacturer").val("");
    $("#available").val("");
    $("#year").val("");
    $("#horsepower").val("");
    $(".formTable").addClass("hidden");
}

function entryToJson () {
    var table = $("#cartable");
    var field =  ["_id", "name", "consumption", "color", "manufacturer", "avaiable", "year", "horsepower"];
    var row={};


    table.find("tbody tr.new").find("td").each(function (i) {
        var key = field[i],
            value = $(this).html();
        row[key] = value;
        if (field[i]=="consumption")
            if ($(this).html().includes("kWh/100km")) {}
            else
                row[key] += "kWh/100km";
    });
    $("#cartable tr.new").removeClass("new");
    //alert(JSON.stringify(row));
    return (JSON.stringify(row));
}

function buildTableRow() {
    var table = $("#cartable");

    var row = $("<tr class='new'> </tr>");
    var idCell= $("<td class='hidden'>" + $("#id").val() + "</td>")
    var nameCell=$("<td>" + $("#name").val() + "</td>");
    var consumptionCell=$("<td>" + $("#consumption").val()+ "</td>");
    var colorCell=$("<td>" + $("#color").val() + "</td>");
    var manufacturerCell=$("<td>" + $("#manufacturer").val() + "</td>");
    var availableCell=$("<td>" + $("#available").val() + "</td>");
    var yearCell=$("<td>" + $("#year").val() + "</td>");
    var horsepowerCell=$("<td>" + $("#horsepower").val() + "</td>");

    row.append(idCell);
    row.append(nameCell);
    row.append(consumptionCell);
    row.append(colorCell);
    row.append(manufacturerCell);
    row.append(availableCell);
    row.append(yearCell);
    row.append(horsepowerCell);

    table.append(row);
}

function newEntry () {
    var entry = entryToJson();
    $.ajax({
        async:false,
        type: "POST",
        url: "https://webtechcars.herokuapp.com/api/cars",
        data: entry,
        dataType: "json",
        contentType: "application/json",
    });

    reloadCars();
}

function reloadCars() {
    $("#content").load("cars.html");
}

function setManufacturers() {
    $.getJSON("https://webtechcars.herokuapp.com/api/manufacturers", function (data) {
        var select = $("#manufacturer");

        $.each(data, function(index, value) {
            var option = document.createElement("option");
            option.append(value.name);
            option.setAttribute("value", value.name);

            console.log(option);

            select.append(option);
        });
    });
}