$('input[type=text]').on('keydown', function(e) {
    if (e.which == 13) {
        $('.hero').fadeOut();
        $('.our-work').show();
        $('.headerDisplay').show();
        e.preventDefault();
        var name = $('#nameInput').val();
        $('.userName').text(name);
        localStorage.setItem("echoUserName", name);
        chrome.storage.local.set({"echoUserName" : name}, function(result) {
        });
        $('#nameInput').val("");
    }
});
if (localStorage.getItem("echoUserName")) {
    $('.headerDisplay').show();
    $('.userName').text(localStorage.getItem("echoUserName"));
    $('.hero').hide();
    $('.our-work').show();
} else {
    $('.hero').show();
    $('our-work').hide();
    $('.headerDisplay').hide();
};

$('.onSignout').on('click', function() {
    localStorage.removeItem("echoUserName");
    $('.headerDisplay').hide();
    $('.hero').fadeIn();
    $('.our-work').fadeOut();
});

var savedHighlights; 
var filteredHighlights; 

$('#checkSwitch').on('click', function() {
    var trueFalse = $('#checkSwitch')[0].checked;
    if (trueFalse === true) {
        $('.title2').fadeIn();
        $('.title1').hide();
        // savedHighlights
        $(".list-group").empty();
        savedHighlights.forEach((e) => e.author === localStorage.getItem("echoUserName") ? $(".list-group").prepend("<li class=\"list-group-item\">"+e.detail+"</li>") : '' );
    } else {
        $('.title2').hide();
        $('.title1').fadeIn();
        $(".list-group").empty();
        savedHighlights.forEach((e) => $(".list-group").prepend("<li class=\"list-group-item\">"+e.detail+"</li>"));
    }
    console.log($('#checkSwitch')[0].checked);
});

$.ajax({url: "https://echoes.japanwest.cloudapp.azure.com/content", success: function(result){
    console.log(result.content);
    savedHighlights = result.content;
    savedHighlights.forEach((e) => $(".list-group").prepend("<li class=\"list-group-item\">"+e.detail+"</li>"));
}});