// JavaScript Document
var idioma = $("html").attr("lang");


$(document).ready ( function() {
	

	//$(document).pngFix();
	$("body").addClass("js");


	// Pestanyes 
	 pestanyes();

/* Destaca la primera paraula de títols
*******************************************************************/
$('.box3 H2').each(function(){
    var me = $(this)
       , t = me.text().split(' ');
    me.html( '<span class="first-word">'+t.shift()+'</span> '+t.join(' ') );
  });



/* treure label Cercador
************************************************************************/
$("#search label").hide();

$("#search input#cerca").focus(function(){
	$("#search input#cerca").attr("value","")
});

	
/*
$("#search input#cerca").attr("value","")


$("#search input#cerca").focus(function(){
			$("#search label").hide();
});

$("#search input#cerca").blur(function(){
	if ($(this).attr("value")==""){
		$("#search label").show();
	}else{
		$("#search label").hide();
	}
});
*/



/** Cantonades **/
	
	$("#submenu .bloc, #tramits #ciutadans, #tramits #empreses").append('<span class="sd"></span><span class="se"></span><span class="id"></span><span class="ie"></span>');
	
	
	
});







function pestanyes(){

/*$("#submenu h3, #webs-bcn h3").addClass("js");*/
	 $("#submenu .bloc:not(:first), #webs-bcn .bloc:not(:first)").hide();
	 $("#submenu h3:first, #webs-bcn h3:first").addClass("activa");
		$("#submenu h3, #webs-bcn h3").wrapInner("<span tabindex=\"0\"></span>")
	 
	 
	 $("#submenu h3, #webs-bcn h3").each(function(){
		 $(this).click(function(){
				
				$(this).siblings("h3").removeClass("activa");
				$(this).addClass("activa");
				
				$("#submenu h3,  #webs-bcn h3").next("div").hide();
				$(this).next("div").show();
											  
		 });
		 $(this).keypress ( function(event) {
				
					if (keyNum(event)==13)
						$(this).siblings("h3").removeClass("activa");
						$(this).addClass("activa");
						
						$("#submenu h3,  #webs-bcn h3").next("div").hide();
						$(this).next("div").show();
					});
					function keyNum(e) {
						var keynum;
						if (window.event) keynum = e.keyCode; // IE
						else if (e.which) keynum = e.which; // Estandars
						return(keynum);
					}
			
	 });

}


//Funcio per donarli format el títol del plenari.
function formatTitle(title, currentArray, currentIndex, currentOpts) {
	
	
	var codi="";
	var param=title.indexOf("+");	
	if(param!=-1){
		var arg=title.split("+");
		codi='<h1>' + arg[0] + '</h1><p>'+arg[1]+'</p>';
	}else{
		codi='<h1>' + title + '</h1>';
	}
	
    return codi;
}