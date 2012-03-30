function main() {
	$('#home').hide();

	$('#home_button').click(function() {
		$("#home").fadeIn(600, function() {
		});		
	});	
}

$(document).ready(function() {
	main();
});