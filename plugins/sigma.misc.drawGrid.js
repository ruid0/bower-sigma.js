;
(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc');

  sigma.misc.drawGrid = function(prefix) {
    var self = this;
    this.bind('render', function(event) {
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

    function drawDottedLine(x1, y1, x2, y2, dotCount, dotColor, ctx) {
      var dx = x2 - x1,
        dy = y2 - y1,
        spaceX = dx / (dotCount - 1),
        spaceY = dy / (dotCount - 1),
        newX = x1,
        newY = y1,
        i = 0;

      for (; i < dotCount; i++) {
        drawDot(newX, newY, dotColor, ctx);
        newX += spaceX;
        newY += spaceY;
      }
    }

    function drawDot(x, y, dotColor, ctx) {
      ctx.beginPath();
      ctx.moveTo(x + 5, y);
      ctx.lineTo(x + 5, y + 20);
      ctx.strokeStyle = dotColor;
      ctx.stroke();
      ctx.restore();
    }

    function draw() {
      var i,
        ctx = self.contexts.grid,
        cam = self.camera;
      ctx.save();
      ctx.beginPath();
      for (i = -50; i < 50; i++) {
        var x = ( (i - (self.scaleBounds.maxX + self.scaleBounds.minX) / 4) * self.scale - cam.x ) /
          cam.ratio + self.width / 2;

        drawDottedLine(x, 0, x, self.height, 10, 'rgba(255, 255, 255, 0.3)', ctx);
      }
    }
  };
}).call(this);
