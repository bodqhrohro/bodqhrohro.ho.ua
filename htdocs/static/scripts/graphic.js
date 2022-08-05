window.onload = function() {
 var photothumb1 = document.getElementById('photothumb1');
 if (photothumb1) {
  photothumb1.onmouseover = function(e) {
   var e = e || window.event;
   thumbpopup('static/images/photo1.jpg', e.x, e.y);
  };
  photothumb1.onmouseout = delthumbpopup;
 }

 var body1 = document.getElementById('body1');
 if (body1) {
  var cursor = document.createElement('img');
  cursor.setAttribute('src', 'static/images/cursor1.gif');
  cursor.setAttribute('id', 'cursor1');
  body1.appendChild(cursor);

  window.document.body.onkeypress = function(e) {
    var e = e || window.event;
    emulconsole1(e.keyCode);
  };
 }

 var resizeHandler = function() {
  var width = parseInt(document.documentElement.clientWidth);
  var height = parseInt(document.documentElement.clientHeight);
  var marginX = ((width - (((width - 20) / 10) |0) * 10) / 2) + 'px';
  var marginY = ((height - (((height - 36) / 18) |0) * 18) / 2) + 'px';
  document.body.style.marginLeft = marginX;
  document.body.style.marginRight = marginX;
  document.body.style.marginTop = marginY;
  document.body.style.marginBottom = marginY;

  var title = document.getElementById('title');
  if (title) {
   var rect = title.getBoundingClientRect();
   if (rect) {
    title.style.position = 'relative';
    title.style.left = (-(rect.left - ((rect.left / 10) |0) * 10)) + 'px';
   }
  }
 };
 window.onresize = resizeHandler;
 resizeHandler();
};

var timerID;
function thumbpopup(path1, left, top) {
 var i = 0;
 var photo1;
 var photosizeinc = function() {
  i += 4;
  photo1.style.width = i + 'px';
  photo1.style.height = i + 'px';
  if (i >= 128) {
   clearInterval(timerID);
   i -= 4;
  }
 };
 var thumb = document.createElement('div');
 thumb.id = 'thumbpopup';
 thumb.style.position = 'absolute';
 thumb.style.top = top + 18 + 'px';
 thumb.style.left = left + 'px';
 thumb.style.backgroundcolor = '#ffffff';
 thumb.innerHTML = '<img id="photo1" src="'+path1+'" alt="thumb" onmouseout="delthumbpopup()" style="width: 0px; height: 0px;">';
 document.body.appendChild(thumb);
 photo1 = document.getElementById('photo1');
 timerID = setInterval(photosizeinc, 1);
};
function delthumbpopup(){
 thumb = document.getElementById('thumbpopup');
 if (thumb) {
  document.body.removeChild(thumb);
 }
};

var lttrcount1 = 0;
function emulconsole1(code1) {
 var lttr = document.createElement('span');
 lttr.setAttribute('id', 'lttr'+lttrcount1);
 lttr.innerHTML = String.fromCharCode(code1);
 if (code1==13) {
  lttr.innerHTML='<br>';
 };
 cur1 = document.getElementById('cursor1');
 var body1 = document.getElementById('body1');
 body1.insertBefore(lttr, cur1);
 lttrcount1++;
};

function safelink(link) {
 var i, tmp1;
 var link2='';
 for (i=0; i<=link.length-1; i++) {
  link2 += String.fromCharCode(link.charCodeAt(i) + 1);
 };
 window.location = link2;
};
function openiframe(path, width, height) {
 var borderedWidth = width + 20;
 var borderedHeight = height + 36;
 var container = document.createElement('div');
 container.setAttribute('id','playerlayer1');
 container.style.width = borderedWidth+'px';
 container.style.height = borderedHeight+'px';
 container.style.top = ((document.body.clientHeight - borderedHeight) / 2 + parseInt(document.body.style.marginTop)) + 'px';
 container.style.left = ((document.body.clientWidth - borderedWidth) / 2 + parseInt(document.body.style.marginLeft)) + 'px';
 var close = document.createElement('span');
 close.className = 'close-button';
 close.innerHTML = 'X';
 container.appendChild(close);
 var iframe = document.createElement('iframe');
 iframe.setAttribute('src', path);
 iframe.setAttribute('allowtransparency', '');
 iframe.setAttribute('frameborder', 0);
 iframe.setAttribute('hspace', 0);
 iframe.setAttribute('vspace', 0);
 iframe.setAttribute('height', height + 'px');
 iframe.setAttribute('width', width + 'px');
 container.appendChild(iframe);
 document.body.appendChild(container);
 var shadow = document.createElement('div');
 shadow.setAttribute('id', 'upperlayer1');
 shadow.style.width = document.body.clientWidth + 'px';
 shadow.style.height = document.body.clientHeight + 'px';
 document.body.appendChild(shadow);

 close.onclick = closeplayer;
}
function closeplayer(){
 document.body.removeChild(document.getElementById('upperlayer1'));
 document.body.removeChild(document.getElementById('playerlayer1'));
}
