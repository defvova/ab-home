var $quote = $("#quote"),
    mySplitText = new SplitText($quote, { type:"words" }),
    splitTextTimeline = new TimelineLite();

var width = window.innerWidth;
var height = window.innerHeight;

var tween = null;

function addStar(layer, stage) {
  var scale = Math.random();

  var star = new Konva.Star({
    x: Math.random() * stage.getWidth(),
    y: Math.random() * stage.getHeight(),
    numPoints: 5,
    innerRadius: 30,
    outerRadius: 50,
    fill: '#89b717',
    opacity: 0.8,
    draggable: true,
    scale: {
      x : scale,
      y : scale
    },
    rotationDeg: Math.random() * 180,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: {
      x : 5,
      y : 5
    },
    shadowOpacity: 0.6,
    startScale: scale
  });

  layer.add(star);
}
var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

var layer = new Konva.Layer();
var dragLayer = new Konva.Layer();

for(var n = 0; n < 100; n++) {
  addStar(layer, stage);
}

stage.add(layer);
stage.add(dragLayer);

// bind stage handlers
stage.on('mousedown', function(evt) {
  var shape = evt.target;
  shape.moveTo(dragLayer);
  stage.draw();
  // restart drag and drop in the new layer
  shape.startDrag();
});

stage.on('mouseup', function(evt) {
  var shape = evt.target;
  shape.moveTo(layer);
  stage.draw();
});

stage.on('dragstart', function(evt) {
  var shape = evt.target;
  if (tween) {
    tween.pause();
  }
  shape.setAttrs({
    shadowOffset: {
      x: 15,
      y: 15
    },
    scale: {
      x: shape.getAttr('startScale') * 1.2,
      y: shape.getAttr('startScale') * 1.2
    }
  });
});

stage.on('dragend', function(evt) {
  var shape = evt.target;

  tween = new Konva.Tween({
    node: shape,
    duration: 0.5,
    easing: Konva.Easings.ElasticEaseOut,
    scaleX: shape.getAttr('startScale'),
    scaleY: shape.getAttr('startScale'),
    shadowOffsetX: 5,
    shadowOffsetY: 5
  });

  tween.play();
});

function initTextAnimation() {
  TweenLite.set($quote, { perspective:400 });

  // Text animations
  splitTextTimeline.clear().time(0);
  mySplitText.revert();
  mySplitText.split({type:"words"})
  /*splitTextTimeline.staggerFrom(mySplitText.chars, 0.6, {scale:4, autoAlpha:0,  rotationX:-180,  transformOrigin:"100% 50%", ease:Back.easeOut}, 0.02);*/
  $(mySplitText.words).each(function(index,el){
    splitTextTimeline.from($(el), 0.6, {opacity:0, force3D:true}, index * 0.01);
    splitTextTimeline.from($(el), 0.6, {scale:index % 2 == 0  ? 0 : 2, ease:Back.easeOut}, index * 0.01);

    splitTextTimeline.staggerFrom(mySplitText.chars, 0.2, {autoAlpha:0, scale:4, force3D:true}, 0.01, 0.5)
    .staggerTo(mySplitText.words, 0.1, {color:"#9b59b6", scale:0.9}, 0.1, "words")
    .staggerTo(mySplitText.words, 0.2, {color:"#9b59b6", scale:1}, 0.1, "words+=0.1")
    .staggerTo(mySplitText.lines, 0.5, {x:100, autoAlpha:0}, 0.2)
  });
}
initTextAnimation();
