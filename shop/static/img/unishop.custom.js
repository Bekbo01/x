(function () {
    $(".open-crm-form").click(function() {
        $("body").prepend("<div class='modal-backdrop show'></div>");
        $("html").css("overflow","hidden");
    
        var id = $(this).data("form-id");
        if(id){
            $("#form"+id).find("input,select").styler();
            $("#form"+id).removeClass("hidden").show();
            $("#form"+id+" form").show();
            $("#form"+id+" .crm-after-submit-block").hide();
        }
        return false;
    });
    
    $("body").on("click",".modal-crm-form .close-btn", function () {
        $(this).closest(".modal-crm-form").addClass("hidden");
        $("body").find(".modal-backdrop").remove();
        $("html").css("overflow","auto");
        return false;
    });
})();