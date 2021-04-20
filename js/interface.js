
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

var newsletter_email = document.getElementById('newsletter-email')
var newsletter = document.getElementById('newsletter-submit')

newsletter_email.oninput = emailAddressHandler
newsletter.onclick = subscrireToNewsletter

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
    parallax_id.style.display = 'none';
    parallax_mobile_id.style.display = 'block';
  } else {
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

function validateEmail(email) {
  return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(email)
}

function emailAddressHandler() {
  var emailInput = document.getElementById('newsletter-email')
  var sendButton = document.getElementById('newsletter-submit')

  sendButton.disabled = !validateEmail(emailInput.value)
}

function ajaxHandler() {
  // There is no need to check the status code since it _should_ always work
  if (this.readyState == 4) {
    document.getElementById('subscribed').style.display = 'block'
  }
}

function subscrireToNewsletter() {
  emailAddressHandler()

  var emailInput = document.getElementById('newsletter-email')

  // If the email address is valid
  if (validateEmail(emailInput.value)) {
    var xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = ajaxHandler
    xhttp.open('POST', 'https://www.freelists.org/cgi-bin/subscription.cgi', true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send('action=subscribe&list=binogure-studio&email=' + encodeURI(emailInput.value))
  }
}
