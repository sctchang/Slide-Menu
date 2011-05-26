/**
* Slide Menu
*
* @author Scott Chang
* @link http://scottchang.net
* @version 1.0.1
* @requires jQuery v1.4 or later
*
* Examples and documentation at: http://scottchang.net/slidemenu
* Official jQuery plugin page: http://plugins.jquery.com/project/
* Find source on GitHub: https://github.com/
*
* Includes Smooth Anchors v2 by Ian Whitcomb
*   (http://www.ooeygui.net/articles/399)
*
* Known Issues or Bugs:
*   - Currently non-persistent highlighting doesn't work when Smooth Anchors is disabled (i.e. smoothAnchors : null)
*   - Smooth Anchors' scroll is jumpy in Opera when using css maps
*
* Version Changes:
*   1.0.1:
*     - added 'slide' option for static menus
*/

;(function($) {
	$.fn.slideMenu = function(options) {

		var settings = {
			'slide'				: true,		// If false the menu will not slide and will display as dictated by css
			'slideDuration'		: 200,
			'linkHiliteClass'	: null,		// Supply class id as a string: 'hilite' for .hilite { ... }
			'sectHiliteClass'	: null,		// same here...
			'linkHiliteMap'		: null,		// Supply map: { 'color':'blue', 'background':'red', ... }
			'sectHiliteMap'		: null,		// same here...
			'linkDefaultMap'	: null,		// Will use a map with linkHiliteMap's keys mapping to empty values if no map is given
			'sectDefaultMap'	: null,		// Will use a map with sectHiliteMap's keys mapping to empty values if no map is given
			'persistentHilite'	: false,
			'autoPadLinksRight'	: null,		// Assumes text-align:left; Don't use display:none; Wont pad - 'a[href^="#"]'
			'fadeIn'			: null,		// Don't use display:none; use #slideMenu { display:block; visibility:hidden; ... }
			'fadeInDelay'		: 300,		// Requires a non-null fadeIn option
			'relativeXOnResize'	: false,
			'forceDispBlock'	: false,
			'forcePositionAbs'	: false,
			'forceTextLeft'		: false,
			'forceNoWrap'		: false,
			'smoothAnchors'		: { 'speed' : 'fast', 'easing' : null, 'redirect' : false } // Supply null to disable Smooth Anchors
		};
		if(options) {
			$.extend(true, settings, options);
		}

		/**
		* Object modification to include object comparison. Adapted from...
		*   (http://stackoverflow.com/questions/1068834/object-comparison-in-javascript)
		*/
		Object.equals = function(x, y) {
			for(p in x) {
				if(typeof(y[p]) == 'undefined') {
					return false;
				}
			}
			for(p in x) {
				if (x[p]) {
					switch(typeof(x[p])) {
						case 'object':
							if(!x[p].equals(y[p])) {
								return false;
							}; break;
						case 'function':
							if(typeof(y[p]) == 'undefined' || (p != 'equals' && x[p].toString() != y[p].toString())) {
								return false;
							}; break;
						default:
							if(x[p] != y[p]) {
								return false;
							}
					}
				} else {
					if (y[p]) {
						return false;
					}
				}
			}
			for(p in y) {
				if(typeof(x[p]) == 'undefined') { return false; }
			}
			return true;
		}

		/**
		* Object modification to include a function to return object size. Source from...
		*   (http://stackoverflow.com/questions/5223/length-of-javascript-associative-array)
		*/
		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		};

		/**
		* Smooth Anchors code. Source from jquery.smoothanchors2.js
		*   By Ian Whitcomb (http://www.ooeygui.net/articles/399)
		*/
		if(settings.smoothAnchors) {
			var scrollElement = 'html, body';
			$('html, body').each(function() {
				var initScrollTop = $(this).attr('scrollTop');
				$(this).attr('scrollTop', initScrollTop+1);
				if($(this).attr('scrollTop') == initScrollTop + 1) {
					scrollElement = this.nodeName.toLowerCase();
					$(this).attr('scrollTop', initScrollTop);
					return false;
				}
			});
			$("a").each(function(i) {
				var url = $(this).attr("href");
				if(url) {
					if(url.indexOf("#") != -1 && url.indexOf("#") == 0) {
						var aParts = url.split("#", 2);
						var anchor = $("a[name='" + aParts[1] + "']");
						if(anchor) {
							$(this).click(function() {
								if($(document).height() - anchor.offset().top >= $(window).height()
									|| anchor.offset().top > $(window).height()
									|| $(document).width() - anchor.offset().left >= $(window).width()
									|| anchor.offset().left > $(window).width()) {
									$(scrollElement).animate(
										{ scrollTop:anchor.offset().top, scrollLeft:anchor.offset().left },
										settings.smoothAnchors.speed,
										settings.smoothAnchors.easing,
										function() {
											if(settings.smoothAnchors.redirect) { window.location = url }
										}
									);
								}
								return false;
							});
						}
					}
				}
			});
		}

		return this.each(function() {
			var menu = $(this);

			if(settings.forceDispBlock) {
				menu.css('display', 'block');
			}
			if(settings.forcePositionAbs) {
				menu.css('position', 'absolute');
			}
			if(settings.forceTextLeft) {
				menu.css('text-align', 'left');
			}
			if(settings.forceNoWrap) {
				menu.css('white-space', 'nowrap');
			}

			if(settings.relativeXOnResize) {
				var offsetFromCenter = menu.offset().left - $(window).width()/2;
				if(typeof settings.relativeXOnResize=='number') {
					offsetFromCenter = settings.relativeXOnResize;
					menu.css('left', $(window).width()/2 + offsetFromCenter);
				}
				$(window).resize(function() {
					menu.css('left', $(window).width()/2 + offsetFromCenter);
				});
			}

			/**
			* The following snippet is adapted from the following tutorial
			*   (http://net.tutsplus.com/tutorials/html-css-techniques/creating-a-floating-html-menu-using-jquery-and-css/)
			*/
			if(settings.slide) {
				settings.slideDuration = settings.slideDuration || 200;
				var menuYloc = parseInt(menu.css('top'));
				var offset = menuYloc + $(document).scrollTop() + 'px';
				menu.animate({ top:offset }, { duration:settings.slideDuration, queue:false });
				$(window).scroll(function() {
					offset = menuYloc + $(document).scrollTop() + 'px';
					menu.animate({ top:offset }, { duration:settings.slideDuration, queue:false });
				});
			}

			if(settings.autoPadLinksRight) {
				var measureSelector, paddingSelector, linkWidths = [];
				switch(typeof settings.autoPadLinksRight) {
					case 'string' :
						measureSelector = settings.autoPadLinksRight;
						paddingSelector = settings.autoPadLinksRight;
						break;
					case 'object' :
						measureSelector = settings.autoPadLinksRight.measureSelector;
						paddingSelector = settings.autoPadLinksRight.paddingSelector;
						break;
					default :
						measureSelector = 'a';
						paddingSelector = 'a';
				}
				menu.find(measureSelector).each(function() {
					linkWidths.push($(this).width());
				});
				var maxLinkWidth = Math.max.apply(Math, linkWidths);
				menu.find(paddingSelector).each(function(index) {
					$(this).css('padding-right', maxLinkWidth - linkWidths[index] + parseInt($(this).css('padding-right')));
				});
			}

			if(settings.fadeIn) {
				menu.css('display', 'none').css('visibility', 'visible');
				menu.delay(settings.fadeInDelay).fadeIn(settings.fadeIn);
			}

			if(settings.sectHiliteClass || settings.linkHiliteClass || settings.sectHiliteMap || settings.linkHiliteMap) {
				var sectIDs = [];
				menu.find('a[href^="#"]').each(function(index) {
					sectIDs[index] = $(this).attr('href');
				});
				if(settings.sectHiliteClass || settings.linkHiliteClass) {
					var sectID = null;
					menu.find('a[href^="#"]').click(function(e) {
						sectID = $(this).attr('href');
						if(settings.linkHiliteClass) {
							menu.find('a[href^="#"]').removeClass(settings.linkHiliteClass);
							$(this).addClass(settings.linkHiliteClass);
						}
						if(settings.sectHiliteClass) {
							$.each(sectIDs, function(index, value) {
								$(value).removeClass(settings.sectHiliteClass);
							});
							$(sectID).addClass(settings.sectHiliteClass);
						}
					});
					if(!settings.persistentHilite && settings.smoothAnchors) {
						$(document).click(function(e) {
							$(sectID).click(function(e) {
								e.stopPropagation();
							});
							sectID = null;
							menu.find('a[href^="#"]').removeClass(settings.linkHiliteClass);
							$.each(sectIDs, function(index, value) {
								$(value).removeClass(settings.sectHiliteClass);
							});
						});
					}
				}

				if(settings.sectHiliteMap || settings.linkHiliteMap) {
					var origLinkCSS = null, origSectCSS = null, sectID = null, firstLink = $('a[href^="#"]').first();
					if(settings.linkHiliteMap) {
						origLinkCSS = checkKeys(settings.linkDefaultMap, settings.linkHiliteMap) || emptyValues(settings.linkHiliteMap);
					}
					if(settings.sectHiliteMap) {
						origSectCSS = checkKeys(settings.sectDefaultMap, settings.sectHiliteMap) || emptyValues(settings.sectHiliteMap);
					}
					if(settings.linkDefaultMap) {
						menu.find('a[href^="#"]').css(settings.linkDefaultMap);
					}
					if(settings.sectDefaultMap) {
						$.each(sectIDs, function(index, value) {
							$(value).css(settings.sectDefaultMap);
						});
					}
					menu.find('a[href^="#"]').click(function(e) {
						sectID = $(this).attr('href');
						if(settings.linkHiliteMap) {
							menu.find('a[href^="#"]').css(origLinkCSS);
							$(this).css(settings.linkHiliteMap);
						}
						if(settings.sectHiliteMap) {
							$.each(sectIDs, function(index, value) {
								$(value).css(origSectCSS);
							});
							$(sectID).css(settings.sectHiliteMap);
						}
					});
					if(!settings.persistentHilite && settings.smoothAnchors) {
						$(document).click(function(e) {
							$(sectID).click(function(e) {
								e.stopPropagation();
							});
							sectID = null;
							menu.find('a[href^="#"]').css(origLinkCSS);
							$.each(sectIDs, function(index, value) {
								$(value).css(origSectCSS);
							});
						});
					}
				}
			}
		});

		/**
		* Helper functions
		*/
		function cssMap(element, map) {
			var returnMap = {};
			$.each(map, function(key, value) {
				returnMap[key] = element.css(key);
			});
			return returnMap;
		}
		function checkKeys(checkMap, modelMap) {
			if(checkMap) {
				if(typeof(checkMap)=='object') {
					if(Object.size(checkMap)==Object.size(modelMap)) {
						for (var key in checkMap) {
							if(!modelMap[key]) {
								return null;
							}
						}
						return checkMap;
					}
				}
			}
			return null;
		}
		function emptyValues(modelMap) {
			var returnMap = {};
			$.each(modelMap, function(key, value) {
				returnMap[key] = '';
			});
			return returnMap;
		}
	};
})(jQuery);