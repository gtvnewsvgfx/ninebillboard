$(document).ready(function () {
	
	// Test for Google Chrome
	let notChrome = !/Chrome/.test(navigator.userAgent)
    let alertMessage = "Please use Google Chrome to access this site.\nSome key features do not work in browsers other than Chrome."
    if(notChrome) alert(alertMessage)
	
	//Initialise tooltips
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	  return new bootstrap.Tooltip(tooltipTriggerEl)
	})

	//Check browser size and alert if too low
	function checkSize(){
		var w = $(window).width();

			if (w < 1270) {
			  alert("Browser width is too small. \nSome words may appear outside of the image. \nImages will still render correctly.")
			}
	}
	checkSize()
	$(window).resize(function () {
		
		clearTimeout(window.resizedFinished);
		window.resizedFinished = setTimeout(function(){
			checkSize()
		}, 250);
		
	});
	
	addSizeLabel();
	
	updateAllWords("Words");
	
	toggleType()
	
	toggleUppercase()
	
	var Slider = document.getElementsByClassName("slider");
	$(Slider).on('mouseup touchend', function(){
	  var words = document.getElementById('wordsInput').value;
		
		if (words == ""){
			words = "Words"
		};

		var t = $(this).parent().parent();
		t = $(t)[0].getElementsByClassName("textBox");
		
		for (j = 0; j < t.length; j++){
		
			var T = t[j];

			updateWords(words,T);
		
			$(T).removeClass("highlight")
			$(T).addClass("base");

		}
		
		gtag('event', 'slider_adjustment', {
		  "words_used": words,
		});
	});
	
	for (var i = 0; i < Slider.length; i++) {
	   setSliders(Slider[i]);
	}
	$(document.getElementsByClassName("slider")).on('input',function (){
		sliders(this);
	})
	
  $('#wordsInput').on('input', function (event) {
	event.preventDefault();

	var words = document.getElementById('wordsInput').value;

	updateAllWords(words);

  });


  $('#download').click(function () {

    var targetDivs = document.getElementById("banners").getElementsByClassName("banner");

    // Count divs to dowload
    var count = 0;

    for (var i = 0; i < targetDivs.length; i++) {
      var cb = targetDivs[i].getElementsByClassName("form-check-input")[0].checked;
      if (cb == true) {
        count++
      }
    }
	  
	  
    console.log("downloading " + count + " images");
    $('#counter').html("0 /" + count);
	  
	  if (count == 0) {
			$('#status').html("Select at least one");
			$('#counter').html("");
			setTimeout(function () {$('#status').html("Download");},2000);
          }
	  
	$('#banners').css('width', "3000px");
	$('#banners').css('height', "3000px");

  	//Collect divs and render as jpg
    for (var i = 0; i < targetDivs.length; i++) {

      var cb = targetDivs[i].getElementsByClassName("form-check-input")[0].checked;
      var completed = 0;

      if (cb == true) {
		  
        $('#status').html("Rendering ");
        $('#progressDiv').collapse('show');
        $('#progressDiv').css('height', "8px");
	  	$("html, body").animate({ scrollTop: $(document).height() }, 1000);

        var Scale = targetDivs[i].getAttribute('data-scale');
		  
		  window.scrollTo(0,0);
		  
		var w = $(targetDivs)[i].getBoundingClientRect().width;
		  w = w.toFixed(2);
	  	var h = $(targetDivs)[i].getBoundingClientRect().height;
		  h = h.toFixed(2);
		  
		  console.log("w: " + w + " h: " + h);

        html2canvas($(targetDivs[i])[0], {
			width: w,
			height: h,
			scale: Scale,
			logging: false,
			allowTaint: true,

        }).then(function (canvas) {

          // BUILD DATE
		var date = new Date();
		var newsYear = date.getFullYear();
		var M = date.getMonth();
		var MM = M+1;
			if (MM < 10){
				MM = "0" + MM.toString();
			}
		var YY = newsYear.toString().substr(-2);
		var DD = date.getDate();
			if (DD < 10){
				DD = "0" + DD.toString();
			}
		var DDMMYY = DD+MM+YY;
			

          var words = document.getElementById('wordsInput').value;
          var length = 25;
          var title = words.length > length
            ? words.substring(0, length - 3) + "..."
            : words;
			
			var fileName = '9NEWSMELBOURNE_' + DDMMYY + '_' + canvas.width + 'x' + canvas.height + '.jpeg';

          var a = document.createElement('a');
          a.href = canvas.toDataURL("image/jpeg", 1.0);
          a.download = fileName;
          a.click();
		
          completed++
			
			//Analytics even tag
			gtag('event', 'file_download', {
			  file_extension: '.jpeg',
			  file_name: fileName,
			  link_text: 'Download',
			  // Custom parameter
			  img_width: canvas.width,
				img_height: canvas.height,
				img_count: completed + " / " + count,
			})

			
		//Update progress bar and text

          $('#counter').html(completed + " / " + count);
          var progress = (completed / count) * 100;
          $('#progress').css('width', progress + "%");

          if (completed == count) {
            setTimeout(function () {$('#progress').css('width', "0%");}, 	2000);
            setTimeout(function () {$('#counter').html("");}, 				2000);
            setTimeout(function () {$('#status').html("Complete");}, 		2000);
			setTimeout(function () {$('#progressDiv').collapse('hide')}, 	2100);
            setTimeout(function () {$('#status').html("Download");}, 		3000);
          }

        });
      }

    }
	$('#banners').css('width', "");
	$('#banners').css('height', "");

  });
	
	
  $('#toggleSelect').click(function (event) {
    event.preventDefault();

    //console.log("click!")

    var targetDivs = document.getElementById("banners").getElementsByClassName("banner");

    // 
    var C = document.getElementById("banners").getElementsByClassName("banner")[0].getElementsByClassName("form-check-input")[0].checked;

    for (var i = 0; i < targetDivs.length; i++) {

      if (C == true) {
        targetDivs[i].getElementsByClassName("form-check-input")[0].checked = false;
      } else {
        targetDivs[i].getElementsByClassName("form-check-input")[0].checked = true;
      }

    }

  });
});

function addSizeLabel(){
		
		$('#banners').css('width', "3000px");
		$('#banners').css('height', "3000px");
		
		var targetDivs = document.getElementById("banners").getElementsByClassName("banner");
		
		for (var i = 0; i < targetDivs.length; i++){
			
			var div = document.getElementById("banners").getElementsByClassName("banner");
			
			var scale = div[i].getAttribute('data-scale');
			//console.log(scale);
			
			var label = div[i].getElementsByClassName("text-label")[0];
			
			var width = $(div)[i].getBoundingClientRect().width;
				width = width*scale;
			
			var height = $(div)[i].getBoundingClientRect().height;
				height = height*scale;
			
			var label = div[i].getElementsByClassName("text-primary")[0];
			$(label).html(width + " x " + height);
		}
		$('#banners').css('width', "");
		$('#banners').css('height', "");
	}

function updateAllWords(words){
	
	var targetDivs = document.getElementById("banners").getElementsByClassName("textBox");
	  
	//Update words
	for (var i = 0; i < targetDivs.length; i++) {
		
      var e = targetDivs[i];

      updateWords(words,e)
    }
}

function updateWords(words,e){
	
	var divID = e.getElementsByClassName("words")[0];

	var fontSize = divID.getAttribute('data-max-font-size');
	//console.log("size: " + fontSize)

	$(divID).html(words)

	//var h = $(e)[0].getBoundingClientRect().height;

	//Adjust text to fill
	$(e).textfill({
		changeLineHeight: true,
		maxFontPixels: fontSize,
		//minFontPixels: fontSize,
		//debug: true,
	});
}

function setSliders(e){
	
	var p = $(e).parent();
	var	pP = $(p).parent();
	
	var t = $(pP)[0].getElementsByClassName("textBox")[0];
	var s = $(pP)[0].getElementsByClassName("slider")[0];
	
	var w = $(t)[0].getBoundingClientRect().width;
	
	var min = w*0.5;
	var max = w*1.3;
	
	$(s).attr("min",min)
	$(s).attr("max",max)
	
	s.value = w;
	
}

function sliders(e){
	
	var p = $(e).parent();
	var	pP = $(p).parent();
	
	var s = $(pP)[0].getElementsByClassName("slider")[0];
	var t = $(pP)[0].getElementsByClassName("textBox");
	
	for (j = 0; j < t.length; j++){
		
		var T = t[j];
		
		var w = $(T)[0].getBoundingClientRect().width;
	
		$(T).removeClass("base")
		$(T).addClass("highlight");


		$(T).css("width",s.value)
		
		if ($(T)[0].classList.contains("textBox-right")){
			
			var m = $(T).css("margin-left");
				m = parseInt(m,10);
			var newM = m+(w-s.value);
			
			$(T).css("margin-left",newM+"px");
			
		}
		
	}
	
}

function toggleType(){
	
	$('#types').change(function(){
		var s = $("input[name='typeToggle']:checked").val();

		//console.log(s);
		
		var images = $('img');
		
		for (i = 0; i < images.length; i++){
			
			var src = $(images[i]).attr('src');
			
			src = src.split("_")[0];
			
			var name = src + "_" + s + ".png";
			
			$(images[i]).attr("src", name);
			
			//console.log(src);
			console.log(name);
			
			//$(this).attr("src", "images/card-front.jpg");
		}
		gtag('event', 'toggle_Type', {
		  "slected_type": s,
		});
		
	});
	
}

function toggleUppercase(){
	
	$('#uppercase').change(function(){
		
		var e = document.getElementsByClassName("words");
		
		$(e).toggleClass("allcaps");
		
	});
	
}