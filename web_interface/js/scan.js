/* Deauther Nano — scan.js */

var nameJson = [];
var scanJson  = { aps: [], stations: [] };
var scanningType = -1;

/* ---- signal / badge helpers ---- */
function signalBars(rssi) {
  var n = rssi >= -55 ? 4 : rssi >= -70 ? 3 : rssi >= -85 ? 2 : 1;
  var cls = rssi >= -55 ? '' : rssi >= -70 ? '' : rssi >= -85 ? ' warn' : ' danger';
  var bars = '';
  for (var i = 1; i <= 4; i++) {
    bars += '<div class="sig-bar' + (i <= n ? ' active' + cls : '') + '" style="height:' + (i * 4) + 'px"></div>';
  }
  return '<div class="sig-bars">' + bars + '</div><span class="rssi-val">' + rssi + '</span>';
}

function encBadge(enc) {
  if (!enc || enc === '-') return '<span class="badge badge-open">Open</span>';
  if (enc === 'WPA3')      return '<span class="badge badge-wpa3">WPA3</span>';
  if (enc === 'WPA2')      return '<span class="badge badge-wpa2">WPA2</span>';
  return '<span class="badge badge-wpa">' + esc(enc) + '</span>';
}

/* ---- draw scan results ---- */
function drawScan() {
  var html, selected;

  // Access Points
  getE('apNum').textContent = scanJson.aps.length;
  html = '<tr>'
    + '<th class="id">#</th>'
    + '<th class="ssid">SSID</th>'
    + '<th class="name">Name</th>'
    + '<th class="ch">Ch</th>'
    + '<th class="rssi">Signal</th>'
    + '<th class="enc">Enc</th>'
    + '<th class="mac">MAC</th>'
    + '<th class="vendor">Vendor</th>'
    + '<th class="selectColumn"></th>'
    + '<th class="remove"></th>'
    + '</tr>';

  for (var i = 0; i < scanJson.aps.length; i++) {
    selected = scanJson.aps[i][scanJson.aps[i].length - 1];
    html += (selected ? '<tr class="selected">' : '<tr>')
      + '<td class="id">' + i + '</td>'
      + '<td class="ssid">' + esc(scanJson.aps[i][0]) + '</td>'
      + '<td class="name">' + (scanJson.aps[i][1].length > 0
          ? esc(scanJson.aps[i][1])
          : '<button onclick="add(0,' + i + ')" style="height:26px;font-size:11px;">' + (langJson['add'] || 'Add') + '</button>') + '</td>'
      + '<td class="ch"><span class="badge badge-open" style="min-width:24px;text-align:center;">' + esc(scanJson.aps[i][2]) + '</span></td>'
      + '<td class="rssi">' + signalBars(scanJson.aps[i][3]) + '</td>'
      + '<td class="enc">' + encBadge(scanJson.aps[i][4]) + '</td>'
      + '<td class="mac"><span class="code">' + esc(scanJson.aps[i][5]) + '</span></td>'
      + '<td class="vendor">' + esc(scanJson.aps[i][6]) + '</td>'
      + '<td class="selectColumn"><label class="checkBoxContainer"><input type="checkbox" '
          + (selected ? 'checked' : '')
          + ' onclick="selectRow(0,' + i + ',' + (selected ? 'false' : 'true') + ')"><span class="checkmark"></span></label></td>'
      + '<td class="remove"><button class="btn-danger" style="height:26px;font-size:11px;padding:0 8px;" onclick="remove(0,' + i + ')">✕</button></td>'
      + '</tr>';
  }
  getE('apTable').innerHTML = html;

  // Stations
  getE('stNum').textContent = scanJson.stations.length;
  html = '<tr>'
    + '<th class="id">#</th>'
    + '<th class="vendor">Vendor</th>'
    + '<th class="mac">MAC</th>'
    + '<th class="ch">Ch</th>'
    + '<th class="name">Name</th>'
    + '<th class="pkts">Pkts</th>'
    + '<th class="ap">AP</th>'
    + '<th class="lastseen">Last Seen</th>'
    + '<th class="selectColumn"></th>'
    + '<th class="remove"></th>'
    + '</tr>';

  for (var i = 0; i < scanJson.stations.length; i++) {
    selected = scanJson.stations[i][scanJson.stations[i].length - 1];
    var ap = '';
    if (scanJson.stations[i][5] >= 0 && scanJson.aps[scanJson.stations[i][5]])
      ap = esc(scanJson.aps[scanJson.stations[i][5]][0]);

    html += (selected ? '<tr class="selected">' : '<tr>')
      + '<td class="id">' + i + '</td>'
      + '<td class="vendor">' + esc(scanJson.stations[i][3]) + '</td>'
      + '<td class="mac"><span class="code">' + esc(scanJson.stations[i][0]) + '</span></td>'
      + '<td class="ch"><span class="badge badge-open" style="min-width:24px;text-align:center;">' + esc(scanJson.stations[i][1]) + '</span></td>'
      + '<td class="name">' + (scanJson.stations[i][2].length > 0
          ? esc(scanJson.stations[i][2])
          : '<button onclick="add(1,' + i + ')" style="height:26px;font-size:11px;">' + (langJson['add'] || 'Add') + '</button>') + '</td>'
      + '<td class="pkts">' + esc(scanJson.stations[i][4]) + '</td>'
      + '<td class="ap">' + ap + '</td>'
      + '<td class="lastseen">' + esc(scanJson.stations[i][6]) + '</td>'
      + '<td class="selectColumn"><label class="checkBoxContainer"><input type="checkbox" '
          + (selected ? 'checked' : '')
          + ' onclick="selectRow(1,' + i + ',' + (selected ? 'false' : 'true') + ')"><span class="checkmark"></span></label></td>'
      + '<td class="remove"><button class="btn-danger" style="height:26px;font-size:11px;padding:0 8px;" onclick="remove(1,' + i + ')">✕</button></td>'
      + '</tr>';
  }
  getE('stTable').innerHTML = html;
}

function drawNames() {
  var html, selected;
  getE('nNum').textContent = nameJson.length;
  html = '<tr>'
    + '<th class="id">#</th>'
    + '<th class="mac">MAC</th>'
    + '<th class="vendor">Vendor</th>'
    + '<th class="name">Name</th>'
    + '<th class="ap">AP-BSSID</th>'
    + '<th class="ch">Ch</th>'
    + '<th class="save"></th>'
    + '<th class="selectColumn"></th>'
    + '<th class="remove"></th>'
    + '</tr>';

  for (var i = 0; i < nameJson.length; i++) {
    selected = nameJson[i][nameJson[i].length - 1];
    html += (selected ? '<tr class="selected">' : '<tr>')
      + '<td class="id">' + i + '</td>'
      + '<td class="mac" contentEditable="true" id="name_' + i + '_mac">' + esc(nameJson[i][0]) + '</td>'
      + '<td class="vendor">' + esc(nameJson[i][1]) + '</td>'
      + '<td class="name" contentEditable="true" id="name_' + i + '_name">' + esc(nameJson[i][2].substring(0, 16)) + '</td>'
      + '<td class="ap"  contentEditable="true" id="name_' + i + '_apbssid">' + esc(nameJson[i][3]) + '</td>'
      + '<td class="ch"  contentEditable="true" id="name_' + i + '_ch">' + esc(nameJson[i][4]) + '</td>'
      + '<td class="save"><button class="btn-accent" style="height:26px;font-size:11px;" onclick="save(' + i + ')">' + (langJson['save'] || 'Save') + '</button></td>'
      + '<td class="selectColumn"><label class="checkBoxContainer"><input type="checkbox" '
          + (selected ? 'checked' : '')
          + ' onclick="selectRow(2,' + i + ',' + (selected ? 'false' : 'true') + ')"><span class="checkmark"></span></label></td>'
      + '<td class="remove"><button class="btn-danger" style="height:26px;font-size:11px;padding:0 8px;" onclick="remove(2,' + i + ')">✕</button></td>'
      + '</tr>';
  }
  getE('nTable').innerHTML = html;
}

/* ---- scan controls ---- */
var scanTimer, scanElapsed;

function setScanProgress(active, text) {
  var el = getE('scanProgress');
  var tx = getE('scanProgressText');
  if (!el) return;
  if (active) { el.classList.add('active'); if (tx) tx.textContent = text || 'Scanning…'; }
  else         { el.classList.remove('active'); }
}

function scan(type) {
  getE('RButton').disabled = true;
  scanningType = type;
  if (type === 0) {
    getE('scanOne').disabled  = true;
    getE('scanZero').style.visibility = 'hidden';
    scanElapsed = 2450;
  } else {
    getE('scanZero').disabled = true;
    getE('scanOne').style.visibility  = 'hidden';
    scanElapsed = parseInt(getE('scanTime').value) * 1000 + 1500;
  }
  var cmdStr = 'scan '
    + (type === 0 ? 'aps ' : 'stations -t ' + getE('scanTime').value + 's')
    + ' -ch ' + getE('ch').options[getE('ch').selectedIndex].value;
  getFile('run?cmd=' + cmdStr);
  setScanProgress(true);
  scanTimer = setTimeout(function() {
    setScanProgress(false);
    buttonFunc();
    load();
  }, scanElapsed);
}

function buttonFunc() {
  if (scanningType === 0) {
    getE('scanZero').style.visibility = 'visible';
    getE('scanOne').disabled = false;
  } else {
    getE('scanOne').style.visibility  = 'visible';
    getE('scanZero').disabled = false;
  }
  getE('RButton').disabled = false;
  scanningType = -1;
}

function load() {
  getFile('run?cmd=save scan', function() {
    getFile('scan.json', function(res) {
      scanJson = JSON.parse(res);
      showMessage('connected');
      drawScan();
    });
  });
  getFile('run?cmd=save names', function() {
    getFile('names.json', function(res) {
      nameJson = JSON.parse(res);
      drawNames();
    });
  });
}

/* ---- selection / remove ---- */
function selectRow(type, id, selected) {
  switch (type) {
    case 0:
      scanJson.aps[id][7] = selected; drawScan();
      getFile('run?cmd=' + (selected ? '' : 'de') + 'select ap ' + id); break;
    case 1:
      scanJson.stations[id][7] = selected; drawScan();
      getFile('run?cmd=' + (selected ? '' : 'de') + 'select station ' + id); break;
    case 2:
      save(id); nameJson[id][5] = selected; drawNames();
      getFile('run?cmd=' + (selected ? '' : 'de') + 'select name ' + id); break;
  }
}

function remove(type, id) {
  switch (type) {
    case 0: scanJson.aps.splice(id, 1);      drawScan();  getFile('run?cmd=remove ap '      + id); break;
    case 1: scanJson.stations.splice(id, 1); drawScan();  getFile('run?cmd=remove station ' + id); break;
    case 2: nameJson.splice(id, 1);          drawNames(); getFile('run?cmd=remove name '    + id); break;
  }
}

function save(id) {
  var mac     = getE('name_' + id + '_mac').innerHTML.replace('<br>', '');
  var name    = getE('name_' + id + '_name').innerHTML.replace('<br>', '');
  var apbssid = getE('name_' + id + '_apbssid').innerHTML.replace('<br>', '');
  var ch      = getE('name_' + id + '_ch').innerHTML.replace('<br>', '');
  var changed = mac !== nameJson[id][0] || name !== nameJson[id][2]
             || apbssid !== nameJson[id][3] || ch !== nameJson[id][4];
  if (changed) {
    nameJson[id][0] = mac; nameJson[id][2] = name;
    nameJson[id][3] = apbssid; nameJson[id][4] = ch;
    if (nameJson[id][0].length !== 17) { showMessage('ERROR: MAC invalid'); return; }
    getFile('run?cmd=replace name ' + id + ' -n "' + nameJson[id][2] + '" -m "' + nameJson[id][0]
      + '" -ch ' + nameJson[id][4] + ' -b "' + nameJson[id][3] + '" ' + (nameJson[id][5] ? '-s' : ''));
    drawNames();
  }
}

function add(type, id) {
  if (nameJson.length >= 25) { showMessage('ERROR: Device Name List is full'); return; }
  switch (type) {
    case 0:
      getFile('run?cmd=add name "' + scanJson.aps[id][0] + '" -ap ' + id);
      scanJson.aps[id][1] = scanJson.aps[id][0];
      nameJson.push([scanJson.aps[id][5], scanJson.aps[id][6], scanJson.aps[id][0], '', scanJson.aps[id][2], false]);
      drawScan(); break;
    case 1:
      getFile('run?cmd=add name "' + scanJson.stations[id][0] + '" station ' + id);
      scanJson.stations[id][2] = 'device_' + nameJson.length;
      nameJson.push([scanJson.stations[id][0], scanJson.stations[id][3], 'device_' + nameJson.length,
                     scanJson.aps[scanJson.stations[id][5]] ? scanJson.aps[scanJson.stations[id][5]][5] : '',
                     scanJson.stations[id][1], false]);
      drawScan(); break;
    case 2:
      getFile('run?cmd=add name device_' + nameJson.length + ' -m 00:00:00:00:00:00 -ch 1');
      nameJson.push(['00:00:00:00:00:00', '', 'device_' + nameJson.length, '', 1, false]);
      drawNames(); break;
  }
  drawNames();
}

function selectAll(type, sel) {
  switch (type) {
    case 0:
      getFile('run?cmd=' + (sel ? '' : 'de') + 'select aps');
      for (var i = 0; i < scanJson.aps.length; i++) scanJson.aps[i][7] = sel;
      drawScan(); break;
    case 1:
      getFile('run?cmd=' + (sel ? '' : 'de') + 'select stations');
      for (var i = 0; i < scanJson.stations.length; i++) scanJson.stations[i][7] = sel;
      drawScan(); break;
    case 2:
      getFile('run?cmd=' + (sel ? '' : 'de') + 'select names');
      for (var i = 0; i < nameJson.length; i++) nameJson[i][5] = sel;
      drawNames(); break;
  }
}
