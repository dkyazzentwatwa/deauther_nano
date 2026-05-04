/* Deauther Nano — attack.js */

var attackJSON = [[false, 0, 0, 0], [false, 0, 0, 0], [false, 0, 0, 0], 0];
var pollInterval = null;

/* ---- polling helpers ---- */
function startPolling() {
  if (!pollInterval) {
    pollInterval = setInterval(load, 2000);
    var badge = getE('autoRefreshBadge');
    if (badge) badge.style.display = 'inline-block';
  }
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
    var badge = getE('autoRefreshBadge');
    if (badge) badge.style.display = 'none';
  }
}

/* ---- rendering ---- */
function draw() {
  var anyRunning = attackJSON[0][0] || attackJSON[1][0] || attackJSON[2][0];

  /* Stop-all button prominence */
  var stopBtn = getE('stopAllBtn');
  if (stopBtn) stopBtn.style.opacity = anyRunning ? '1' : '0.6';

  /* Per-attack rows */
  updateRow('deauth', 0);
  updateRow('beacon', 1);
  updateRow('probe',  2);

  getE('allpkts').textContent = anyRunning ? attackJSON[3] : '—';

  /* Auto-poll management */
  if (anyRunning) startPolling();
  else stopPolling();
}

function updateRow(name, idx) {
  var running   = attackJSON[idx][0];
  var btn       = getE(name);
  var badge     = getE('badge' + name.charAt(0).toUpperCase() + name.slice(1));
  var row       = getE('row'   + name.charAt(0).toUpperCase() + name.slice(1));

  if (btn)   btn.textContent   = running ? (langJson['stop']  || 'STOP')  : (langJson['start'] || 'START');
  if (badge) badge.style.display = running ? 'inline-block' : 'none';
  if (row)   row.classList.toggle('running', running);

  getE(name + 'Targets').textContent = attackJSON[idx][1] || '—';
  getE(name + 'Pkts').textContent    = running
    ? attackJSON[idx][2] + ' / ' + attackJSON[idx][3]
    : '—';
}

/* ---- actions ---- */
function stopAll() {
  getFile('run?cmd=stop attack', function() { setTimeout(load, 800); });
}

function start(mode) {
  attackJSON[mode][0] = !attackJSON[mode][0];
  var cmd = 'attack'
    + (attackJSON[0][0] ? ' -d' : '')
    + (attackJSON[1][0] ? ' -b' : '')
    + (attackJSON[2][0] ? ' -p' : '');
  getFile('run?cmd=' + cmd, function() {
    setTimeout(load, 1500);
    draw();
  });
}

function load() {
  getFile('attack.json', function(res) {
    attackJSON = JSON.parse(res);
    showMessage('connected');
    draw();
  });
}
