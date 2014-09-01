;
(function () {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * The default edge renderer. It renders the edge as a simple line.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.t = function (edge, source, target, context, settings) {
    var color = edge.color,
      prefix = settings('prefix') || '',
      edgeColor = settings('edgeColor'),
      defaultNodeColor = settings('defaultNodeColor'),
      defaultEdgeColor = settings('defaultEdgeColor');

    if (!color)
      switch (edgeColor) {
        case 'source':
          color = source.color || defaultNodeColor;
          break;
        case 'target':
          color = target.color || defaultNodeColor;
          break;
        default:
          color = defaultEdgeColor;
          break;
      }

    context.strokeStyle = color;
    context.lineWidth = 1.5;
    context.beginPath();
    var size = 0;
    if (source.type === 'root') {
      size = source[prefix + 'size'];
    }
    if (source[prefix + 'y'] === target[prefix + 'y']) {
      context.moveTo(
          source[prefix + 'x'] + size,
        source[prefix + 'y']
      );
    } else {
      context.moveTo(
        source[prefix + 'x'],
          source[prefix + 'y'] - size
      );
      context.lineTo(
        source[prefix + 'x'],
        target[prefix + 'y']
      );
    }

    context.lineTo(
      target[prefix + 'x'], //- target[prefix + 'size'],
      target[prefix + 'y']
    );

    context.stroke();


    if (settings('drawEdgeLabels'))
      sigma.canvas.labels.edges.t(
        edge,
        source,
        target,
        context,
        settings
      );
  };
})();
