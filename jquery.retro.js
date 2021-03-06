(function( $ ){

	$.fn.retro = function( options ) {
		var settings = $.extend( {
			'cur_number'	: 1,
			'max_number'	: "10",
			'height'		: "80",
			'font-size'		: "80",
			'width'			: "50", 
			'margin'		: "5",
			'persp'			: '80',
			'border-radius'	: "10",
			'year'			: 2014,
			'month'			: 5,
			'day'			: 4,
			'show_seconds'	: true,
			'reflections'	: true,
			'stack'			: true,
			'seperator'		: "<div style='float:left' class='seperator'> : </div>",
			'font'			:'Arial'
		}, options);
		//calculate date components
		// inspired by http://www.javascriptkit.com/script/script2/count2.shtml

		var montharray=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
		var eventDate = new Date(settings['year'],settings['month'],settings['day']);
		var today=new Date();
		// if the date is in the past then the counter is stale.
		var stale = false;
		if (eventDate < today) {
			//the requested date is in the past.
			stale = true;
		}
		// getting date components
		var todayy=today.getYear();
		if (todayy < 1000)
			todayy+=1900;
		var todaym=today.getMonth();
		var todayd=today.getDate();
		var todayh=today.getHours();
		var todaymin=today.getMinutes();
		var todaysec=today.getSeconds();
		var todaystring=montharray[todaym]+" "+todayd+", "+todayy+" "+todayh+":"+todaymin+":"+todaysec;
		var flips_remaining;
		futurestring=montharray[settings['month']-1]+" "+settings['day']+", "+settings['year'];
		//dd is difference in milliseconds
		dd=Date.parse(futurestring)-Date.parse(todaystring);

		// if the difference is negative then it is in the past, the counter should stop and show zeros
		if (dd < 0) {
			dd = 0;
			flips_remaining = 0;
		}
		else
		{
			if (settings['show_seconds'] == true) {
				flips_remaining = dd / 1000;
			}
			else
			{
				flips_remaining = dd / 1000;
				flips_remaining = flips_remaining / 60;
			}
		}
		var dday=Math.floor(dd/(60*60*1000*24)*1);
		var dhour=Math.floor((dd%(60*60*1000*24))/(60*60*1000)*1);
		var dmin=Math.floor(((dd%(60*60*1000*24))%(60*60*1000))/(60*1000)*1);
		// delta is the difference between the height of the digit based on font size and the hight of the containing div 
		var delta = (settings['height'] - settings['font-size']) / 2;
		if(delta < 0)
			delta = 0;

		var print_digits = function(x,pos){
			var digits = x+'';
			digits =  digits.length;
			var rval = $();
			if(digits < 2)
			{
				digits = 2;
			}
			for(var i = digits; i > 0 ; --i)
			{
				var cur_digit = Math.floor(x/Math.pow(10,i-1));
				var prev_digit;
				if(i == 2 && x < 10) // test for single digit and pad with 0
				{
					cur_digit = 0;
					prev_digit = 0;
					single_digit = false;
				}
				else
				{
					prev_digit = ( cur_digit > 0 ? cur_digit -1 : max_value[pos + i]);
				}
				var digit = $('<div class="digit">').data('cur_digit',cur_digit).data('cur_pos',pos + i).html('  <div class="back">'+prev_digit+'</div>\
					<div class="back-bottom">'+(cur_digit)+'</div>\
					<div class="top-half">\
					'+(cur_digit)+'</div>\
					<div class="bottom-half">'+prev_digit+'</div>\
					<div class="front">'+prev_digit+'</div>\
					<div class="shadow">\
					<div class="top"></div>\
					<div class="bottom"></div>\
					</div>');
				x = x % Math.pow(10,i-1);
				rval = rval.add(digit);
			}
			return rval;
		}
		var flip_digit = function(ele,from,to)
		{
			ele.find('.bottom-half').addClass('ready');
			ele.addClass('flip');
			setTimeout(function(){
				ele.find('.front').show();
				ele.find('.top-half,.bottom-half').css('opacity','0').removeClass('ready');
				ele.removeClass('flip');
				setTimeout(function(){
					ele.find('.top-half,.bottom-half').css('opacity',1);
					ele.find('.back-bottom, .top-half').text(from);
					ele.find('.back, .bottom-half').text(to);
					ele.find('.front').hide().text(to);
				},700);

			},300);
		};
		var max_value = {'sec1':9,'sec2':5,'min1':9,'min2':5,'hour1':9,'hour2':5,'day1':9,'day2':9};
		if(settings['show_seconds'] == true)
			var dsec=Math.floor((((dd%(60*60*1000*24))%(60*60*1000))%(60*1000))/1000*1);

		return this.each(function()
		{
			var $this = $(this);
			$this.append(print_digits(dday,'day'));
			$this.append(settings['seperator']);
			$this.append(print_digits(dhour,'hour'));
			$this.append(settings['seperator']);
			$this.append(print_digits(dmin,'min'));
			if(settings['show_seconds'] == true)
			{
				$this.append(settings['seperator']);
				$this.append(print_digits(dsec,'sec'));
			}
			$this.find('.digit').height(settings['height']+'px').width(settings['width']+'px').css({'font-size':settings['font-size']+'px',
				'font-family':settings['font'],'line-height':settings['font-size']+'px','margin-right':settings['margin']+'px','-webkit-perspective':settings['persp']+'px','-ms-perspective':settings['persp']+'px','-moz-perspective':settings['persp']+'px','perspective':settings['persp']+'px'});
			if(settings['reflections'] == true)
				$this.find('.digit').addClass('reflect');
			if(settings['stack'] == true)
				$this.find('.back').addClass('stack');
			$this.find('.seperator').css({'margin-right':settings['margin']+'px','line-height':settings['font-size']+'px','font-size':settings['font-size']+'px'});
			$this.find('.bottom-half').css('top',(settings['height']/2)+'px');
			$this.find('.back-bottom').css('top',(settings['height']/2)+'px');
			$this.find('.back, .front, .shadow').css({'border-radius':settings['border-radius']+'px'});
			$this.find('.back, .front').css({'padding-top':delta+'px'});
			$this.find('.top-half').css({'border-top-left-radius':settings['border-radius']+'px',
				'border-top-right-radius':settings['border-radius']+'px','padding-top':delta+'px'});
			$this.find('.top').css({'border-top-left-radius':settings['border-radius']+'px',
				'border-top-right-radius':settings['border-radius']+'px'});
			$this.find('.back-bottom, .bottom-half, .shadow > .bottom').css({'border-bottom-left-radius':settings['border-radius']+'px',
				'border-bottom-right-radius':settings['border-radius']+'px'});
			var interval = (settings['show_seconds'] == true ? 1000 : 60000);
			if (!stale)
			{
				var clock = window.setInterval(function()
				{
					$this.find('.bottom-half').addClass('ready');
					$this.find('.digit').each(function()
					{
						var position = (settings['show_seconds'] == true ? 'sec1':'min1')
						if($(this).data('cur_pos') == position)
						{
							var digit = ($(this).data('cur_digit') > 0 ? $(this).data('cur_digit') -1 : max_value[$(this).data('cur_pos')]);
							var next_digit = (digit > 0 ? digit -1 : max_value[$(this).data('cur_pos')]);;
							$(this).data('cur_digit',digit);
							flip_digit($(this),digit,next_digit);
							if(digit == max_value[$(this).data('cur_pos')])
							{
								var cur = $(this).prev();
								while(cur)
								{
									cur_digit = (cur.data('cur_digit'));
									cur_next_digit = (cur_digit > 0 ? cur_digit -1 : max_value[cur.data('cur_pos')]);
									cur.data('cur_digit',cur_next_digit);
									if(cur.data('cur_digit') == max_value[cur.data('cur_pos')])
									{
										cur_next_digit =  cur.data('cur_digit') -1;
										flip_digit(cur, cur.data('cur_digit'),cur_next_digit);
										cur = cur.prev();
									}
									else
									{
										cur_next_digit = ( cur.data('cur_digit') == 0 ? max_value[cur.data('cur_pos')]: cur.data('cur_digit') -1 );
										flip_digit(cur, cur.data('cur_digit'),cur_next_digit);
										break;
									}
								}
							}
						}
					});
					--flips_remaining;
					if (flips_remaining <= 0) {
						window.clearInterval(clock);
					}
				},interval);
			}
		}); 
	};
})( jQuery );