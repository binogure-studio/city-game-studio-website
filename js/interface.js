
// Get the modal
var skipEvent = false
var modal = document.getElementById('modal-gallery')
var modalImg = document.getElementById("modal-image")
var galleryNodes =  document.querySelectorAll('.gallery img')
var currentGalleyIndex = 0

for (var index = 0; index < galleryNodes.length; ++index) {
  galleryNodes[index].onclick = (function(savedIndex) {
    currentGalleryIndex = savedIndex

    modal.style.display = "block"
    modalImg.src = galleryNodes[savedIndex].src
  }).bind(document, index)
}

modal.onclick = function() {
  if (!skipEvent) {
    modal.style.display = "none";
  }

  skipEvent = false
}

modalImg.onclick = function() {
  skipEvent = true

  currentGalleryIndex = (currentGalleryIndex + 1) % galleryNodes.length
  
  modalImg.src = galleryNodes[currentGalleryIndex].src
}

function updateCGSLogo() {
  if (this.pageYOffset > 800 || window.innerWidth < 800) {
    document.getElementById('cgs-logo').style.opacity = 1.0
  } else {
    document.getElementById('cgs-logo').style.opacity = 0.0
  }
}

function init(event) {

  var vidDefer = document.getElementsByTagName('iframe')
  for (var i = 0; i < vidDefer.length; i++) {
    if (vidDefer[i].getAttribute('data-src')) {
      vidDefer[i].setAttribute('src', vidDefer[i].getAttribute('data-src'))
    }
  }

  update_scroll()
}

window.onload = init;
window.addEventListener('load', init)
window.addEventListener('resize', update_scroll)
window.addEventListener('scroll', update_scroll)

function update_scroll (event) {
  var depth, i, layer, layers, len, movement, topDistance, translate3d;
  updateCGSLogo()
  topDistance = this.pageYOffset
  layers = document.querySelectorAll("[data-type='parallax']")
  var parallax_id = document.getElementById('parallax')
  var parallax_mobile_id = document.getElementById('parallax-mobile')

  if (window.innerWidth < 800) {
    if (window.scrollY > parallax_mobile_id.clientHeight) return;

    parallax_id.style.display = 'none';
    parallax_mobile_id.style.display = 'block';
  } else {
    if (window.scrollY > parallax_id.clientHeight) return;

    parallax_mobile_id.style.display = 'none';

    if (topDistance > 1080) {
      parallax_id.style.display = 'none';
    } else {
      parallax_id.style.display = 'block';
    }

    for (i = 0, len = layers.length; i < len; i++) {
      layer = layers[i];
      depth = layer.getAttribute('data-depth')
      movement = -(topDistance * depth)
      translate3d = 'translate3d(0, ' + movement + 'px, 0)'
      layer.style['-webkit-transform'] = translate3d
      layer.style['-moz-transform'] = translate3d
      layer.style['-ms-transform'] = translate3d
      layer.style['-o-transform'] = translate3d
      layer.style.transform = translate3d
    }
  }
}

function copyToken() {
  var tokenText = document.getElementById("token");
  var range = document.createRange();
  range.selectNode(tokenText);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  
  // Show "Copied" text
  var copiedText = document.querySelector('.copied-text');
  copiedText.style.opacity = '1';
  
  // Hide "Copied" text after 1.5 seconds
  setTimeout(function() {
    copiedText.style.opacity = '0';
  }, 1500);
}

// Function to get anchor parameter value
function getAnchorParameter(name) {
  var url = window.location.href;
  var anchorIndex = url.indexOf('#');
  if (anchorIndex === -1) return null;
  var anchor = url.substring(anchorIndex + 1);
  var params = anchor.split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split('=');
    if (param[0] === name) {
      return decodeURIComponent(param[1]);
    }
  }
  return null;
}

// Get access_token parameter from URL and update token field
var accessToken = getAnchorParameter('access_token');
if (accessToken) {
  document.getElementById('token').textContent = accessToken;
}