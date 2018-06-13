popupActive = 0;
popupClick = 0;
popupClass = 0;

$(".timeline-icon").hover(function(){
	secondClass = $(this).attr('class').split(' ')[1];
	selectedClass = $(".timeline-icon." + secondClass);
	selectedClass.addClass("timeline-icon-hover");
}, function(){
	selectedClass.removeClass("timeline-icon-hover");
});

$("body").click(function(evt){
	if (popupClick == 1){
		popupClick = 0;
		return;
	};

	if (popupActive == 1){
		if(evt.target == popupClass) return;
		if($(evt.target).closest(popupClass).length) return;
		popupClass.hide();
		popupActive = 0;
	};
});

$(".timeline-icon").click(function(){
	if(popupClass) popupClass.hide();
	secondpopupClass = $(this).attr('class').split(' ')[1];
	popupClass = $(".timeline-popup." + secondClass);
	popupClass.show();
	popupActive = 1;
	popupClick = 1;
});
