$(document).ready(function () {

    $("#content").load("main.html");

    $.each($(".menuButton"), function (index, value) {
        $(value).click(function (event) {
            event.preventDefault();
            if ($(this).find('a').attr("href") == "index.html") {
                open("index.html", "_self");
            }
            else {

                $("#content").load($(this).find('a').attr("href"))
            }
        })
    })

})

