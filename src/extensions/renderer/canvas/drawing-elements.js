'use strict';

var math = require( '../../../math' );

var CRp = {};

CRp.drawElement = function( context, ele, shiftToOriginWithBb ){
  var r = this;

  if( ele.isNode() ){
    r.drawNode( context, ele, shiftToOriginWithBb );
  } else {
    r.drawEdge( context, ele, shiftToOriginWithBb );
  }
};

CRp.drawCachedElement = function( context, ele, pxRatio, extent ){
  var r = this;
  var _p = ele._private;
  var rs = _p.rscratch;
  var bb = ele.boundingBox();

  if( !extent || math.boundingBoxesIntersect( bb, extent ) ){
    var cache = r.data.eleTxrCache.getElement( ele, bb, pxRatio );

    if( cache ){
      context.drawImage( cache.texture.canvas, cache.x, 0, cache.width, cache.height, bb.x1, bb.y1, bb.w, bb.h );
    } else { // if the element is not cacheable, then draw directly
      r.drawElement( context, ele );
    }
  }
};

CRp.drawElements = function( context, eles, pxRatio, extent ){
  var r = this;

  for( var i = 0; i < eles.length; i++ ){
    var ele = eles[ i ];

    r.drawElement( context, ele );
  }
};

CRp.drawCachedElements = function( context, eles, pxRatio, extent ){
  var r = this;

  for( var i = 0; i < eles.length; i++ ){
    var ele = eles[ i ];

    r.drawCachedElement( context, ele, pxRatio, extent );
  }
};

CRp.drawLayeredElements = function( context, eles, pxRatio, extent ){
  var r = this;
  var cy = r.cy;

  var layers = r.data.lyrTxrCache.getLayers( eles, pxRatio );

  if( layers ){
    for( var i = 0; i < layers.length; i++ ){
      var layer = layers[i];
      var bb = layer.bb;

      context.drawImage( layer.canvas, bb.x1, bb.y1, bb.w, bb.h );
    }
  } else { // fall back on plain caching if no layers
    r.drawCachedElements( context, eles, pxRatio, extent );
  }
};

module.exports = CRp;
