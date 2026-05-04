/* Deauther Nano — site.js */

var langJson = {};

function getE(id) { return document.getElementById(id); }

function esc(str) {
  if (str) {
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;');
  }
  return '';
}

function convertLineBreaks(str) {
  if (str) return str.toString().replace(/(?:\r\n|\r|\n)/g, '<br>');
  return '';
}

function showMessage(msg) {
  var el = getE('status');
  if (!el) return;
  if (msg.startsWith('ERROR')) {
    el.className = 'status-error';
    el.innerHTML = '<span class="status-dot dot-error"></span>Disconnected';
  } else if (msg.startsWith('LOADING')) {
    el.className = 'status-loading';
    el.innerHTML = '<span class="status-dot dot-loading"></span>Loading…';
  } else {
    el.className = 'status-ok';
    el.innerHTML = '<span class="status-dot dot-ok"></span>Connected';
  }
}

function getFile(adr, callback, timeout, method, onTimeout, onError) {
  if (adr === undefined) return;
  if (callback  === undefined) callback  = function() {};
  if (timeout   === undefined) timeout   = 8000;
  if (method    === undefined) method    = 'GET';
  if (onTimeout === undefined) onTimeout = function() { showMessage('ERROR: timeout ' + adr); };
  if (onError   === undefined) onError   = function() { showMessage('ERROR: ' + adr); };

  var req = new XMLHttpRequest();
  req.open(method, encodeURI(adr), true);
  req.timeout = timeout;
  req.ontimeout = onTimeout;
  req.onerror   = onError;
  req.overrideMimeType('application/json');
  req.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      showMessage('CONNECTED');
      callback(this.responseText);
    }
  };
  showMessage('LOADING');
  req.send();
}

function lang(key) { return convertLineBreaks(esc(langJson[key])); }

function parseLang(fileStr) {
  langJson = JSON.parse(fileStr);
  if (langJson['lang'] !== 'en') {
    document.querySelectorAll('[data-translate]').forEach(function(el) {
      el.innerHTML = lang(el.getAttribute('data-translate'));
    });
  }
  document.querySelector('html').setAttribute('lang', langJson['lang']);
  if (typeof load !== 'undefined') load();
}

function loadLang() {
  getFile('lang/default.lang', parseLang, 2000, 'GET',
    function() { getFile('lang/en.lang', parseLang); },
    function() { getFile('lang/en.lang', parseLang); }
  );
}

/* Load device status chip */
function loadDeviceStatus() {
  var el = getE('deviceStatus');
  var tx = getE('dsText');
  if (!el || !tx) return;
  getFile('status.json', function(res) {
    try {
      var s = JSON.parse(res);
      tx.textContent = 'CH:' + s.channel + (s.attack ? ' ⚡ATK' : s.scan ? ' 🔍SCN' : '');
      el.className = 'online';
    } catch(e) {}
  }, 4000, 'GET', function(){}, function(){});
}

window.addEventListener('load', function() {
  showMessage('CONNECTED');
  loadDeviceStatus();
});
