import { useState, useEffect, useCallback } from "react";

// ============================================================
// DATA MODELS & CONSTANTS
// ============================================================

const COLORS = {
  bg: "#0a0a0f",
  surface: "#13131a",
  card: "#1a1a24",
  border: "#2a2a38",
  accent: "#e8ff47",
  accentDim: "#b8cc2a",
  red: "#ff4747",
  blue: "#4794ff",
  text: "#f0f0f8",
  muted: "#6b6b85",
  success: "#47ff9a",
};

const EXERCISE_DB = {
  chest: [
    { id: "bp", name: "Barbell Bench Press", muscle: "Chest", demo: "https://www.youtube.com/watch?v=rT7DgCr-3pg", equipment: ["barbell"] },
    { id: "dbp", name: "Dumbbell Press", muscle: "Chest", demo: "https://www.youtube.com/watch?v=QsYre__-aro", equipment: ["dumbbell"] },
    { id: "ip", name: "Incline Press", muscle: "Upper Chest", demo: "https://www.youtube.com/watch?v=DbFgADa2PL8", equipment: ["barbell", "dumbbell"] },
    { id: "pec", name: "Pec Deck Fly", muscle: "Chest", demo: "https://www.youtube.com/watch?v=Z57CtFmRMxA", equipment: ["machine"] },
    { id: "pu", name: "Push-ups", muscle: "Chest", demo: "https://www.youtube.com/watch?v=IODxDxX7oi4", equipment: ["bodyweight"] },
    { id: "dip", name: "Chest Dips", muscle: "Lower Chest", demo: "https://www.youtube.com/watch?v=2z8JmcrW-As", equipment: ["bodyweight"] },
  ],
  back: [
    { id: "dl", name: "Deadlift", muscle: "Back", demo: "https://www.youtube.com/watch?v=op9kVnSso6Q", equipment: ["barbell"] },
    { id: "row", name: "Barbell Row", muscle: "Middle Back", demo: "https://www.youtube.com/watch?v=9efgcAjQe7E", equipment: ["barbell"] },
    { id: "pu2", name: "Pull-ups", muscle: "Lats", demo: "https://www.youtube.com/watch?v=eGo4IYlbE5g", equipment: ["bodyweight"] },
    { id: "lat", name: "Lat Pulldown", muscle: "Lats", demo: "https://www.youtube.com/watch?v=CAwf7n6Luuc", equipment: ["machine"] },
    { id: "crow", name: "Cable Row", muscle: "Middle Back", demo: "https://www.youtube.com/watch?v=GZbfZ033f74", equipment: ["cable"] },
    { id: "drow", name: "Dumbbell Row", muscle: "Lats", demo: "https://www.youtube.com/watch?v=roCP6wCXPqo", equipment: ["dumbbell"] },
  ],
  shoulders: [
    { id: "ohp", name: "Overhead Press", muscle: "Shoulders", demo: "https://www.youtube.com/watch?v=2yjwXTZQDDI", equipment: ["barbell"] },
    { id: "dbohp", name: "DB Shoulder Press", muscle: "Shoulders", demo: "https://www.youtube.com/watch?v=qEwKCR5JCog", equipment: ["dumbbell"] },
    { id: "lr", name: "Lateral Raise", muscle: "Side Delts", demo: "https://www.youtube.com/watch?v=3VcKaXpzqRo", equipment: ["dumbbell"] },
    { id: "fr", name: "Front Raise", muscle: "Front Delts", demo: "https://www.youtube.com/watch?v=sOoBuGRSixE", equipment: ["dumbbell"] },
    { id: "face", name: "Face Pull", muscle: "Rear Delts", demo: "https://www.youtube.com/watch?v=rep-qVOkqgk", equipment: ["cable"] },
  ],
  biceps: [
    { id: "bcurl", name: "Barbell Curl", muscle: "Biceps", demo: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo", equipment: ["barbell"] },
    { id: "dcurl", name: "Dumbbell Curl", muscle: "Biceps", demo: "https://www.youtube.com/watch?v=sAq_ocpRh_I", equipment: ["dumbbell"] },
    { id: "hcurl", name: "Hammer Curl", muscle: "Biceps/Brachialis", demo: "https://www.youtube.com/watch?v=zC3nLlEvin4", equipment: ["dumbbell"] },
    { id: "ccurl", name: "Cable Curl", muscle: "Biceps", demo: "https://www.youtube.com/watch?v=NFzTWp2qpiE", equipment: ["cable"] },
  ],
  triceps: [
    { id: "tdip", name: "Tricep Dips", muscle: "Triceps", demo: "https://www.youtube.com/watch?v=0326dy_-CzM", equipment: ["bodyweight"] },
    { id: "skul", name: "Skull Crushers", muscle: "Triceps", demo: "https://www.youtube.com/watch?v=d_KZxkY_0cM", equipment: ["barbell"] },
    { id: "tpd", name: "Tricep Pushdown", muscle: "Triceps", demo: "https://www.youtube.com/watch?v=2-LAMcpzODU", equipment: ["cable"] },
    { id: "ohte", name: "OH Tricep Extension", muscle: "Triceps", demo: "https://www.youtube.com/watch?v=nRiJVZDpdL0", equipment: ["dumbbell"] },
  ],
  quads: [
    { id: "squat", name: "Barbell Squat", muscle: "Quads", demo: "https://www.youtube.com/watch?v=ultWZbUMPL8", equipment: ["barbell"] },
    { id: "leg", name: "Leg Press", muscle: "Quads", demo: "https://www.youtube.com/watch?v=IZxyjW7MPJQ", equipment: ["machine"] },
    { id: "le", name: "Leg Extension", muscle: "Quads", demo: "https://www.youtube.com/watch?v=YyvSfVjQeL0", equipment: ["machine"] },
    { id: "bsq", name: "Bulgarian Split Squat", muscle: "Quads/Glutes", demo: "https://www.youtube.com/watch?v=2C-uNgKwPLE", equipment: ["dumbbell"] },
    { id: "hsq", name: "Hack Squat", muscle: "Quads", demo: "https://www.youtube.com/watch?v=0tn5K9NlCfo", equipment: ["machine"] },
  ],
  hamstrings: [
    { id: "rdl", name: "Romanian Deadlift", muscle: "Hamstrings", demo: "https://www.youtube.com/watch?v=JCXUYuzwNrM", equipment: ["barbell"] },
    { id: "lc", name: "Leg Curl", muscle: "Hamstrings", demo: "https://www.youtube.com/watch?v=1Tq3QdYUuHs", equipment: ["machine"] },
    { id: "sdl", name: "Stiff-Leg Deadlift", muscle: "Hamstrings", demo: "https://www.youtube.com/watch?v=1uDiW5--rAE", equipment: ["barbell"] },
  ],
  glutes: [
    { id: "hth", name: "Hip Thrust", muscle: "Glutes", demo: "https://www.youtube.com/watch?v=SEdqd1n0cvg", equipment: ["barbell"] },
    { id: "gb", name: "Glute Bridge", muscle: "Glutes", demo: "https://www.youtube.com/watch?v=OUgsJ8-Vi0E", equipment: ["bodyweight"] },
    { id: "ck", name: "Cable Kickback", muscle: "Glutes", demo: "https://www.youtube.com/watch?v=KbIdhpMMhMw", equipment: ["cable"] },
  ],
  calves: [
    { id: "src", name: "Standing Calf Raise", muscle: "Calves", demo: "https://www.youtube.com/watch?v=-M4-G8p1fCI", equipment: ["machine", "bodyweight"] },
    { id: "src2", name: "Seated Calf Raise", muscle: "Calves", demo: "https://www.youtube.com/watch?v=JbyjNymZOt0", equipment: ["machine"] },
  ],
  core: [
    { id: "crunch", name: "Crunch", muscle: "Abs", demo: "https://www.youtube.com/watch?v=Xyd_fa5zoEU", equipment: ["bodyweight"] },
    { id: "plank", name: "Plank", muscle: "Core", demo: "https://www.youtube.com/watch?v=pSHjTRCQxIw", equipment: ["bodyweight"] },
    { id: "lcr", name: "Leg Raise", muscle: "Lower Abs", demo: "https://www.youtube.com/watch?v=JB2oyawG9KI", equipment: ["bodyweight"] },
    { id: "cabcr", name: "Cable Crunch", muscle: "Abs", demo: "https://www.youtube.com/watch?v=2fbujeH3F0E", equipment: ["cable"] },
  ],
};

// ============================================================
// PLAN GENERATION ENGINE
// ============================================================

function selectTrainingSystem(days, level) {
  if (days === 2) return { system: "Full Body", warning: null };
  if (days === 3) {
    if (level === "Beginner") return { system: "Full Body", warning: null };
    return { system: "Push Pull Legs", warning: null };
  }
  if (days === 4) {
    if (level === "Beginner") return { system: "Upper / Lower", warning: null };
    return { system: "Upper / Lower", warning: null };
  }
  if (days === 5) {
    if (level === "Advanced") return { system: "Push Pull Legs", warning: "PPL on 5 days uses one rest day mid-week. Ideal is 6 days for true PPL." };
    return { system: "Push Pull Legs", warning: "5-day PPL: one muscle group trained twice/week." };
  }
  if (days === 6) {
    if (level === "Advanced") return { system: "Push Pull Legs", warning: null };
    return { system: "Arnold Split", warning: null };
  }
  return { system: "Full Body", warning: null };
}

function getVolumeRange(level) {
  if (level === "Beginner") return { min: 10, max: 12 };
  if (level === "Advanced") return { min: 16, max: 20 };
  return { min: 12, max: 16 };
}

function buildExercises(muscleGroups, level) {
  const vol = getVolumeRange(level);
  const setsPerExercise = level === "Beginner" ? 3 : 4;
  const totalSets = Math.round((vol.min + vol.max) / 2);
  const numExercises = Math.ceil(totalSets / setsPerExercise);
  const repsMap = {
    "Beginner": "10–12", "Intermediate": "8–12", "Advanced": "6–10"
  };
  const reps = repsMap[level] || "8–12";
  const rest = level === "Beginner" ? "90s" : level === "Advanced" ? "2–3 min" : "60–90s";

  const exercises = [];
  muscleGroups.forEach(mg => {
    const pool = EXERCISE_DB[mg] || [];
    const count = Math.ceil(numExercises / muscleGroups.length);
    const picked = pool.slice(0, Math.min(count, pool.length));
    picked.forEach(ex => {
      exercises.push({ ...ex, sets: setsPerExercise, reps, rest });
    });
  });
  return exercises;
}

function generateWeeklySchedule(system, days, level, goal) {
  const schedules = {
    "Full Body": [
      { day: "Day A", label: "Full Body A", muscles: ["chest", "back", "quads", "core"] },
      { day: "Day B", label: "Full Body B", muscles: ["shoulders", "back", "hamstrings", "glutes"] },
    ],
    "Push Pull Legs": [
      { day: "Push", label: "Push (Chest / Shoulders / Triceps)", muscles: ["chest", "shoulders", "triceps"] },
      { day: "Pull", label: "Pull (Back / Biceps)", muscles: ["back", "biceps"] },
      { day: "Legs", label: "Legs (Quads / Hamstrings / Glutes / Calves)", muscles: ["quads", "hamstrings", "glutes", "calves"] },
    ],
    "Upper / Lower": [
      { day: "Upper A", label: "Upper A (Chest / Back Focus)", muscles: ["chest", "back", "biceps"] },
      { day: "Lower A", label: "Lower A (Quad Focus)", muscles: ["quads", "hamstrings", "calves"] },
      { day: "Upper B", label: "Upper B (Shoulders / Arms)", muscles: ["shoulders", "triceps", "biceps"] },
      { day: "Lower B", label: "Lower B (Hip-Hinge / Posterior)", muscles: ["hamstrings", "glutes", "calves"] },
    ],
    "Arnold Split": [
      { day: "Chest & Back", label: "Chest & Back", muscles: ["chest", "back"] },
      { day: "Shoulders & Arms", label: "Shoulders & Arms", muscles: ["shoulders", "biceps", "triceps"] },
      { day: "Legs", label: "Legs & Core", muscles: ["quads", "hamstrings", "glutes", "core"] },
    ],
  };

  const template = schedules[system] || schedules["Full Body"];
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const trainingDays = [];

  // Distribute training days across the week with rest days
  let templateIdx = 0;
  const assigned = [];
  for (let i = 0; i < 7 && assigned.length < days; i++) {
    if (days <= 3 && i === 3) continue; // rest Wednesday for 3-day
    if (days <= 4 && (i === 2 || i === 5)) continue;
    assigned.push(weekDays[i]);
  }
  // fill remaining
  while (assigned.length < days) {
    const remaining = weekDays.filter(d => !assigned.includes(d));
    if (remaining.length === 0) break;
    assigned.push(remaining[0]);
  }

  assigned.forEach((dayName, idx) => {
    const t = template[templateIdx % template.length];
    templateIdx++;
    trainingDays.push({
      dayName,
      label: t.label,
      muscles: t.muscles,
      exercises: buildExercises(t.muscles, level),
    });
  });

  return trainingDays;
}

function calcNutrition(gender, goal, weight = 75) {
  // Mifflin-St Jeor estimate, moderate activity
  const bmr = gender === "Male" ? (10 * weight + 6.25 * 175 - 5 * 28 + 5) : (10 * weight + 6.25 * 165 - 5 * 26 - 161);
  const tdee = Math.round(bmr * 1.55);
  let calories, protein;
  if (goal === "Fat Loss (Cutting)") { calories = tdee - 400; protein = Math.round(weight * 2.2); }
  else if (goal === "Muscle Gain (Bulking)") { calories = tdee + 300; protein = Math.round(weight * 2.0); }
  else if (goal === "Recomposition") { calories = tdee; protein = Math.round(weight * 2.4); }
  else { calories = tdee; protein = Math.round(weight * 1.8); }
  return { calories, protein, tdee };
}

function generateMealPlan(calories, protein) {
  const meals = [
    { name: "Breakfast", cals: Math.round(calories * 0.25), protein: Math.round(protein * 0.25), suggestion: "Oats + eggs + banana" },
    { name: "Lunch", cals: Math.round(calories * 0.35), protein: Math.round(protein * 0.35), suggestion: "Chicken rice + vegetables" },
    { name: "Snack", cals: Math.round(calories * 0.10), protein: Math.round(protein * 0.15), suggestion: "Greek yogurt + nuts" },
    { name: "Dinner", cals: Math.round(calories * 0.30), protein: Math.round(protein * 0.25), suggestion: "Salmon + sweet potato + salad" },
  ];
  return meals;
}

// ============================================================
// STORAGE (localStorage wrapper)
// ============================================================
const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ============================================================
// STYLES
// ============================================================
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .ff-app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: ${COLORS.bg};
    position: relative;
    padding-bottom: 80px;
  }

  .display-font { font-family: 'Barlow Condensed', sans-serif; }

  .accent { color: ${COLORS.accent}; }
  .muted { color: ${COLORS.muted}; }
  .success { color: ${COLORS.success}; }

  /* ONBOARDING */
  .ob-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 48px 24px 32px;
    background: ${COLORS.bg};
  }
  .ob-step {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${COLORS.accent};
    margin-bottom: 12px;
  }
  .ob-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 40px;
    font-weight: 800;
    line-height: 1.0;
    margin-bottom: 8px;
    text-transform: uppercase;
  }
  .ob-sub { font-size: 14px; color: ${COLORS.muted}; margin-bottom: 40px; }

  .ob-options { display: flex; flex-direction: column; gap: 12px; flex: 1; }
  .ob-opt {
    border: 1.5px solid ${COLORS.border};
    background: ${COLORS.surface};
    border-radius: 12px;
    padding: 18px 20px;
    cursor: pointer;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .ob-opt:hover { border-color: ${COLORS.accent}; }
  .ob-opt.selected { border-color: ${COLORS.accent}; background: rgba(232,255,71,0.07); }
  .ob-opt-icon { font-size: 28px; }
  .ob-opt-label { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 700; text-transform: uppercase; }
  .ob-opt-desc { font-size: 12px; color: ${COLORS.muted}; margin-top: 2px; }

  .ob-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ob-day-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
  .ob-day {
    aspect-ratio: 1;
    border-radius: 10px;
    border: 1.5px solid ${COLORS.border};
    background: ${COLORS.surface};
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 24px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ob-day:hover { border-color: ${COLORS.accent}; }
  .ob-day.selected { border-color: ${COLORS.accent}; background: rgba(232,255,71,0.1); color: ${COLORS.accent}; }

  .btn-primary {
    width: 100%;
    background: ${COLORS.accent};
    color: #0a0a0f;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    margin-top: 24px;
    transition: opacity 0.15s;
  }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-primary:hover:not(:disabled) { opacity: 0.88; }

  .btn-secondary {
    background: transparent;
    color: ${COLORS.muted};
    border: none;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    padding: 12px;
    margin-top: 8px;
  }

  /* BOTTOM NAV */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: ${COLORS.surface};
    border-top: 1px solid ${COLORS.border};
    display: flex;
    z-index: 100;
  }
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 4px 12px;
    cursor: pointer;
    gap: 4px;
    transition: color 0.15s;
    color: ${COLORS.muted};
  }
  .nav-item.active { color: ${COLORS.accent}; }
  .nav-icon { font-size: 22px; }
  .nav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

  /* HOME */
  .home-header {
    padding: 52px 20px 20px;
    background: linear-gradient(180deg, #131320 0%, transparent 100%);
  }
  .home-greeting { font-size: 13px; color: ${COLORS.muted}; letter-spacing: 1px; text-transform: uppercase; }
  .home-title { font-family: 'Barlow Condensed', sans-serif; font-size: 36px; font-weight: 800; text-transform: uppercase; }

  .card {
    background: ${COLORS.card};
    border-radius: 16px;
    border: 1px solid ${COLORS.border};
    padding: 18px;
    margin: 0 16px 14px;
  }
  .card-title { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; text-transform: uppercase; letter-spacing: 2px; color: ${COLORS.muted}; margin-bottom: 12px; }

  .stat-row { display: flex; gap: 10px; margin: 0 16px 14px; }
  .stat-box {
    flex: 1;
    background: ${COLORS.card};
    border-radius: 14px;
    border: 1px solid ${COLORS.border};
    padding: 14px;
    text-align: center;
  }
  .stat-value { font-family: 'Barlow Condensed', sans-serif; font-size: 30px; font-weight: 800; color: ${COLORS.accent}; }
  .stat-label { font-size: 11px; color: ${COLORS.muted}; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

  /* TODAY WORKOUT */
  .day-chip {
    display: inline-block;
    background: rgba(232,255,71,0.1);
    color: ${COLORS.accent};
    border: 1px solid rgba(232,255,71,0.3);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .workout-title { font-family: 'Barlow Condensed', sans-serif; font-size: 26px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
  .exercise-row {
    display: flex; align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid ${COLORS.border};
    gap: 12px;
  }
  .exercise-row:last-child { border-bottom: none; }
  .ex-check {
    width: 24px; height: 24px;
    border-radius: 6px;
    border: 2px solid ${COLORS.border};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s;
  }
  .ex-check.done { background: ${COLORS.success}; border-color: ${COLORS.success}; }
  .ex-name { font-weight: 600; font-size: 15px; flex: 1; }
  .ex-meta { font-size: 12px; color: ${COLORS.muted}; margin-top: 2px; }
  .ex-link { font-size: 11px; color: ${COLORS.blue}; text-decoration: none; }

  /* SET TRACKER */
  .set-row { display: flex; gap: 8px; margin-top: 8px; }
  .set-input {
    flex: 1;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    padding: 8px 10px;
    color: ${COLORS.text};
    font-size: 14px;
    text-align: center;
  }
  .set-input:focus { outline: none; border-color: ${COLORS.accent}; }

  /* NUTRITION */
  .macro-bar { height: 8px; background: ${COLORS.border}; border-radius: 4px; margin: 8px 0; overflow: hidden; }
  .macro-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }

  .meal-card {
    background: ${COLORS.surface};
    border-radius: 12px;
    border: 1px solid ${COLORS.border};
    padding: 14px;
    margin-bottom: 10px;
  }
  .meal-name { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; text-transform: uppercase; }
  .meal-meta { font-size: 12px; color: ${COLORS.muted}; }
  .log-input {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 12px;
    color: ${COLORS.text};
    font-size: 15px;
    width: 100%;
    margin-bottom: 8px;
  }
  .log-input:focus { outline: none; border-color: ${COLORS.accent}; }

  /* PROGRESS */
  .chart-area {
    height: 140px;
    background: ${COLORS.surface};
    border-radius: 12px;
    border: 1px solid ${COLORS.border};
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: flex-end;
    padding: 12px;
    gap: 6px;
  }
  .chart-bar {
    flex: 1;
    background: rgba(232,255,71,0.3);
    border-radius: 4px 4px 0 0;
    transition: height 0.4s;
    min-height: 4px;
  }
  .chart-bar.active { background: ${COLORS.accent}; }

  /* PROFILE */
  .profile-avatar {
    width: 80px; height: 80px;
    background: rgba(232,255,71,0.1);
    border-radius: 40px;
    border: 2px solid rgba(232,255,71,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
    margin: 0 auto 14px;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid ${COLORS.border};
  }
  .info-label { font-size: 13px; color: ${COLORS.muted}; }
  .info-value { font-size: 15px; font-weight: 600; }

  .tag {
    display: inline-block;
    background: rgba(232,255,71,0.1);
    color: ${COLORS.accent};
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .section-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 800;
    text-transform: uppercase;
    padding: 18px 20px 8px;
    letter-spacing: 1px;
  }

  .warning-box {
    background: rgba(255,71,71,0.08);
    border: 1px solid rgba(255,71,71,0.3);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 13px;
    color: ${COLORS.red};
    margin: 0 16px 12px;
  }

  .system-badge {
    background: rgba(71,148,255,0.1);
    border: 1px solid rgba(71,148,255,0.3);
    border-radius: 8px;
    padding: 6px 12px;
    color: ${COLORS.blue};
    font-size: 13px;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 12px;
  }

  .streak-flame { font-size: 36px; }

  .scroll-area { overflow-y: auto; padding-bottom: 12px; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-in { animation: fadeIn 0.3s ease forwards; }

  .progress-ring-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    flex: 1;
  }
  .progress-ring-label { font-size: 11px; color: ${COLORS.muted}; text-transform: uppercase; letter-spacing: 1px; }

  .tab-row { display: flex; gap: 8px; padding: 0 16px 12px; }
  .tab {
    padding: 7px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid ${COLORS.border};
    background: transparent;
    color: ${COLORS.muted};
    transition: all 0.15s;
  }
  .tab.active { background: ${COLORS.accent}; color: #0a0a0f; border-color: ${COLORS.accent}; }
`;

// ============================================================
// COMPONENTS
// ============================================================

function ProgressRing({ value, max, color, size = 56, label }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="progress-ring-wrap">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={COLORS.border} strokeWidth={4}/>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color}
          strokeWidth={4}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{transition: "stroke-dashoffset 0.5s"}}
        />
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fill={COLORS.text} fontSize="13" fontWeight="700">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <span className="progress-ring-label">{label}</span>
    </div>
  );
}

// ============================================================
// ONBOARDING
// ============================================================

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    gender: null, goal: null, days: null,
    level: "Intermediate", equipment: "gym", weakMuscle: null
  });

  const steps = [
    {
      key: "gender", title: "Select your\ngender", sub: "Affects calorie targets, volume, and exercise selection",
      options: [
        { value: "Male", icon: "♂️", desc: "Optimized for male physiology" },
        { value: "Female", icon: "♀️", desc: "Optimized for female physiology" },
      ]
    },
    {
      key: "goal", title: "What's your\nprimary goal?", sub: "This shapes your entire program and nutrition plan",
      options: [
        { value: "Fat Loss (Cutting)", icon: "🔥", desc: "Caloric deficit · preserve muscle" },
        { value: "Muscle Gain (Bulking)", icon: "💪", desc: "Caloric surplus · progressive overload" },
        { value: "Recomposition", icon: "⚖️", desc: "Lose fat · gain muscle simultaneously" },
        { value: "General Fitness", icon: "🏃", desc: "Health, endurance, and strength" },
      ]
    },
    {
      key: "days", title: "Training days\nper week", sub: "The system will auto-select the best split for you",
      type: "days"
    },
    {
      key: "level", title: "Experience\nlevel", sub: "Optional — skip to use smart defaults",
      optional: true,
      options: [
        { value: "Beginner", icon: "🌱", desc: "Less than 1 year of consistent training" },
        { value: "Intermediate", icon: "⚡", desc: "1–3 years of consistent training" },
        { value: "Advanced", icon: "🎯", desc: "3+ years, familiar with periodization" },
      ]
    },
  ];

  const current = steps[step];
  const val = form[current.key];

  function select(v) {
    setForm(f => ({ ...f, [current.key]: v }));
  }

  function next() {
    if (step < steps.length - 1) setStep(s => s + 1);
    else finish();
  }

  function finish() {
    const { system, warning } = selectTrainingSystem(form.days, form.level);
    const schedule = generateWeeklySchedule(system, form.days, form.level, form.goal);
    const nut = calcNutrition(form.gender, form.goal);
    const meals = generateMealPlan(nut.calories, nut.protein);
    const profile = { ...form, system, warning, schedule, nutrition: nut, meals, createdAt: Date.now() };
    store.set("ff_profile", profile);
    store.set("ff_logs", []);
    store.set("ff_weight", [{ date: new Date().toISOString().slice(0,10), weight: 75 }]);
    onComplete(profile);
  }

  const canNext = current.optional ? true : (current.type === "days" ? !!form.days : !!val);

  return (
    <div className="ob-screen animate-in">
      <div className="ob-step">Step {step + 1} of {steps.length}</div>
      <div className="ob-title display-font" style={{whiteSpace:"pre-line"}}>{current.title}</div>
      <div className="ob-sub">{current.sub}</div>

      <div className="ob-options">
        {current.type === "days" ? (
          <div>
            <div className="ob-day-grid">
              {[2,3,4,5,6].map(d => (
                <div key={d} className={`ob-day ${form.days === d ? "selected" : ""}`} onClick={() => select(d)}>{d}</div>
              ))}
            </div>
            <p style={{fontSize:12, color: COLORS.muted, marginTop:12}}>
              {form.days && (() => {
                const { system, warning } = selectTrainingSystem(form.days, form.level);
                return <><span style={{color: COLORS.blue}}>→ {system}</span>{warning ? <span style={{color: COLORS.red}}> ⚠ {warning}</span> : " ✓ Optimal split"}</>;
              })()}
            </p>
          </div>
        ) : (
          current.options.map(opt => (
            <div key={opt.value} className={`ob-opt ${val === opt.value ? "selected" : ""}`} onClick={() => select(opt.value)}>
              <span className="ob-opt-icon">{opt.icon}</span>
              <div>
                <div className="ob-opt-label">{opt.value}</div>
                <div className="ob-opt-desc">{opt.desc}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="btn-primary" onClick={next} disabled={!canNext}>
        {step < steps.length - 1 ? "Continue →" : "Generate My Plan"}
      </button>
      {current.optional && <button className="btn-secondary" onClick={next}>Skip — Use defaults</button>}
    </div>
  );
}

// ============================================================
// HOME SCREEN
// ============================================================

function HomeScreen({ profile, logs }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaySchedule = profile.schedule.find(s => s.dayName === today) || null;
  const streak = logs.filter(l => l.completed).length;
  const adherence = profile.schedule.length > 0 ? Math.round((logs.filter(l => l.completed).length / Math.max(1, logs.length)) * 100) : 0;

  return (
    <div className="scroll-area animate-in">
      <div className="home-header">
        <div className="home-greeting">Welcome back</div>
        <div className="home-title display-font">Today's Dashboard</div>
        <div style={{fontSize:13, color: COLORS.muted, marginTop:4}}>{today}</div>
      </div>

      <div className="stat-row">
        <div className="stat-box">
          <div className="streak-flame">🔥</div>
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{adherence}%</div>
          <div className="stat-label">Adherence</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{profile.nutrition.calories}</div>
          <div className="stat-label">Daily kcal</div>
        </div>
      </div>

      {profile.warning && (
        <div className="warning-box">⚠ {profile.warning}</div>
      )}

      <div className="card">
        <div className="card-title">Your Training System</div>
        <span className="system-badge">🏋️ {profile.system}</span>
        <div style={{fontSize:13, color: COLORS.muted}}>{profile.schedule.length} training days/week · {profile.level} level</div>
        <div style={{marginTop:10, display:"flex", flexWrap:"wrap", gap:6}}>
          {profile.schedule.map((s,i) => (
            <span key={i} style={{fontSize:11, background: COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:6, padding:"3px 8px", color: COLORS.text}}>
              {s.dayName.slice(0,3)} — {s.label.split("(")[0].trim()}
            </span>
          ))}
        </div>
      </div>

      {todaySchedule ? (
        <div className="card">
          <div className="card-title">Today's Workout</div>
          <div className="day-chip">📅 {todaySchedule.dayName}</div>
          <div className="workout-title">{todaySchedule.label}</div>
          <div style={{fontSize:13, color: COLORS.muted}}>{todaySchedule.exercises.length} exercises</div>
          <div style={{marginTop:12}}>
            {todaySchedule.exercises.slice(0,3).map(ex => (
              <div key={ex.id} className="exercise-row">
                <div className="ex-check">💪</div>
                <div style={{flex:1}}>
                  <div className="ex-name">{ex.name}</div>
                  <div className="ex-meta">{ex.sets} sets × {ex.reps} — Rest {ex.rest}</div>
                </div>
              </div>
            ))}
            {todaySchedule.exercises.length > 3 && (
              <div style={{fontSize:13, color: COLORS.muted, paddingTop:8}}>+{todaySchedule.exercises.length - 3} more exercises →</div>
            )}
          </div>
        </div>
      ) : (
        <div className="card" style={{textAlign:"center", padding:32}}>
          <div style={{fontSize:40}}>😴</div>
          <div style={{fontFamily:"'Barlow Condensed', sans-serif", fontSize:22, fontWeight:800, textTransform:"uppercase", marginTop:8}}>Rest Day</div>
          <div style={{fontSize:13, color: COLORS.muted, marginTop:4}}>Recovery is part of training</div>
        </div>
      )}

      <div className="card">
        <div className="card-title">Nutrition Today</div>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
          <span style={{fontSize:13}}>Daily Target</span>
          <span style={{fontSize:13, color: COLORS.accent, fontWeight:700}}>{profile.nutrition.calories} kcal / {profile.nutrition.protein}g protein</span>
        </div>
        <div style={{fontSize:12, color: COLORS.muted}}>
          Goal: <span style={{color: COLORS.text}}>{profile.goal}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// WORKOUT SCREEN
// ============================================================

function WorkoutScreen({ profile }) {
  const [activeDay, setActiveDay] = useState(0);
  const [checked, setChecked] = useState({});
  const [setData, setSetData] = useState({});
  const [expandedEx, setExpandedEx] = useState(null);

  const day = profile.schedule[activeDay];

  function toggleCheck(exId) {
    setChecked(c => ({ ...c, [exId]: !c[exId] }));
  }

  function updateSet(exId, setIdx, field, val) {
    setSetData(d => ({
      ...d,
      [exId]: {
        ...d[exId],
        [setIdx]: { ...((d[exId] || {})[setIdx] || {}), [field]: val }
      }
    }));
  }

  const completed = Object.values(checked).filter(Boolean).length;
  const total = day.exercises.length;
  const pct = total > 0 ? completed / total : 0;

  return (
    <div className="scroll-area animate-in">
      <div className="home-header">
        <div className="home-greeting">Weekly Schedule</div>
        <div className="home-title display-font">Workout</div>
      </div>

      {/* Day Tabs */}
      <div className="tab-row" style={{overflowX:"auto", flexWrap:"nowrap", paddingBottom:8}}>
        {profile.schedule.map((s, i) => (
          <button key={i} className={`tab ${activeDay === i ? "active" : ""}`} onClick={() => { setActiveDay(i); setChecked({}); setExpandedEx(null); }}>
            {s.dayName.slice(0,3)}
          </button>
        ))}
      </div>

      {/* Day Header */}
      <div className="card">
        <div className="day-chip">{day.dayName}</div>
        <div className="workout-title">{day.label}</div>
        <div style={{marginTop:8}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
            <span style={{fontSize:12, color: COLORS.muted}}>{completed}/{total} completed</span>
            <span style={{fontSize:12, color: pct === 1 ? COLORS.success : COLORS.muted}}>{Math.round(pct*100)}%</span>
          </div>
          <div className="macro-bar"><div className="macro-fill" style={{width: `${pct*100}%`, background: pct===1 ? COLORS.success : COLORS.accent}}/></div>
        </div>
      </div>

      {/* Exercises */}
      {day.exercises.map(ex => {
        const isExpanded = expandedEx === ex.id;
        const isDone = checked[ex.id];
        return (
          <div key={ex.id} className="card" style={{cursor:"pointer", borderColor: isDone ? COLORS.success : COLORS.border, transition:"border-color 0.2s"}}>
            <div style={{display:"flex", alignItems:"center", gap:12}} onClick={() => setExpandedEx(isExpanded ? null : ex.id)}>
              <div className={`ex-check ${isDone ? "done" : ""}`} onClick={e => { e.stopPropagation(); toggleCheck(ex.id); }}>
                {isDone ? "✓" : ""}
              </div>
              <div style={{flex:1}}>
                <div className="ex-name">{ex.name}</div>
                <div className="ex-meta">{ex.sets} sets × {ex.reps} · Rest {ex.rest} · {ex.muscle}</div>
              </div>
              <span style={{color: COLORS.muted, fontSize:18}}>{isExpanded ? "▴" : "▾"}</span>
            </div>
            {isExpanded && (
              <div style={{marginTop:14}}>
                <a className="ex-link" href={ex.demo} target="_blank" rel="noreferrer">▶ Watch Demo</a>
                <div style={{marginTop:12}}>
                  {Array.from({length: ex.sets}, (_, i) => (
                    <div key={i} className="set-row">
                      <div style={{fontSize:12, color: COLORS.muted, width:40, paddingTop:9}}>Set {i+1}</div>
                      <input className="set-input" placeholder="kg" type="number" value={(setData[ex.id]?.[i]?.weight) || ""} onChange={e => updateSet(ex.id, i, "weight", e.target.value)}/>
                      <input className="set-input" placeholder="reps" type="number" value={(setData[ex.id]?.[i]?.reps) || ""} onChange={e => updateSet(ex.id, i, "reps", e.target.value)}/>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {pct === 1 && (
        <div style={{textAlign:"center", padding:24, background:"rgba(71,255,154,0.05)", borderRadius:16, margin:"0 16px", border:`1px solid rgba(71,255,154,0.2)`}}>
          <div style={{fontSize:40}}>🎉</div>
          <div className="display-font" style={{fontSize:28, fontWeight:800, textTransform:"uppercase", color: COLORS.success, marginTop:8}}>Workout Complete!</div>
          <div style={{fontSize:13, color: COLORS.muted, marginTop:4}}>Logged and saved</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// NUTRITION SCREEN
// ============================================================

function NutritionScreen({ profile }) {
  const [logs, setLogs] = useState(() => store.get("ff_nutlogs") || []);
  const [form, setForm] = useState({ name: "", cals: "", protein: "" });

  const todayStr = new Date().toISOString().slice(0,10);
  const todayLogs = logs.filter(l => l.date === todayStr);
  const totCals = todayLogs.reduce((s,l) => s + Number(l.cals), 0);
  const totProt = todayLogs.reduce((s,l) => s + Number(l.protein), 0);
  const targetCals = profile.nutrition.calories;
  const targetProt = profile.nutrition.protein;

  function addLog() {
    if (!form.name || !form.cals) return;
    const entry = { ...form, date: todayStr, id: Date.now() };
    const updated = [...logs, entry];
    setLogs(updated);
    store.set("ff_nutlogs", updated);
    setForm({ name: "", cals: "", protein: "" });
  }

  return (
    <div className="scroll-area animate-in">
      <div className="home-header">
        <div className="home-greeting">Daily Intake</div>
        <div className="home-title display-font">Nutrition</div>
      </div>

      {/* Targets */}
      <div className="card">
        <div className="card-title">Daily Targets</div>
        <div style={{display:"flex", gap:16, justifyContent:"space-around", marginBottom:12}}>
          <ProgressRing value={totCals} max={targetCals} color={COLORS.accent} label="Calories" size={64}/>
          <ProgressRing value={totProt} max={targetProt} color={COLORS.blue} label="Protein" size={64}/>
          <ProgressRing value={Math.max(0, targetCals - totCals)} max={targetCals} color={COLORS.muted} label="Remaining" size={64}/>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", marginTop:8}}>
          <span style={{fontSize:13}}><span style={{color:COLORS.accent, fontWeight:700}}>{totCals}</span> / {targetCals} kcal</span>
          <span style={{fontSize:13}}><span style={{color:COLORS.blue, fontWeight:700}}>{totProt}g</span> / {targetProt}g protein</span>
        </div>
        <div className="macro-bar"><div className="macro-fill" style={{width:`${Math.min(totCals/targetCals*100,100)}%`, background:COLORS.accent}}/></div>
        <div className="macro-bar"><div className="macro-fill" style={{width:`${Math.min(totProt/targetProt*100,100)}%`, background:COLORS.blue}}/></div>
      </div>

      {/* Meal Suggestions */}
      <div className="section-title">Today's Meal Plan</div>
      {profile.meals.map((m, i) => (
        <div key={i} className="meal-card" style={{margin:"0 16px 10px"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div className="meal-name">{m.name}</div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13, color:COLORS.accent, fontWeight:700}}>{m.cals} kcal</div>
              <div style={{fontSize:12, color:COLORS.muted}}>{m.protein}g protein</div>
            </div>
          </div>
          <div className="meal-meta" style={{marginTop:6}}>💡 {m.suggestion}</div>
        </div>
      ))}

      {/* Log Meal */}
      <div className="section-title">Log a Meal</div>
      <div style={{padding:"0 16px 8px"}}>
        <input className="log-input" placeholder="Meal name (e.g. Chicken salad)" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}/>
        <div style={{display:"flex", gap:8}}>
          <input className="log-input" placeholder="Calories" type="number" value={form.cals} onChange={e => setForm(f=>({...f,cals:e.target.value}))}/>
          <input className="log-input" placeholder="Protein (g)" type="number" value={form.protein} onChange={e => setForm(f=>({...f,protein:e.target.value}))}/>
        </div>
        <button className="btn-primary" style={{marginTop:0}} onClick={addLog}>+ Log Meal</button>
      </div>

      {/* Today's Log */}
      {todayLogs.length > 0 && (
        <>
          <div className="section-title">Today's Log</div>
          {todayLogs.map(l => (
            <div key={l.id} className="meal-card" style={{margin:"0 16px 8px"}}>
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <span style={{fontWeight:600}}>{l.name}</span>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13, color:COLORS.accent}}>{l.cals} kcal</div>
                  <div style={{fontSize:12, color:COLORS.muted}}>{l.protein || 0}g protein</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ============================================================
// PROGRESS SCREEN
// ============================================================

function ProgressScreen({ profile }) {
  const [weights, setWeights] = useState(() => store.get("ff_weight") || []);
  const [newWeight, setNewWeight] = useState("");
  const [tab, setTab] = useState("weight");

  function logWeight() {
    if (!newWeight) return;
    const entry = { date: new Date().toISOString().slice(0,10), weight: Number(newWeight) };
    const updated = [...weights, entry].slice(-12);
    setWeights(updated);
    store.set("ff_weight", updated);
    setNewWeight("");
  }

  const maxW = Math.max(...weights.map(w => w.weight), 1);
  const minW = Math.min(...weights.map(w => w.weight), 0);
  const range = maxW - minW || 1;
  
  // Mock adherence data for 8 weeks
  const adherenceData = [72, 85, 68, 90, 78, 95, 82, 88];

  return (
    <div className="scroll-area animate-in">
      <div className="home-header">
        <div className="home-greeting">Track Your Journey</div>
        <div className="home-title display-font">Progress</div>
      </div>

      <div className="tab-row">
        {["weight","adherence","strength"].map(t => (
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "weight" && (
        <>
          <div className="card">
            <div className="card-title">Body Weight (kg)</div>
            <div className="chart-area">
              {weights.map((w, i) => (
                <div key={i} className={`chart-bar ${i===weights.length-1?"active":""}`}
                  style={{height: `${Math.max(10, ((w.weight - minW) / range) * 100)}%`}}
                  title={`${w.date}: ${w.weight}kg`}
                />
              ))}
            </div>
            <div style={{display:"flex", justifyContent:"space-between", marginTop:8}}>
              {weights.slice(-4).map((w,i) => (
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:13, fontWeight:700}}>{w.weight}kg</div>
                  <div style={{fontSize:10, color:COLORS.muted}}>{w.date.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <div style={{display:"flex", gap:8}}>
              <input className="log-input" placeholder="Weight in kg" type="number" value={newWeight} onChange={e=>setNewWeight(e.target.value)} style={{margin:0}}/>
              <button className="btn-primary" style={{margin:0, width:"auto", padding:"12px 20px"}} onClick={logWeight}>Log</button>
            </div>
          </div>
        </>
      )}

      {tab === "adherence" && (
        <div className="card">
          <div className="card-title">Weekly Adherence %</div>
          <div className="chart-area">
            {adherenceData.map((v, i) => (
              <div key={i} className={`chart-bar ${i===adherenceData.length-1?"active":""}`}
                style={{height:`${v}%`}} title={`Week ${i+1}: ${v}%`}
              />
            ))}
          </div>
          <div style={{display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12, color:COLORS.muted}}>
            {adherenceData.map((v,i) => <span key={i}>W{i+1}: {v}%</span>)}
          </div>
          <div style={{marginTop:12, padding:"12px", background:COLORS.surface, borderRadius:10}}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <span style={{fontSize:13, color:COLORS.muted}}>8-Week Average</span>
              <span style={{fontSize:15, fontWeight:700, color:COLORS.accent}}>{Math.round(adherenceData.reduce((a,b)=>a+b,0)/adherenceData.length)}%</span>
            </div>
          </div>
        </div>
      )}

      {tab === "strength" && (
        <div>
          {["Barbell Bench Press","Barbell Squat","Deadlift","Overhead Press"].map(ex => {
            const mock = [60,65,65,70,72.5,75];
            const maxV = Math.max(...mock);
            return (
              <div key={ex} className="card">
                <div className="card-title">{ex}</div>
                <div className="chart-area" style={{height:80}}>
                  {mock.map((v,i) => (
                    <div key={i} className={`chart-bar ${i===mock.length-1?"active":""}`}
                      style={{height:`${(v/maxV)*100}%`}}
                    />
                  ))}
                </div>
                <div style={{display:"flex", justifyContent:"space-between", marginTop:6, fontSize:12}}>
                  <span style={{color:COLORS.muted}}>Start: {mock[0]}kg</span>
                  <span style={{color:COLORS.success}}>Current: {mock[mock.length-1]}kg (+{mock[mock.length-1]-mock[0]}kg)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      <div className="section-title">Overview</div>
      <div className="stat-row">
        <div className="stat-box"><div className="stat-value">87%</div><div className="stat-label">Avg Adherence</div></div>
        <div className="stat-box"><div className="stat-value">12</div><div className="stat-label">Workouts Done</div></div>
        <div className="stat-box"><div className="stat-value">+4kg</div><div className="stat-label">Strength Gain</div></div>
      </div>
    </div>
  );
}

// ============================================================
// PROFILE SCREEN
// ============================================================

function ProfileScreen({ profile, onReset }) {
  return (
    <div className="scroll-area animate-in">
      <div className="home-header">
        <div className="home-greeting">Your Account</div>
        <div className="home-title display-font">Profile</div>
      </div>

      <div style={{padding:"0 16px 16px"}}>
        <div className="profile-avatar">{profile.gender === "Male" ? "♂" : "♀"}</div>

        <div className="card">
          <div className="card-title">Training Info</div>
          {[
            ["Gender", profile.gender],
            ["Goal", profile.goal],
            ["Training Days", `${profile.days}×/week`],
            ["Experience Level", profile.level],
            ["Training System", profile.system],
          ].map(([label, value]) => (
            <div key={label} className="info-row">
              <span className="info-label">{label}</span>
              <span className="info-value">{value}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{marginTop:14}}>
          <div className="card-title">Nutrition Targets</div>
          {[
            ["Daily Calories", `${profile.nutrition.calories} kcal`],
            ["Daily Protein", `${profile.nutrition.protein}g`],
            ["Estimated TDEE", `${profile.nutrition.tdee} kcal`],
          ].map(([label, value]) => (
            <div key={label} className="info-row">
              <span className="info-label">{label}</span>
              <span className="info-value" style={{color: COLORS.accent}}>{value}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{marginTop:14}}>
          <div className="card-title">Weekly Schedule</div>
          {profile.schedule.map((s, i) => (
            <div key={i} className="info-row">
              <span className="info-label">{s.dayName}</span>
              <span className="info-value" style={{fontSize:13, maxWidth:"65%", textAlign:"right"}}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{marginTop:14}}>
          <div className="card-title">PWA Info</div>
          <div style={{fontSize:13, color: COLORS.muted, lineHeight:1.7}}>
            Install this app on your home screen for the best experience. Tap your browser's share button and select "Add to Home Screen".
            Works offline. Data saved locally.
          </div>
        </div>

        <button
          onClick={onReset}
          style={{width:"100%", marginTop:20, background:"rgba(255,71,71,0.1)", color:COLORS.red, border:`1px solid rgba(255,71,71,0.3)`, borderRadius:12, padding:16, fontSize:16, fontWeight:700, cursor:"pointer"}}>
          Reset & Start Over
        </button>
      </div>
    </div>
  );
}

// ============================================================
// BOTTOM NAV
// ============================================================

const NAV_ITEMS = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "workout", icon: "🏋️", label: "Workout" },
  { id: "nutrition", icon: "🥗", label: "Nutrition" },
  { id: "progress", icon: "📈", label: "Progress" },
  { id: "profile", icon: "👤", label: "Profile" },
];

// ============================================================
// MAIN APP
// ============================================================

export default function FitForgeApp() {
  const [profile, setProfile] = useState(() => store.get("ff_profile"));
  const [logs] = useState(() => store.get("ff_logs") || []);
  const [screen, setScreen] = useState("home");

  function handleComplete(p) { setProfile(p); setScreen("home"); }
  function handleReset() { localStorage.clear(); setProfile(null); setScreen("home"); }

  return (
    <>
      <style>{globalCSS}</style>
      <div className="ff-app">
        {!profile ? (
          <Onboarding onComplete={handleComplete} />
        ) : (
          <>
            {screen === "home" && <HomeScreen profile={profile} logs={logs} />}
            {screen === "workout" && <WorkoutScreen profile={profile} />}
            {screen === "nutrition" && <NutritionScreen profile={profile} />}
            {screen === "progress" && <ProgressScreen profile={profile} />}
            {screen === "profile" && <ProfileScreen profile={profile} onReset={handleReset} />}

            <nav className="bottom-nav">
              {NAV_ITEMS.map(item => (
                <div key={item.id} className={`nav-item ${screen === item.id ? "active" : ""}`} onClick={() => setScreen(item.id)}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </div>
              ))}
            </nav>
          </>
        )}
      </div>
    </>
  );
}
