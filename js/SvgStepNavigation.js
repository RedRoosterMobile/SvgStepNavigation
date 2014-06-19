/**
 * @requires:  raphael.js
 *
 *
 */
var fabricateSvgStepNavigation = function () {

	var ANIMATION_TIME=150;
	var EASING='elastic';

    // statuses
    var STATUS_DONE='done';
    var STATUS_ACTIVE='active';
    var STATUS_UPCOMING='upcoming';
    var STATUS_ERROR='error';

	var _raphaelPaper;
	var _paperHeight;
	var _paperWidth;
	var _currentStep = 0;
	var _currentSubNavStep = 0;
	var _totalCurrentSubnavSteps;
	var _radius=10;
	var _stepsArray;
    var _stepsArrayBackup;
	var _viewObjectsArray=[];
	var _totalSteps;
	var _lineObj;
	var _statusColorHash = {
		active: '#39b3d7',
		error: '#d9534f',
		done: '#47a447',
		upcoming: 'grey'
	}

	// private view helpers
	function initializeView() {
		addLineToView();
		addStepsToView();
		
	}
	function addStepsToView() {
		var stepWidth = (_paperWidth/_totalSteps)-(_paperWidth/_totalSteps)/_totalSteps;
		for (var i=0;i<_totalSteps;i++) {
			// Creates circle at x = 50, y = 40, with radius 10
			var circle = _raphaelPaper.circle(stepWidth*(i+1), _paperHeight/2, _radius);

            var t = _raphaelPaper.text(stepWidth*(i+1), _paperHeight/2+25, _stepsArray[i]['label'],'baseline').attr({
                //fill:"#4478b8",
                "font-family":"'h_bd'",
                //'letter-spacing':1,
                'text-anchor': 'middle',
                'font-size':10
            });

			circle.attr("fill", _statusColorHash[_stepsArray[i]['status']]).attr("stroke", "white").attr('stroke-width','2px');
            circle.node.id = "circle"+i;


			_viewObjectsArray.push(circle);


			circle.click( function(event) {
                    console.log(event);
                    var currentId = parseInt(this.node.id.replace('circle',''));
                    console.log(currentId);
                    if (_stepsArray[currentId]['callback']) {
                        _stepsArray[currentId]['callback']();
                    }
                    SvgStepNavigation.to(currentId);
                }
            );

		}
	}
	function addLineToView() {
		// startx starty endx endy
		var x = (_paperWidth/_totalSteps)-(_paperWidth/_totalSteps)/_totalSteps;
		var y = _paperHeight/2;
		var endX = x * _totalSteps;

		// @see: http://raphaeljs.com/reference.html#Paper.path
		_lineObj = _raphaelPaper.path("M"+x+" "+y+"L"+endX+" "+y).attr("stroke", "white");
	}
	function popCircle(circleObj) {
		
		circleObj.animate({r:_radius*1.20},ANIMATION_TIME,EASING);
	}
	function pumpCircle(circleObj) {
		circleObj.animate({r:_radius},ANIMATION_TIME/2,EASING,function(){
            this.animate( { r:_radius*1.2 } , ANIMATION_TIME/2,EASING );
        });
	}
	function normalizeCircle(circleObj) {
		circleObj.animate({r:_radius},ANIMATION_TIME,EASING);
	}


	//public methods:
    return {
		init: function(raphaelPaper,stepsArray,radius) {
            console.log(stepsArray);

			_raphaelPaper = raphaelPaper;
            //var _font = _raphaelPaper.registerFont();
			_paperWidth = raphaelPaper.width;
			_paperHeight = raphaelPaper.height;
			_stepsArray = stepsArray;
            // clone array - deep-copy
            _stepsArrayBackup = $.map(stepsArray, function (obj) {
                return $.extend(true, {}, obj);
            });
			_totalSteps = stepsArray.length;
			if (radius)
				_radius=radius;
			initializeView();
		},
		next: function(error) {
			// TODO: add subnav logic
			if (!!!error) {
				if (_currentStep<_totalSteps) {
					SvgStepNavigation.setStatus(_currentStep,STATUS_DONE);

					_currentStep++;
					if (_currentStep<_totalSteps)
						SvgStepNavigation.setStatus(_currentStep,STATUS_ACTIVE);
				}
			} else {
                if (_currentStep<_totalSteps)
				    SvgStepNavigation.setStatus(_currentStep,STATUS_ERROR);
			}
		},
		prev: function() {
			// grey or green out depending on current validation??
		},
        /**
         * jumps to a step if it is done already
         * sets the previous current step to UPCOMING?
         *
         * might make sense, since changing previous
         * stuff might affect later steps
         *
         */
		to: function(stepNo) {
            if ( _stepsArray[stepNo] &&
                _stepsArray[stepNo]['status'] &&
                (_stepsArray[stepNo]['status']==STATUS_DONE || _stepsArray[stepNo]['status']==STATUS_ERROR)
            ){
                // do stuff
                this.setStatus(_currentStep,STATUS_UPCOMING);
                this.setStatus(stepNo,STATUS_ACTIVE);
                _currentStep = stepNo;
            } else {
                // don't do stuff
            }
		},
		// active, error, done, upcoming
		setStatus: function (stepNo,newStatus) {
			_stepsArray[stepNo]['status'] = newStatus;
			var vsa=_viewObjectsArray[stepNo];
			// animations ? 
			if (vsa) {
				if (newStatus==STATUS_ERROR) {
					vsa.attr('fill', _statusColorHash[STATUS_ERROR]);
					pumpCircle(vsa);
				} else if (newStatus==STATUS_DONE) {
					vsa.attr('fill', _statusColorHash[STATUS_DONE]);
					normalizeCircle(vsa);
				} else if (newStatus==STATUS_ACTIVE) {
					vsa.attr('fill', _statusColorHash[STATUS_ACTIVE]);
					popCircle(vsa);
				}
				else if (newStatus==STATUS_UPCOMING) {
					vsa.attr('fill', _statusColorHash[STATUS_UPCOMING]);
                    normalizeCircle(vsa);
				}
			}
		},
        // TODO: add subnav
		addSubnav: function (toStep) {
			console.log('adding subnavigation to step: '+ toStep);
			// move surrounding to side
			// spread subnav dots
			// add callbacks
			// next prev logic?? stuff it into ::next()

			//create new 
			funcSvgStepNavigation();

		},
        reset: function() {
            // all to upcoming
            for (var i=1;i<_totalSteps;i++) {
                this.setStatus(i,STATUS_UPCOMING);
            }
            // first to active
            this.setStatus(0,STATUS_ACTIVE);
            _currentStep = 0;
        },
        getOriginalSteps: function() {
            return _stepsArrayBackup;
        }
    };
};

var SvgStepNavigation=fabricateSvgStepNavigation();
