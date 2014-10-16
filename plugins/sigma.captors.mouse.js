;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.captors');

  /**
   * The user inputs default captor. It deals with mouse events, keyboards
   * events and touch events.
   *
   * @param  {DOMElement}   target   The DOM element where the listeners will be
   *                                 bound.
   * @param  {camera}       camera   The camera related to the target.
   * @param  {configurable} settings The settings function.
   * @return {sigma.captor}          The fresh new captor instance.
   */
  sigma.captors.mouse = function(target, camera, settings) {
    var _self = this,
      _target = target,
      _camera = camera,
      _settings = settings,

    // CAMERA MANAGEMENT:
    // ******************
    // The camera position when the user starts dragging:
      _startCameraX,
      _startCameraY,
      _startCameraAngle,

    // The latest stage position:
      _lastCameraX,
      _lastCameraY,
      _lastCameraAngle,
      _lastCameraRatio,

    // MOUSE MANAGEMENT:
    // *****************
    // The mouse position when the user starts dragging:
      _startMouseX,
      _startMouseY,

      _isMouseDown,
      _isMoving,
      _movingTimeoutId;

    _self.rejectMouseMove = false;

    sigma.classes.dispatcher.extend(this);

    sigma.utils.doubleClick(_target, 'click', _doubleClickHandler);
    document.getElementsByClassName('sigma-mouse')[0].addEventListener('DOMMouseScroll', _wheelHandler, false);
    document.getElementsByClassName('sigma-mouse')[0].addEventListener('mousewheel', _wheelHandler, false);
    _target.addEventListener('mousemove', _moveHandler, false);
    _target.addEventListener('mousedown', _downHandler, false);
    _target.addEventListener('click', _clickHandler, false);
    _target.addEventListener('mouseout', _outHandler, false);
    document.addEventListener('mouseup', _upHandler, false);




    /**
     * This method unbinds every handlers that makes the captor work.
     */
    this.kill = function() {
      sigma.utils.unbindDoubleClick(_target, 'click');
      document.getElementsByClassName('sigma-mouse')[0].removeEventListener('DOMMouseScroll', _wheelHandler);
      document.getElementsByClassName('sigma-mouse')[0].removeEventListener('mousewheel', _wheelHandler);
      _target.removeEventListener('click', _clickHandler);
    };





    function _clickHandler(e) {
      if (_settings('mouseEnabled'))
        _self.dispatchEvent('click', {
          x: sigma.utils.getX(e) - e.target.width / 2,
          y: sigma.utils.getY(e) - e.target.height / 2
        });

      if (e.preventDefault)
        e.preventDefault();
      else
        e.returnValue = false;

      e.stopPropagation();
      return false;
    }

    /**
     * The handler listening to the double click custom event. It will
     * basically zoom into the graph.
     *
     * @param {event} e A mouse event.
     */
    function _doubleClickHandler(e) {
      var pos,
        count,
        ratio,
        newRatio;

      if (_settings('mouseEnabled')) {
        ratio = 1 / _settings('doubleClickZoomingRatio');

        // Deal with min / max:
        newRatio = Math.max(
          _settings('zoomMin'),
          Math.min(
            _settings('zoomMax'),
              _camera.ratio * ratio
          )
        );
        ratio = newRatio / _camera.ratio;

        _self.dispatchEvent('doubleclick', {
          x: _startMouseX - e.target.width / 2,
          y: _startMouseY - e.target.height / 2
        });

        // Check that the new ratio is different from the initial one:
        if (_settings('doubleClickEnabled') && (newRatio !== _camera.ratio)) {
          count = sigma.misc.animation.killAll(_camera);

          pos = _camera.cameraPosition(
              sigma.utils.getX(e) - e.target.width / 2,
              sigma.utils.getY(e) - e.target.height / 2,
            true
          );

          sigma.misc.animation.camera(
            _camera,
            {
              x: pos.x * (1 - ratio) + _camera.x,
              y: pos.y * (1 - ratio) + _camera.y,
              ratio: newRatio
            },
            {
              easing: count ? 'quadraticOut' : 'quadraticInOut',
              duration: _settings('doubleClickZoomDuration')
            }
          );
        }

        if (e.preventDefault)
          e.preventDefault();
        else
          e.returnValue = false;

        e.stopPropagation();
        return false;
      }
    }

    /**
     * The handler listening to the 'wheel' mouse event. It will basically zoom
     * in or not into the graph.
     *
     * @param {event} e A mouse event.
     */
    function _wheelHandler(e) {
      var pos,
        count,
        ratio,
        newRatio;

      if (_settings('mouseEnabled')) {
        ratio = sigma.utils.getDelta(e) > 0 ?
          1 / _settings('zoomingRatio') :
          _settings('zoomingRatio');

        // Deal with min / max:
        newRatio = Math.max(
          _settings('zoomMin'),
          Math.min(
            _settings('zoomMax'),
              _camera.ratio * ratio
          )
        );
        ratio = newRatio / _camera.ratio;

        // Check that the new ratio is different from the initial one:
        if (newRatio !== _camera.ratio) {
          count = sigma.misc.animation.killAll(_camera);

          pos = _camera.cameraPosition(
              sigma.utils.getX(e) - e.target.width / 2,
              sigma.utils.getY(e) - e.target.height / 2,
            true
          );

          var x = pos.x * (1 - ratio) + _camera.x,
            y = pos.y * (1 - ratio) + _camera.y;
          var bound = sigma.utils.getBoundaries(_camera.graph, _camera.readPrefix);
          if (bound.minX > x) x = bound.minX;
          if (bound.maxX < x) x = bound.maxX;
          if (bound.minY > y) y = bound.minY;
          if (bound.maxY < y) y = bound.maxY;
          sigma.misc.animation.camera(
            _camera,
            {
              x: x,
              y: y,
              ratio: newRatio
            },
            {
              easing: count ? 'quadraticOut' : 'quadraticInOut',
              duration: _settings('mouseZoomDuration')
            }
          );
          sigma.zoomObj = {
            x: Math.ceil(x),
            y: Math.ceil(y),
            ratio: Math.ceil(newRatio)
          };

        }

        if (e.preventDefault)
          e.preventDefault();
        else
          e.returnValue = false;

        e.stopPropagation();
        return false;
      }
    }
  };
}).call(this);
