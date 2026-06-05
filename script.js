const EMOJIS = ['📝','🎯','💡','🚀','📚','🛒','🏋️','🎨','💼','🧹','📞','🍕','🌱','⚡','🎵','📸','🔧','💊','🏡','✈️','🎉','📊','🤝','💰','🌍'];
let tasks = JSON.parse(localStorage.getItem('taskly_tasks') || '[]');
let filter = 'all';
let editingId = null;
let chosenEmoji = '📝';
let showPicker = false;
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const statsPill = document.getElementById('stats-pill');
const progressSection = document.getElementById('progress-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const emojiBtn = document.getElementById('emoji-btn');
const prioritySel = document.getElementById('priority-sel');
const dueDate = document.getElementById('due-date');
// Date
const d = new Date();
document.getElementById('date-str').textContent = d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
// Emoji picker
let pickerEl = null;
emojiBtn.addEventListener('click', e => {
  e.stopPropagation();
  showPicker = !showPicker;
  if (pickerEl) { pickerEl.remove(); pickerEl = null; }
  if (showPicker) {
    pickerEl = document.createElement('div');
    pickerEl.className = 'emoji-picker';
    EMOJIS.forEach(em => {
      const sp = document.createElement('span');
      sp.textContent = em;
      sp.title = em;
      sp.addEventListener('click', e2 => {
        e2.stopPropagation();
        chosenEmoji = em;
        emojiBtn.textContent = em;
        pickerEl.remove(); pickerEl = null; showPicker = false;
      });
      pickerEl.appendChild(sp);
    });
    emojiBtn.parentElement.style.position = 'relative';
    emojiBtn.appendChild(pickerEl);
  }
});
document.addEventListener('click', () => {
  if (pickerEl) { pickerEl.remove(); pickerEl = null; showPicker = false; }
});
function save() { localStorage.setItem('taskly_tasks', JSON.stringify(tasks)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function addTask() {
  const text = taskInput.value.trim();
  if (!text) { taskInput.focus(); taskInput.style.borderColor='rgba(255,95,95,0.5)'; setTimeout(()=>taskInput.style.borderColor='',800); return; }
  const task = { id: uid(), text, emoji: chosenEmoji, priority: prioritySel.value, due: dueDate.value, done: false, created: Date.now() };
  tasks.unshift(task);
  save();
  taskInput.value = '';
  dueDate.value = '';
  render();
  showToast('✨ Task added!');
}
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
function toggleDone(id) {
  const t = tasks.find(t=>t.id===id);
  if (!t) return;
  t.done = !t.done;
  save();
  render();
  if (t.done) showToast('✅ Task completed!');
}
function deleteTask(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) {
    el.classList.add('removing');
    setTimeout(() => { tasks = tasks.filter(t=>t.id!==id); save(); render(); }, 280);
  }
  showToast('🗑 Deleted');
}
function startEdit(id) {
  const t = tasks.find(t=>t.id===id);
  if (!t) return;
  editingId = id;
  render();
  const inp = document.querySelector(`[data-id="${id}"] .task-edit-input`);
  if (inp) { inp.focus(); inp.select(); }
}
function saveEdit(id) {
  const inp = document.querySelector(`[data-id="${id}"] .task-edit-input`);
  if (!inp) return;
  const val = inp.value.trim();
  if (val) { tasks.find(t=>t.id===id).text = val; }
  editingId = null;
  save();
  render();
  showToast('✏️ Updated!');
}
document.getElementById('clear-done').addEventListener('click', () => {
  const count = tasks.filter(t=>t.done).length;
  tasks = tasks.filter(t=>!t.done);
  save();
  render();
  if (count) showToast(`🗑 Cleared ${count} task${count>1?'s':''}`);
});
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  filter = btn.dataset.filter;
  render();
});
function getFiltered() {
  switch(filter) {
    case 'active': return tasks.filter(t=>!t.done);
    case 'done': return tasks.filter(t=>t.done);
    case 'high': return tasks.filter(t=>t.priority==='high');
    default: return tasks;
  }
}
function formatDate(str) {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((d - today)/(1000*60*60*24));
  if (diff === 0) return '📅 Today';
  if (diff === 1) return '📅 Tomorrow';
  if (diff < 0) return `⚠️ ${Math.abs(diff)}d ago`;
  return `📅 ${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}`;
}
function render() {
  const filtered = getFiltered();
  const active = tasks.filter(t=>!t.done).length;
  const total = tasks.length;
  const done = tasks.filter(t=>t.done).length;
  statsPill.textContent = active + ' left';
  if (total > 0) {
    progressSection.style.display = '';
    const pct = Math.round((done/total)*100);
    progressFill.style.width = pct + '%';
    progressText.textContent = pct + '%';
  } else {
    progressSection.style.display = 'none';
  }
  if (filtered.length === 0) {
    taskList.innerHTML = `<div class="empty-state">
      <div class="big-emoji">${filter==='done'?'🎉':filter==='high'?'🔥':'🌿'}</div>
      <strong>${filter==='done'?'Nothing done yet':'No tasks here'}</strong>
    </div>`;
    return;
  }
  taskList.innerHTML = '';
  filtered.forEach((t, i) => {
    const isEditing = editingId === t.id;
    const item = document.createElement('div');
    item.className = 'task-item' + (t.done ? ' done' : '');
    item.dataset.id = t.id;
    item.style.animationDelay = (i * 0.04) + 's';
    const dueFmt = formatDate(t.due);
    const badgeClass = t.priority === 'high' ? 'badge-high' : t.priority === 'low' ? 'badge-low' : 'badge-medium';
    const priorityLabel = t.priority === 'high' ? '🔴 High' : t.priority === 'low' ? '🔵 Low' : '🟡 Medium';
    item.innerHTML = `
      <div class="check-box" title="${t.done?'Mark undone':'Mark done'}">${t.done?'✓':''}</div>
      <div class="task-emoji">${t.emoji}</div>
      <div class="task-content">
        <div class="task-text${isEditing?' editing':''}">${escHtml(t.text)}</div>
        <input class="task-edit-input${isEditing?' editing':''}" value="${escHtml(t.text)}" maxlength="120">
        <div class="task-meta">
          <span class="badge ${badgeClass}">${priorityLabel}</span>
          ${dueFmt ? `<span class="badge badge-date">${dueFmt}</span>` : ''}
        </div>
      </div>
      <div class="task-actions">
        <button class="action-btn edit-act" title="Edit">✏️</button>
        <button class="action-btn del" title="Delete">🗑</button>
      </div>`;
    item.querySelector('.check-box').addEventListener('click', e => { e.stopPropagation(); toggleDone(t.id); });
    item.querySelector('.del').addEventListener('click', e => { e.stopPropagation(); deleteTask(t.id); });
    item.querySelector('.edit-act').addEventListener('click', e => {
      e.stopPropagation();
      if (isEditing) saveEdit(t.id);
      else startEdit(t.id);
    });
    const editInp = item.querySelector('.task-edit-input');
    editInp.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveEdit(t.id);
      if (e.key === 'Escape') { editingId = null; render(); }
    });
    editInp.addEventListener('click', e => e.stopPropagation());
    editInp.addEventListener('blur', () => setTimeout(()=>{ if(editingId===t.id) saveEdit(t.id); }, 150));

    taskList.appendChild(item);
  });
}
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
let toastTimer;
function showToast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 300);
  }, 2000);
}
render();

