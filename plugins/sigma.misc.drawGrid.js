;
(function (undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc');

  sigma.misc.drawGrid = function (prefix) {
    var self = this;
    this.bind('render', function (event) {
      calcScale();
      draw();
    });

    function calcScale() {
      var scale,
        margin,
        settings = self.settings.embedObjects({}),
        bounds = sigma.utils.getBoundaries(
          self.graph,
          '',
          true
        ),
        minX = bounds.minX,
        maxX = bounds.maxX,
        sizeMax = bounds.sizeMax,
        w = self.width || 1;

      scale = Math.min(w / Math.max(maxX - minX, 1));
      margin =
        (
          settings('rescaleIgnoreSize') ?
            0 :
            (settings('maxNodeSize') || sizeMax) / scale
          ) +
        (settings('sideMargin') || 0);


      maxX += margin;
      minX -= margin;
      scale = Math.min(w / Math.max(maxX - minX, 1));
      self.scale = scale;
      self.scaleBounds = {
        maxX: maxX,
        minX: minX
      };
    }

    function draw() {
      var i,
        ctx = self.contexts.grid,
        cam = self.camera;
      ctx.save();
      ctx.beginPath();
      for (i = -50; i < 50; i++) {
        var x =
          (
            (i - (self.scaleBounds.maxX + self.scaleBounds.minX) / 2) * self.scale - cam.x
            ) / cam.ratio + self.width / 2;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, self.height);
      }

      ctx.strokeStyle = '#d5d5d5';
      ctx.stroke();
      ctx.restore();
    }
  };
}).call(this);
