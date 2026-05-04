/* Deauther Nano — settings.js */

var settingsJson = {};

/* Key → category mapping for grouped display */
var categories = {
  'version':         'Device',
  'ssid':            'Access Point',
  'password':        'Access Point',
  'channel':         'Access Point',
  'hidden':          'Access Point',
  'macSt':           'MAC / WiFi',
  'macAP':           'MAC / WiFi',
  'maxch':           'MAC / WiFi',
  'captivePortal':   'Web Interface',
  'lang':            'Web Interface',
  'web':             'Web Interface',
  'autosave':        'Autosave',
  'autosavetime':    'Autosave',
  'display':         'Display',
  'displayTimeout':  'Display',
  'serial':          'CLI / Serial',
  'serialEcho':      'CLI / Serial',
  'led':             'LED',
  'chtime':          'Sniffer',
  'minDeauths':      'Sniffer',
  'attacktimeout':   'Attack',
  'deauthspertarget':'Attack',
  'deauthReason':    'Attack',
  'beaconchannel':   'Attack',
  'beaconInterval':  'Attack',
  'randomTX':        'Attack',
  'probesPerSSID':   'Attack'
};

function load() {
  getFile('settings.json', function(res) {
    settingsJson = JSON.parse(res);
    showMessage('connected');
    draw();
  });
}

function draw() {
  var seenCat = {};
  var html = '';

  for (var key in settingsJson) {
    if (!settingsJson.hasOwnProperty(key)) continue;
    var k   = esc(key);
    var cat = categories[key] || 'Other';

    if (!seenCat[cat]) {
      seenCat[cat] = true;
      html += '<h2>' + cat + '</h2>';
    }

    html += '<div class="row">'
      + '<div class="col-6">'
      + '<label class="settingName ' + (typeof settingsJson[key] === 'boolean' ? 'labelFix' : '') + '" for="' + k + '">' + k + '</label>'
      + '<p class="setting-desc">' + lang('setting_' + k) + '</p>'
      + '</div>'
      + '<div class="col-6">';

    if (typeof settingsJson[key] === 'boolean') {
      html += '<label class="checkBoxContainer"><input type="checkbox" name="' + k + '" '
        + (settingsJson[key] ? 'checked' : '')
        + ' onchange=\'save("' + k + '",!settingsJson["' + k + '"])\'><span class="checkmark"></span></label>';
    } else if (typeof settingsJson[key] === 'number') {
      html += '<input type="number" name="' + k + '" value="' + settingsJson[key]
        + '" onchange=\'save("' + k + '",parseInt(this.value))\'>';
    } else {
      var ro = (key === 'version') ? 'readonly style="opacity:.5;"' : '';
      html += '<input type="text" name="' + k + '" value="' + esc(settingsJson[key].toString()) + '" '
        + ro + ' onchange=\'save("' + k + '",this.value)\'>';
    }

    html += '</div></div><hr>';
  }

  getE('settingsList').innerHTML = html;
}

function save(key, value) {
  if (key) {
    settingsJson[key] = value;
    getFile('run?cmd=set ' + key + ' "' + value + '"');
  } else {
    getFile('run?cmd=save settings', function() { load(); });
  }
}
