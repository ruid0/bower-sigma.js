;
(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.hovers');

  /**
   * This hover renderer will basically display the label with a background.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.hovers.def = function(node, context, settings) {
    var x,
      y,
      w,
      h,
      e,
      fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
      prefix = settings('prefix') || '',
      size = node[prefix + 'size'],
      fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
      settings('labelSizeRatio') * size;

    // Label background:
    /*context.font = (fontStyle ? fontStyle + ' ' : '') +
     fontSize + 'px ' + (settings('hoverFont') || settings('font'));

     context.beginPath();
     context.fillStyle = settings('labelHoverBGColor') === 'node' ?
     (node.color || settings('defaultNodeColor')) :
     settings('defaultHoverLabelBGColor');

     if (settings('labelHoverShadow')) {
     context.shadowOffsetX = 0;
     context.shadowOffsetY = 0;
     context.shadowBlur = 8;
     context.shadowColor = settings('labelHoverShadowColor');
     }

     if (typeof node.label === 'string') {
     x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
     y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
     w = Math.round(
     context.measureText(node.label).width + fontSize / 2 + size + 7
     );
     h = Math.round(fontSize + 4);
     e = Math.round(fontSize / 2 + 2);

     context.moveTo(x, y + e);
     context.arcTo(x, y, x + e, y, e);
     context.lineTo(x + w, y);
     context.lineTo(x + w, y + h);
     context.lineTo(x + e, y + h);
     context.arcTo(x, y + h, x, y + h - e, e);
     context.lineTo(x, y + e);

     context.closePath();
     context.fill();

     context.shadowOffsetX = 0;
     context.shadowOffsetY = 0;
     context.shadowBlur = 0;
     }*/

    // Node border:
//    if (settings('borderSize') > 0) {
//      context.beginPath();
//      context.fillStyle = settings('nodeBorderColor') === 'node' ?
//        (node.color || settings('defaultNodeColor')) :
//        settings('defaultNodeBorderColor');
//      context.arc(
//        node[prefix + 'x'],
//        node[prefix + 'y'],
//        size + settings('borderSize'),
//        0,
//        Math.PI * 2,
//        true
//      );
//      context.closePath();
//      context.fill();
//    }
    if (node['size'] === 0) {
      return false;
    }

    function drawHover(alpha) {
      context.beginPath();
      //context.strokeStyle = "#007c9e"; //node.color;//'rgb(' + node.color + ')';
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 1;
//        context.shadowColor = 'rgba(0,172,219,1)';
      context.fillStyle = "rgba(103, 111, 125, " + alpha + ")";//node.color;

      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );

      context.closePath();
      //context.stroke();
      context.fill();

      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 0;
      // Node:
      var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
      nodeRenderer(node, context, settings);

      //  Display the label:
      if (typeof node.label === 'string') {
        context.fillStyle = (settings('labelHoverColor') === 'node') ?
          (node.color || settings('defaultNodeColor')) :
          settings('defaultLabelHoverColor');

        context.fillText(
          node.label,
          Math.round(node[prefix + 'x'] + size + 3),
          Math.round(node[prefix + 'y'] + fontSize / 3)
        );
      }
    }

    clearInterval(node.hoverInterval);
    clearInterval(node.hoverInterval);

    /*node.hover = node.hover || {
     alpha: 0,
     sign: 1,
     diff: 0.02
     };*/
    //node.hover.alpha = 0;


    //node.hoverInterval = setInterval(function () {
    node.hoverAnim = function() {
      node.hover.alpha = node.hover.alpha + node.hover.sign * node.hover.diff;
      if (node.hover.sign > 0 && node.hover.alpha >= 0.5) {
        node.hover.alpha = 0.49;
        window.cancelAnimationFrame(node.hover.animationFrame);
        node.hover.animationFrame = 0;
      }
      if ((node.hover.sign < 0 && node.hover.alpha <= 0)) {
        node.hover.alpha = 0;
        window.cancelAnimationFrame(node.hover.animationFrame);
        node.hover.animationFrame = 0.1;
      }
      if (node.hover.alpha > 0 && node.hover.alpha < 0.5) {
        context.canvas.width = context.canvas.width;
        node.hover.animationFrame = window.webkitRequestAnimationFrame(node.hoverAnim);
        drawHover(node.hover.alpha);
      }
    };

    node.hoverAnim();
  };
}).call(this);
