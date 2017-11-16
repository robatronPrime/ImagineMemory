//Change the viewport's width when the screen orientation changes.
//Define maximum0scale=1.0, capture the pinch gesture, when the user zooms, 
//and dynamically reset the viewport's minimum-scale to the defults when that occurs.

(function(doc) {
	
	var addEvent = 'addEventListener',
			type = 'gesturestart',
			qsa = 'querySelectorAll',
			scales = [1, 1],
			meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];
	
	function fix() {
		meta.content = 'width=device-width,minimum-scale=' + scales[0] +',maximum-scale=' + scales[1];
		doc.removeEventListener(type, fix, true);
	}
	
	if ((meta = meta[meta.length - 1]) && addEvent in doc) {
		fix();
		scales = [.25, 1.6];
		doc[addEvent](type, fix, true);
	}
});