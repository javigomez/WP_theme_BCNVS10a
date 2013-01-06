/*************************** FANCY FLASH ****************************/

function callFancy(_url, _w, _h, _title) {		
	
	$.fancybox({
		'padding'		: 0,
		'transitionIn' 	: 'elastic',
		'transitionOut' : 'elastic',
		'width'   		: parseInt(_w),
		'height'     	: parseInt(_h),
		'overlayColor'  : '#000',
		'overlayOpacity': .85,
		'scrolling' 	: 'no',
		'type' 			: 'iframe',
		'titleShow'		: true,
		'title'			: _title,
		'href'			: _url,
		'onStart' 		: function(){$("object").css("visibility","hidden");},
		'onClosed'		: function(){$("object").css("visibility","visible");}
	});
}

