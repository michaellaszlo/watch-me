WatchMe = {
  initial: {
    diameter: 300
  }
};

WatchMe.padLeft = function (x, padCharacter, length) {
  var s = '' + x,
      parts = [];
  for (var i = s.length; i < length; ++i) {
    parts.push(padCharacter);
  }
  parts.push(s);
  return parts.join('');
};

WatchMe.update = function () {
  var date = new Date(),
      hour = date.getHours() % 12,
      minute = date.getMinutes(),
      second = date.getSeconds(),
      millisecond = date.getMilliseconds();

  // Textual time check.
  var hourText = hour + '',
      minuteText = WatchMe.padLeft(minute, '0', 2),
      secondText = WatchMe.padLeft(second, '0', 2);
  WatchMe.display.timeCheck.innerHTML =
      [ hourText, minuteText, secondText ].join(':');

  // Draw background graphics.
  var context = WatchMe.context.watch,
      radius = WatchMe.radius,
      center = { x: radius, y: radius };
      thickness = 1;
  context.clearRect(0, 0, 2 * radius, 2 * radius);
  context.lineWidth = thickness;

  var hourRadius = 0.20 * radius,
      hourDistance = radius - hourRadius,
      minuteRadius = 0.16 * radius,
      minuteDistance = hourDistance - hourRadius - minuteRadius,
      secondRadius = 0.12 * radius,
      secondDistance = minuteDistance - minuteRadius - secondRadius;

  var paintArc = function (value, valueText, hertz, handDistance, handRadius,
        edgeProportion, circleColor, arcColor) {
    var angle = -Math.PI / 2 + value * 2 * Math.PI / hertz;
    thickness = edgeProportion * 2 * handRadius;
    // Background circle.
    context.lineWidth = thickness;
    context.beginPath();
    context.strokeStyle = circleColor;
    context.arc(center.x, center.y, handDistance + handRadius - thickness / 2,
        0, 2 * Math.PI);
    context.stroke();
    // Foreground arc.
    context.beginPath();
    context.strokeStyle = arcColor;
    context.arc(center.x, center.y, handDistance + handRadius - thickness / 2,
        angle - Math.PI / hertz, angle + Math.PI / hertz);
    context.stroke();
    // Value position.
    context.beginPath();
    context.lineWidth = 1;
    context.fillStyle = '#e8e8e8';
    var x = center.x + Math.cos(angle) * (handDistance - thickness / 2),
        y = center.y + Math.sin(angle) * (handDistance - thickness / 2);
    context.arc(x, y, handRadius - thickness / 2, 0, 2 * Math.PI);
    context.lineWidth = 1;
    context.fill();
    // Value text.
    context.fillStyle = '#444';
    context.font = 2 * handRadius - thickness + 'px sans-serif';
    var width = context.measureText(valueText).width;
    context.fillText(valueText, x - width / 2, y + handRadius - thickness / 2);
  };
  paintArc(hour, hourText, 12, hourDistance, hourRadius,
      0.105, '#f4f4f4', '#888');
  paintArc(minute, minuteText, 60, minuteDistance, minuteRadius,
      0.135, '#f4f4f4', '#666');
  paintArc(second, secondText, 60, secondDistance, secondRadius,
      0.165, '#f4f4f4', '#444');

  window.requestAnimationFrame(WatchMe.update);
};

WatchMe.load = function () {
  WatchMe.display = {
    timeCheck: document.getElementById('timeCheck')
  };
  WatchMe.canvas = {
    watch: document.createElement('canvas')
  };
  var canvas = WatchMe.canvas.watch,
      diameter = WatchMe.diameter = WatchMe.initial.diameter,
      radius = WatchMe.radius = diameter / 2;
  document.getElementById('watchContainer').appendChild(canvas);
  canvas.width = diameter;
  canvas.height = diameter;
  WatchMe.context = {
    watch: canvas.getContext('2d')
  };
  window.requestAnimationFrame(WatchMe.update);
};

window.onload = WatchMe.load;
