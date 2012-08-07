(function( $ ){

	$.fn.retro = function( options ) {
		var settings = $.extend( {
			'cur_number'	: 1,
			'max_number'	: "10",
			'height'		: "80",
			'width'			: "50", 
			'margin'		: "5",
			'persp'			: '80',
			'border-radius'	: "value",
			'year'			: 2014,
			'month'			: 5,
			'day'			: 4,
			'show_seconds'	: true,
			'reflections'	: true,
			'seperator'		: "<div style='float:left' class='seperator'> : </div>"
		}, options);
		//calculate date components
		// inspired by http://www.javascriptkit.com/script/script2/count2.shtml

		var montharray=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
		var today=new Date();
		var todayy=today.getYear();
		if (todayy < 1000)
			todayy+=1900;
		var todaym=today.getMonth();
		var todayd=today.getDate();
		var todayh=today.getHours();
		var todaymin=today.getMinutes();
		if(settings['show_seconds'] == true)
			var todaysec=today.getSeconds();
		var todaystring=montharray[todaym]+" "+todayd+", "+todayy+" "+todayh+":"+todaymin+":"+todaysec;
		futurestring=montharray[settings['month']-1]+" "+settings['day']+", "+settings['year'];
		dd=Date.parse(futurestring)-Date.parse(todaystring);
		var dday=Math.floor(dd/(60*60*1000*24)*1);
		var dhour=Math.floor((dd%(60*60*1000*24))/(60*60*1000)*1);
		var dmin=Math.floor(((dd%(60*60*1000*24))%(60*60*1000))/(60*1000)*1);
		var print_digits = function(x,pos){
			var digits = x+'';
			digits =  digits.length;
			var rval = $();
			if(digits < 2)
				digits = 2;
			for(var i = digits; i > 0 ; --i)
			{
				var cur_digit = Math.floor(x/Math.pow(10,i-1));
				var digit = $('<div class="digit">').data('cur_digit',cur_digit).data('cur_pos',pos + i).html('  <div class="back">'+(cur_digit > 0 ? cur_digit -1 : max_value[pos + i])+'</div>\
					<div class="back-bottom">'+(cur_digit)+'</div>\
					<div class="top-half">\
					'+(cur_digit)+'</div>\
					<div class="bottom-half">'+( cur_digit > 0 ? cur_digit -1 : max_value[pos + i])+'</div>\
					<div class="front">'+( cur_digit > 0 ? cur_digit -1 : max_value[pos + i])+'</div>\
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
		var max_value = {'sec1':9,'sec2':5,'min1':9,'min2':5,'hour1':9,'hour2':5};
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
			$this.find('.digit').height(settings['height']+'px').width(settings['width']+'px').css({'font-size':settings['height']+'px',
				'line-height':settings['height']+'px','margin-right':settings['margin'],'-webkit-perspective':settings['persp'],'-ms-perspective':settings['persp'],'-moz-perspective':settings['persp'],'perspective':settings['persp']});
			if(settings['reflections'] == true)
				$this.find('.digit').addClass('reflect');
			$this.find('.seperator').css({'margin-right':settings['margin']+'px','line-height':settings['height']+'px','font-size':settings['height']+'px'});
			$this.find('.bottom-half').css('top',(settings['height']/2)+'px');
			$this.find('.back-bottom').css('top',(settings['height']/2)+'px');
			$this.find('.back, .front, .shadow').css('border-radius',settings['border_radius']+'px');
			$this.find('.top-half').css({'border-top-left-radius':settings['border_radius']+'px',
				'border-top-right-radius':settings['border_radius']+'px'});
			$this.find('.back-bottom, .bottom-half').css({'border-bottom-left-radius':settings['border_radius']+'px',
				'border-bottom-right-radius':settings['border_radius']+'px'});
			var interval = (settings['show_seconds'] == true ? 1000 : 60000);

			setInterval(function(){
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
						if($(this).data('cur_digit') == max_value[$(this).data('cur_pos')])
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
			},interval);
		}); 
	};
})( jQuery );