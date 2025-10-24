// Lógica de la calculadora
const display = document.getElementById('display');
let expr = '';

function updateDisplay(){
  display.textContent = expr === '' ? '0' : expr;
}

function clearAll(){ expr = ''; updateDisplay(); }
function backspace(){ expr = expr.slice(0, -1); updateDisplay(); }

function appendValue(v){
  // evita caracteres inválidos y evita entradas repetidas de operadores al principio
  if (v === '=' ){
    calculate();
    return;
  }
  if (v === 'back') { backspace(); return; }
  if (v === 'C') { clearAll(); return; }
  expr += v;
  updateDisplay();
}

function calculate(){
  if (!expr) return;
  // Normalizar símbolos (si usáramos × o ÷)
  const sanitized = expr.replace(/×/g,'*').replace(/÷/g,'/');
  // Permitir sólo números, operadores comunes, paréntesis y punto
  if (!/^[0-9+\-*/().\s]+$/.test(sanitized)){
    display.textContent = 'Error'; expr = '';
    return;
  }
  try{
    // Usamos Function para evaluar de forma controlada
    const result = Function('"use strict"; return (' + sanitized + ')')();
    if (typeof result === 'number' && isFinite(result)){
      // limitar decimales razonablemente
      const rounded = Math.round(result * 1e12) / 1e12;
      expr = String(rounded);
      updateDisplay();
    } else {
      display.textContent = 'Error'; expr = '';
    }
  } catch (e){
    display.textContent = 'Error'; expr = '';
  }
}

// manejadores de botones
document.querySelectorAll('.key').forEach(btn => {
  btn.addEventListener('click', () => {
    appendValue(btn.dataset.value);
  });
});

// soporte teclado básico
document.addEventListener('keydown', (ev) => {
  const k = ev.key;
  if (k === 'Enter') { ev.preventDefault(); appendValue('='); return; }
  if (k === 'Backspace') { ev.preventDefault(); appendValue('back'); return; }
  if (k === 'Escape') { ev.preventDefault(); appendValue('C'); return; }
  // teclas válidas: dígitos, operadores y paréntesis y punto
  if (/^[0-9+\-*/().]$/.test(k)){
    appendValue(k);
  }
});

// inicializar display
updateDisplay();