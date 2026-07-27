'use strict';

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const DIAS_CURTO = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

let materias   = carregarStorage('studyhub_materias') ?? [];
let ordemAtual = 'default';
let toastTimer = null;

// Paleta de cores para as matérias
const CORES = [
  { bg: 'rgba(245,166,35,.18)',  border: '#f5a623', text: '#f5c56a' },
  { bg: 'rgba(76,175,125,.18)', border: '#4caf7d', text: '#7dd4a8' },
  { bg: 'rgba(90,120,220,.18)', border: '#5a78dc', text: '#8fa4e8' },
  { bg: 'rgba(180,80,200,.18)', border: '#b450c8', text: '#d080e8' },
  { bg: 'rgba(224,92,92,.18)',  border: '#e05c5c', text: '#e89090' },
  { bg: 'rgba(32,196,188,.18)', border: '#20c4bc', text: '#5dd8d2' },
  { bg: 'rgba(240,130,60,.18)', border: '#f0823c', text: '#f5a870' },
  { bg: 'rgba(100,160,60,.18)', border: '#64a03c', text: '#96c870' },
];

document.addEventListener('DOMContentLoaded', () => {
  atualizarSemana();
  renderizarSidebar();
  gerarCronograma();
  renderizarBotoes();

  document.getElementById('subject-name')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') adicionarMateria();
  });
});


function atualizarSemana() {
  const now  = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const semana = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  const el = document.getElementById('week-num');
  if (el) el.textContent = `Semana ${semana}`;
}

function adicionarMateria() {
  const nome  = document.getElementById('subject-name')?.value.trim();
  const horas = parseInt(document.getElementById('inp-horas')?.value) || 4;
  const prior = parseInt(document.getElementById('in-prior')?.value) || 2;

  if (!nome) { mostrarToast('Digite o nome da matéria.', 'error'); return; }
  if (materias.find(m => m.nome.toLowerCase() === nome.toLowerCase())) {
    mostrarToast('Matéria já adicionada.', 'error'); return;
  }
  if (horas < 1 || horas > 20) { mostrarToast('Horas devem ser entre 1 e 20.', 'error'); return; }

  const cor = CORES[materias.length % CORES.length];

  materias.push({
    id:    Date.now(),
    nome,
    horas,
    prior,
    cor,
    adicionadoEm: Date.now(),
  });

  salvarStorage('studyhub_materias', materias);

  const inp = document.getElementById('subject-name');
  if (inp) { inp.value = ''; inp.focus(); }

  mostrarToast(`"${nome}" adicionada!`, 'success');
  renderizarSidebar();
  gerarCronograma();
}

function removerMateria(id) {
  const mat = materias.find(m => m.id === id);
  materias = materias.filter(m => m.id !== id);
  salvarStorage('studyhub_materias', materias);
  if (mat) mostrarToast(`"${mat.nome}" removida.`, '');
  renderizarSidebar();
  gerarCronograma();
}

function ordenarPor(criterio) {
  ordemAtual = criterio;
  renderizarBotoes();
  gerarCronograma();
}

function renderizarBotoes() {
  document.querySelectorAll('.sort-btn[data-sort]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === ordemAtual);
  });
}

function materiasOrdenadas() {
  const copia = [...materias];
  if (ordemAtual === 'prioridade') return copia.sort((a, b) => b.prior - a.prior);
  if (ordemAtual === 'horas')      return copia.sort((a, b) => b.horas - a.horas);
  if (ordemAtual === 'nome')       return copia.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  return copia; // 'default'
}

function gerarCronograma() {
  const header   = document.getElementById('cal-days-header');
  const grid     = document.getElementById('cal-grid');
  const progress = document.getElementById('progress-section');
  if (!header || !grid || !progress) return;

  const hoje = new Date().getDay(); // 0=dom..6=sab → convertemos para 0=seg..6=dom
  const hojeIdx = (hoje === 0) ? 6 : hoje - 1;

  // cabeçalho dos dias
  header.innerHTML = DIAS.map((d, i) => `
    <div class="day-head ${i === hojeIdx ? 'today' : ''}">
      <span class="dia-longo">${d}</span>
      <span class="dia-curto">${DIAS_CURTO[i]}</span>
    </div>
  `).join('');

  if (materias.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <div class="empty-msg">Nenhuma matéria adicionada.</div>
        <div class="empty-hint">Use o painel ao lado para começar.</div>
      </div>`;
    progress.innerHTML = '';
    atualizarStats([]);
    return;
  }

  // distribuição de sessões
  const lista = materiasOrdenadas();
  // colunas por dia
  const colunas = Array.from({ length: 7 }, () => []);

  lista.forEach(mat => {
    const sessoesPorDia = distribuirSessoes(mat);
    sessoesPorDia.forEach((dur, dia) => {
      if (dur > 0) colunas[dia].push({ mat, dur });
    });
  });

  // renderizar grade
  grid.innerHTML = colunas.map((col, diaIdx) => `
    <div class="cal-col">
      ${col.length === 0
        ? `<div class="session-card" style="background:var(--surface2);border:1px dashed var(--border);color:var(--muted);text-align:center;padding:14px 6px;font-size:11px;">—</div>`
        : col.map((s, idx) => `
          <div class="session-card"
               style="background:${s.mat.cor.bg};border-left-color:${s.mat.cor.border};color:${s.mat.cor.text};animation-delay:${(diaIdx * col.length + idx) * 30}ms">
            <div class="session-name" title="${s.mat.nome}">${s.mat.nome}</div>
            <div class="session-dur">${formatarDur(s.dur)}</div>
          </div>
        `).join('')}
    </div>
  `).join('');

  // barra de progresso
  const totalHoras = materias.reduce((s, m) => s + m.horas, 0);
  progress.innerHTML = `
    <div class="section-label" style="padding:0 0 4px">Carga por matéria</div>
    ${lista.map(m => {
      const pct = totalHoras > 0 ? Math.round((m.horas / totalHoras) * 100) : 0;
      return `
        <div class="prog-row">
          <div class="prog-label" title="${m.nome}">${m.nome}</div>
          <div class="prog-bar-track">
            <div class="prog-bar-fill" style="width:${pct}%;background:${m.cor.border}"></div>
          </div>
          <div class="prog-pct">${pct}%</div>
        </div>`;
    }).join('')}`;

  atualizarStats(colunas);
}

// Distribui as horas semanais de uma matéria pelos 7 dias
function distribuirSessoes(mat) {
  const sessoesTotal = Math.max(1, Math.round(mat.horas / 1.5)); // sessões de ~1.5h
  const durSessao    = mat.horas / sessoesTotal;                 // horas por sessão

  // dias de estudo baseados na prioridade: alta→5 dias, média→3, baixa→2
  const qtdDias = mat.prior >= 3 ? 5 : mat.prior === 2 ? 3 : 2;
  // distribui nos primeiros N dias uniformemente
  const diasAtivos = [...Array(7).keys()].filter((_, i) => i < qtdDias);

  // sessões por dia (pode ser mais de 1 por dia se precisar)
  const resultado = Array(7).fill(0);
  let restante = mat.horas;
  let d = 0;
  for (let s = 0; s < sessoesTotal; s++) {
    const dia = diasAtivos[d % diasAtivos.length];
    resultado[dia] += durSessao;
    d++;
  }
  return resultado.map(h => Math.round(h * 10) / 10); // arredondar .1
}

function formatarDur(h) {
  if (h <= 0) return '';
  const total = Math.round(h * 60);
  const horas = Math.floor(total / 60);
  const mins  = total % 60;
  if (horas === 0) return `${mins}min`;
  if (mins  === 0) return `${horas}h`;
  return `${horas}h ${mins}min`;
}

// sidebar: lista de matérias + stats
function renderizarSidebar() {
  // garante que a .subject-list existe
  let lista = document.querySelector('.subject-list');
  if (!lista) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    const sec = document.createElement('div');
    sec.className = 'sidebar-section';
    sec.innerHTML = `<p class="section-label">Matérias (${materias.length})</p>`;
    lista = document.createElement('div');
    lista.className = 'subject-list';
    sec.appendChild(lista);
    sidebar.appendChild(sec);
  }

  const sec = lista.closest('.sidebar-section');
  const label = sec?.querySelector('.section-label');
  if (label) label.textContent = `Matérias (${materias.length})`;

  lista.innerHTML = materias.length === 0
    ? `<div style="font-size:12px;color:var(--muted);text-align:center;padding:16px 0">Nenhuma matéria ainda.</div>`
    : materias.map(m => {
        const priorLabel = m.prior === 3 ? 'Alta' : m.prior === 2 ? 'Média' : 'Baixa';
        const priorColor = m.prior === 3 ? 'var(--p-alta)' : m.prior === 2 ? 'var(--p-media)' : 'var(--p-baixa)';
        return `
          <div class="subject-item">
            <div class="subject-dot" style="background:${m.cor.border}"></div>
            <div class="subject-info">
              <div class="subject-name">${m.nome}</div>
              <div class="subject-meta">${m.horas}h/sem · <span style="color:${priorColor}">${priorLabel}</span></div>
            </div>
            <button class="subject-del" onclick="removerMateria(${m.id})" title="Remover">×</button>
          </div>`;
      }).join('');
}

function atualizarStats(colunas) {
  const totalH   = materias.reduce((s, m) => s + m.horas, 0);
  const totalSes = colunas.flat().length;
  const diasAtiv = colunas.filter(c => c.length > 0).length;

  set('s-horas',   totalH + 'h');
  set('s-mat',     materias.length);
  set('s-sessoes', totalSes);
  set('s-dias',    diasAtiv);
}

// PDF
function gerarPDF() {
  mostrarToast('Abrindo janela de impressão…', '');
  setTimeout(() => window.print(), 300);
}

// utils
function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function salvarStorage(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (_) {}
}

function carregarStorage(chave) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function mostrarToast(msg, tipo = '') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.className   = `toast ${tipo}`;

  clearTimeout(toastTimer);
  requestAnimationFrame(() => {
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  });
}