/**
 * Google Apps Script — Backend para o convite de casamento
 *
 * COMO USAR:
 * 1. Crie uma planilha em branco no Google Sheets (ou abra uma existente)
 * 2. Extensões → Apps Script → cole este código
 * 3. Cole o ID da planilha em SPREADSHEET_ID abaixo
 *    (ou deixe vazio se o script estiver vinculado à própria planilha)
 * 4. Execute a função "inicializarPlanilha" uma vez (ou abra o site — cria sozinho)
 * 5. Implantar → Nova implantação → App da Web
 *    - Executar como: Eu
 *    - Quem tem acesso: Qualquer pessoa
 * 6. Copie a URL gerada para js/config.js
 */

const SPREADSHEET_ID = 'COLE_O_ID_DA_SUA_PLANILHA_AQUI';

const ABAS = {
  CONVIDADOS: 'Convidados',
  CONFIRMADOS: 'Confirmados',
};

const COLUNAS = {
  CONVIDADOS: ['ID', 'Sobrenome', 'Nomes'],
  CONFIRMADOS: ['ID', 'Sobrenome', 'Nome', 'Data', 'Confirmado'],
};

const EXEMPLOS_CONVIDADOS = [
  [1, 'Silva', 'João Silva, Maria Silva'],
  [2, 'Santos', 'Ana Santos, Pedro Santos, Lucas Santos'],
];

// ── Endpoints ────────────────────────────────────────────────

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';

  if (action === 'guests') {
    return jsonResponse(getGuests());
  }

  if (action === 'setup') {
    return jsonResponse(setupPlanilha());
  }

  return jsonResponse({ success: false, error: 'Ação inválida' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'confirm') {
      return jsonResponse(confirmGuests(data.confirmations));
    }

    if (data.action === 'setup') {
      return jsonResponse(setupPlanilha());
    }

    return jsonResponse({ success: false, error: 'Ação inválida' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ── Inicialização da planilha ────────────────────────────────

/**
 * Execute esta função manualmente no editor do Apps Script
 * para criar as abas e colunas automaticamente.
 */
function inicializarPlanilha() {
  const result = setupPlanilha();
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function setupPlanilha() {
  const ss = getSpreadsheet_();
  const criadas = [];

  const convidados = ensureSheet_(ss, ABAS.CONVIDADOS, COLUNAS.CONVIDADOS);
  if (convidados.created) criadas.push(ABAS.CONVIDADOS);

  if (convidados.isEmpty) {
    convidados.sheet
      .getRange(2, 1, EXEMPLOS_CONVIDADOS.length, COLUNAS.CONVIDADOS.length)
      .setValues(EXEMPLOS_CONVIDADOS);
    convidados.sheet.autoResizeColumns(1, COLUNAS.CONVIDADOS.length);
  }

  const confirmados = ensureSheet_(ss, ABAS.CONFIRMADOS, COLUNAS.CONFIRMADOS);
  if (confirmados.created) criadas.push(ABAS.CONFIRMADOS);

  return {
    success: true,
    message: criadas.length
      ? 'Abas criadas: ' + criadas.join(', ')
      : 'Planilha já estava configurada',
    abas: {
      convidados: ABAS.CONVIDADOS,
      confirmados: ABAS.CONFIRMADOS,
    },
    colunas: COLUNAS,
    criadas: criadas,
  };
}

function ensureSheet_(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  const created = !sheet;

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  const isEmpty = sheet.getLastRow() === 0;

  if (isEmpty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeaderRow_(sheet, headers.length);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
    return { sheet: sheet, created: created, isEmpty: true };
  }

  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const headerOk = headers.every(function (h, i) {
    return String(current[i] || '').trim() === h;
  });

  if (!headerOk) {
    const firstRowEmpty = current.every(function (cell) {
      return String(cell || '').trim() === '';
    });

    if (firstRowEmpty) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    formatHeaderRow_(sheet, headers.length);
    sheet.setFrozenRows(1);
  }

  return { sheet: sheet, created: created, isEmpty: false };
}

function formatHeaderRow_(sheet, numCols) {
  const headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange
    .setFontWeight('bold')
    .setBackground('#dce8f2')
    .setFontColor('#4a4a4a')
    .setHorizontalAlignment('center');

  if (sheet.getName() === ABAS.CONVIDADOS) {
    sheet.getRange(1, 3).setNote(
      'Nomes separados por vírgula, ponto-e-vírgula ou pipe (|).\n' +
      'Exemplo: João Silva, Maria Silva'
    );
  }

  if (sheet.getName() === ABAS.CONFIRMADOS) {
    sheet.getRange(1, 5).setNote('Preenchido automaticamente pelo site: Sim');
    sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1).clearContent();
  }
}

// ── Convidados ───────────────────────────────────────────────

function getGuests() {
  setupPlanilha();

  const ss = getSpreadsheet_();
  const convidadosSheet = ss.getSheetByName(ABAS.CONVIDADOS);
  const confirmadosSheet = ss.getSheetByName(ABAS.CONFIRMADOS);

  const rows = convidadosSheet.getDataRange().getValues();
  const guests = [];

  for (let i = 1; i < rows.length; i++) {
    const [id, sobrenome, nomesStr] = rows[i];
    if (!sobrenome) continue;

    const nomes = String(nomesStr)
      .split(/[,;|]/)
      .map(function (n) { return n.trim(); })
      .filter(function (n) { return n.length > 0; });

    guests.push({
      id: String(id || i),
      sobrenome: String(sobrenome).trim(),
      nomes: nomes,
    });
  }

  const confirmed = [];
  if (confirmadosSheet && confirmadosSheet.getLastRow() > 1) {
    const confRows = confirmadosSheet.getDataRange().getValues();
    for (let j = 1; j < confRows.length; j++) {
      const [confId, , nome] = confRows[j];
      if (confId && nome) {
        confirmed.push(String(confId) + '::' + String(nome).trim());
      }
    }
  }

  return { success: true, guests: guests, confirmed: confirmed };
}

function confirmGuests(confirmations) {
  if (!confirmations || confirmations.length === 0) {
    throw new Error('Nenhuma confirmação recebida');
  }

  setupPlanilha();

  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(ABAS.CONFIRMADOS);
  const now = new Date();
  const existing = sheet.getDataRange().getValues();
  const existingKeys = {};

  for (let i = 1; i < existing.length; i++) {
    existingKeys[String(existing[i][0]) + '::' + String(existing[i][2])] = true;
  }

  let added = 0;
  confirmations.forEach(function (c) {
    const key = String(c.familyId) + '::' + String(c.nome);
    if (!existingKeys[key]) {
      sheet.appendRow([c.familyId, c.sobrenome, c.nome, now, 'Sim']);
      existingKeys[key] = true;
      added++;
    }
  });

  return { success: true, added: added };
}

// ── Utilitários ──────────────────────────────────────────────

function getSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.indexOf('COLE_O') === -1) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error(
      'Planilha não encontrada. Defina SPREADSHEET_ID no Code.gs ou vincule o script à planilha.'
    );
  }

  return active;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
