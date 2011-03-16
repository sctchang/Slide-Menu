# Slide Menu makes sliding menus

I developed this little plugin for my own purposes, but I hope it will help more people create sliding menus that glide along vertically as you scroll up and down. For convenience, it is bundled with Smooth Anchors 2 by Ian Whitcomb.

**Features**

- Create sliding menus that work in harmony with anchor links
- Highlight elements with custom CSS based on ids generated from anchor links
- Highlight corresponding anchor links as well
- Provide customizing CSS with maps or classes
- Packaged with Smooth Anchors to provide fluid scrolling to clicked anchor links

## Basic Usage

For minimal setup, first mark up a standard ul-based menu with some anchor links.

	<div id="smenu">
	    <ul>
	        <li><a href="#section1">Anchor Link 1</a></li>
	        <li><a href="#section2">Anchor Link 2</a></li>
	        <li><a href="#section3">Anchor Link 3</a></li>
	        <li><a href="http://scottchang.net">Normal Link 1</a></li>
	        <li><a href="http://linkbundles.com">Normal Link 2</a></li>
	    </ul>
	</div>

Next mark up the rest of your document with corresponding anchor names. Note how there are ids corresponding exactly with the anchor names. This is for section highlighting as I will discuss soon later.

	<h1><a name="section1">Section 1 Heading</a></h1>
	<p id="section1">
	    Here is some content for Section 1
	</p>
	
	<h1><a name="section2">Section 2 Heading</a></h1>
	<p id="section2">
	    Here is some content for Section 2
	</p>
	
	...

Be sure you include the jQuery js file before you reference the Slide Menu plugin js file.

	<script src="js/jquery-1.5.min.js"></script>
	<script src="js/jquery.slideMenu.min.1.0.js"></script>

Finally, call slideMenu() on the jQuery-fied object of your menu.

	$(document).ready(function() {
	    $('#smenu').slideMenu();
	});

## Basic Usage With Highlighting

For basic usage with element highlighting, provide more options like below. Active anchor links are styled by the CSS you provide in linkHiliteMap. Elements or 'sections' are highlighted by the CSS you provide in sectHiliteMap. The elements are identified by ids based on the names you give the anchor links in your menu. In other words, if you have an anchor link with href="#section1", the plugin will highlight whichever element that has id="section1".

	$(document).ready(function() {
	    $('#smenu').slideMenu({
	        slideDuration : 400,
	        linkHiliteMap : { 'color':'#fff', 'background':'#999' },
	        sectHiliteMap : { 'background':'#999' },
	        smoothAnchors : { 'speed' : 400 }
	    });
	});
   
**For options documentation and more examples, go to [http://scottchang.net/slidemenu](http://scottchang.net/slidemenu)**

*Copyright (c) 2011 Scott Chang <scott@scottchang.net>*
