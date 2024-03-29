/*
	Filtered Input plugin for jQuery v.0.0.1
	Copyright 2012 Sergey Smelov
*/

(function($) {

	$.fn.extend({

		filterinput: function(settings) {
			
			var defaults = {  
              regexp:".*",
              maxlength: 50,
			  defaultval: ""
            }   
                
			var settings =  $.extend(defaults, settings);			
			var input = $(this[0]);
			var regexp = new RegExp(settings.regexp);
			
			function clearBuffer(buf)  {
				var len = buf.length;				
				for (var i = 0; i < len; i++) {
					buf[i] = '';
				}
			}
			
			function getSelectedText() {
	
				var begin = 0;
				var end = 0;
				var len = input.val().length;
				
				if (input[0].setSelectionRange) {
					begin = input[0].selectionStart;
					end = input[0].selectionEnd;
				} else if (document.selection && document.selection.createRange) {
					var range = document.selection.createRange();
					begin = 0 - range.duplicate().moveStart('character', -100000);
					end = begin + range.text.length;
				}											
								
				return input.val().substr(begin, end - begin);
			}
			
			function replaceInput() {				
				var text = input.val();
				var len = text.length;
				var buffer = text.split('');
				clearBuffer(buffer);
				
				for (var i = 0, pos = 0; i < len; i++) {
					var c = text.charAt(i);
					if (regexp.test(c)) {
						buffer[pos] = c;
						pos++;
					}
				}				
				input.val(buffer.join('').substr(0, settings.maxlength));
			}
			
			function blurEvent(evt) {
				if ( $.trim(input.val()).length == 0) {
					input.val(settings.defaultval);
				}
			};
			
			function keypressEvent(evt) {
				var charCode = (evt.which) ? evt.which : window.event.keyCode;  

				if (charCode <= 13) { 
					return true; 
				} 
				else {				
					var selectedText = getSelectedText();					
					var newLength = input.val().length - selectedText.length + 1;
					
					if (newLength <= settings.maxlength)
					{
						var keyChar = String.fromCharCode(charCode); 
						return regexp.test(keyChar); 						
					}
					else
					{
						return false;
					}							
				} 
			};
			
			input
			.unbind(".filteredinput")
			.bind("blur.filteredinput", blurEvent)					
			.bind('keypress.filteredinput', keypressEvent)
			.bind(($.browser.msie ? 'paste' : 'input') + ".filteredinput", function() {
				setTimeout( function() { replaceInput() }, 0 );
			});	

			replaceInput();
		}
	});
})(jQuery);
