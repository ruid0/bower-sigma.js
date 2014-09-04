;(function(undefined) {
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
        var i,
            l,
            a,
            b,
            c,
            d,
            scale,
            margin,
            settings = self.settings.embedObjects({}),
            n = self.graph.nodes(),
            e = self.graph.edges(),
            bounds = sigma.utils.getBoundaries(
              self.graph,
              '',
              true
            ),
            minX = bounds.minX,
            minY = bounds.minY,
            maxX = bounds.maxX,
            maxY = bounds.maxY,
            sizeMax = bounds.sizeMax,
            weightMax = bounds.weightMax,
            w = self.width || 1,
            h = self.height || 1;

        scale = Math.min(
            w / Math.max(maxX - minX, 1),
            h / Math.max(maxY - minY, 1)
          );
    margin =
      (
        settings('rescaleIgnoreSize') ?
          0 :
          (settings('maxNodeSize') || sizeMax) / scale
      ) +
      (settings('sideMargin') || 0);
        maxX += margin;
        minX -= margin;
        maxY += margin;
        minY -= margin;
        scale = Math.min(
            w / Math.max(maxX - minX, 1),
            h / Math.max(maxY - minY, 1)
          );
        self.scale = scale;
        self.scaleBounds = {
            maxX:maxX,
            minX:minX,
            maxY:maxY,
            minY:minY
        };
        

    }

    function draw() {
        var k,i,
            renderers = sigma.canvas.hovers,
            embedSettings = self.settings.embedObjects({
                prefix: prefix
            }),
            ctx = self.contexts.grid,
            cam = self.camera;
        ctx.save();
        ctx.beginPath();
        for ( i = -50 ; i < 50 ; i ++ ) {
            var x = 
                (
                 (i - (self.scaleBounds.maxX + self.scaleBounds.minX)/2)* self.scale - cam.x 
                ) / cam.ratio + self.width / 2;
            ctx.moveTo(x,0);
            ctx.lineTo(x, self.height);
        }
        for ( i = -50 ; i < 50 ; i ++ ) {
            var y = 
                (
                 (i - (self.scaleBounds.maxY + self.scaleBounds.minY)/2)* self.scale - cam.y 
                ) / cam.ratio + self.height / 2;
            ctx.moveTo(0, y);
            ctx.lineTo(self.width, y);
        }
        ctx.strokeStyle = '#d5d5d5';
        ctx.stroke();
        ctx.restore();
    }
  };
}).call(this);
