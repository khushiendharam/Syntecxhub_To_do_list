# Syntecxhub_To_do_list
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>✨Today's Focus✨</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">
  <div class="header">
    <div class="header-left">
      <h1>✨<span>Today's Focus</span> ✨</h1>
      <p id="date-str"></p>
    </div>
    <div class="stats-pill" id="stats-pill">0 left</div>
  </div>
  <div class="progress-wrap" id="progress-section" style="display:none">
    <div class="progress-header">
      <span>Progress</span>
      <strong id="progress-text">0%</strong>
    </div>
    <div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>
  </div>
  <div class="add-section">
    <div class="add-row">
      <div class="emoji-btn" id="emoji-btn" title="Pick icon">📝</div>
      <input type="text" id="task-input" placeholder="Add a new task…" autocomplete="off" maxlength="120">
      <button class="add-btn" id="add-btn">+ Add</button>
    </div>
    <div class="meta-row">
      <select id="priority-sel">
        <option value="medium">🟡 Medium</option>
        <option value="high">🔴 High</option>
        <option value="low">🔵 Low</option>
      </select>
      <input type="date" id="due-date" title="Due date">
    </div>
  </div>
  <div class="filters" id="filters">
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="active">🌱 Active</button>
    <button class="filter-btn" data-filter="done">✅ Done</button>
    <button class="filter-btn" data-filter="high">🔥 High</button>
  </div>
  <div class="task-list" id="task-list"></div>
  <div class="footer-row">
    <button class="clear-btn" id="clear-done">🗑 Clear completed</button>
  </div>
</div>
<script src="script.js"></script>
</body>
</html>
