# 💪 rba | fit

A progressive 18-week strength and power training PWA (Progressive Web App) with smart tracking, in-app exercise guides, and comprehensive workout programming.

[**🔗 Live Demo**](https://rbaxabr.github.io/rba-fit) | [📱 Install as App](#installation)

---

## 🎯 Overview

**rba | fit** is a comprehensive fitness tracking application designed for a complete 18-week strength, hypertrophy, and power development program. Built as a single-file Progressive Web App, it works offline and can be installed on any device.

### Key Features

- ✅ **18-Week Progressive Program** with 4 distinct training phases plus deload weeks
- ✅ **Smart Weight Tracking** with automatic recommendations and set-by-set progression
- ✅ **In-App Exercise Guides** with expandable instructions, coaching cues, and progressions
- ✅ **Supplement Tracking** with daily schedules and progress monitoring
- ✅ **Progress Visualization** with Apple Watch-style activity rings
- ✅ **Phase-Based Programming** that adapts workouts based on training week
- ✅ **PWA Technology** - install on any device, works offline
- ✅ **Local Storage** - all data stored on device, no cloud dependency

---

## 🏋️ Training Philosophy

### Program Structure

**Week 0:** Prep Week - Movement preparation and assessment

**Phase 1 (Weeks 1-4):** Foundation  
- Focus: Work capacity and movement quality
- Rep Range: 12-15
- Goal: Build base fitness

**Phase 2 (Weeks 5-8):** Strength Building  
- Focus: Progressive overload
- Rep Range: 8-12
- Goal: Develop strength foundation

**Week 9:** Deload #1 - Active recovery and mobility

**Phase 3 (Weeks 10-13):** Hypertrophy Peak  
- Focus: Maximum muscle growth
- Rep Range: 10-15, high volume
- Goal: Visible size gains

**Week 14:** Deload #2 - Recovery and regeneration

**Phase 4 (Weeks 15-18):** Peak Performance  
- Focus: Elite strength and power
- Rep Range: 6-10, heavy loads
- Goal: Maximum strength expression

### Weekly Split

- **Monday:** Lower Body (Quads, Glutes, Hamstrings)
- **Tuesday:** Upper Body (Chest, Back, Shoulders)
- **Wednesday:** Explosive Training (Plyometrics, Sprint Mechanics)
- **Thursday:** Full Body Power
- **Friday:** Upper Volume (Arms, Shoulders, Chest, Back)
- **Saturday:** Athletic Performance (Speed, Agility, Power)
- **Sunday:** Active Recovery

---

## 🛠️ Technical Details

### Built With

- **Pure JavaScript** - No frameworks or dependencies
- **Tailwind CSS** - Via CDN for styling
- **LocalStorage API** - Client-side data persistence
- **PWA Manifest** - Installable progressive web app
- **Service Workers** - Offline functionality (future enhancement)

### Architecture

**Single-File Design:**  
The entire application is contained in a single HTML file (~121 KB), making it:
- Easy to deploy
- Fast to load
- Simple to maintain
- Works offline by default

**State Management:**
```javascript
const state = {
    currentWeek: getCurrentWeek(),
    completedExercises: {},
    exerciseWeights: {},
    supplementLog: {},
    expandedItems: {}
}
```

**Smart Features:**
- Automatic weight recommendations based on previous sets
- Phase-based workout adaptation
- Equipment-aware weight selection (matches available KB/DB weights)
- Progressive exercise difficulty across phases

---

## 🚀 Installation

### As a Web App

1. **Visit the live site:** [rbaxabr.github.io/rbafit](https://rbaxabr.github.io/rbafit/)
2. **Install as app:**
   - **iOS:** Safari → Share → Add to Home Screen
   - **Android:** Chrome → Menu → Add to Home Screen
   - **Desktop:** Chrome → Install App icon in address bar

### Local Development

```bash
# Clone the repository
git clone https://github.com/rbaxabr/rba-fit.git

# Navigate to directory
cd rba-fit

# Open in browser
open index.html

# Or serve with any HTTP server
python -m http.server 8000
```

No build process required - just open `index.html` in a browser!

---

## 💾 Data Management

### Local Storage

All data is stored locally on your device using the browser's LocalStorage API:

- ✅ **Workout Progress** - Exercise completion status
- ✅ **Weight History** - Set-by-set weight tracking with recommendations
- ✅ **Supplement Logs** - Daily supplement completion (7-day history)
- ✅ **Current Week** - Automatic week calculation with manual override
- ✅ **UI State** - Expanded sections, last viewed workout

### Data Persistence

```javascript
// Example: Weight tracking across sets and weeks
{
  "8-Goblet Squats-0": 35,  // Week 8, Exercise, Set 0
  "8-Goblet Squats-1": 35,
  "8-Goblet Squats-2": 40   // User increased weight on set 3
}
```

### Privacy

- ✅ **No cloud storage** - everything stays on your device
- ✅ **No user accounts** - no registration or login required
- ✅ **No analytics** - no tracking or telemetry
- ✅ **No ads** - completely free and clean

---

## 📱 Features Deep Dive

### Smart Weight Tracking

The app intelligently recommends weights based on:
1. Previous set in current workout
2. Same exercise in previous week
3. Equipment availability (rounds to nearest KB/DB weight)
4. Phase progression (automatic weight scaling)

**Example:**
```
Week 8, Set 1: 35 lbs (from last week)
Week 8, Set 2: 35 lbs (copied from Set 1)
Week 8, Set 3: 40 lbs (user increased)
Week 9, Set 1: 40 lbs (starts from last completed set)
```

### In-App Exercise Guides

Click "How to Perform" on key exercises to see:
- **Setup:** Equipment positioning and body placement
- **Execution:** Step-by-step movement instructions
- **Coaching Cues:** Mental cues for proper form
- **Progressions:** How difficulty increases across phases
- **Safety Notes:** Important warnings and modifications

**Exercises with guides:**
- Band Sprint Drives (sprint mechanics with mini bands)
- Fast Feet Drills (3 variations for foot speed)
- Ladder Drills (4 agility patterns)
- Copenhagen Plank (adductor strengthening)
- KB Windmill (mobility and core stability)

### Phase-Based Adaptation

Workouts automatically adapt based on training week:

**Phase 1-2 (Weeks 1-8):** Enhanced core exercises
- Copenhagen Plank (vs standard plank)
- KB Plank Pull-Through (vs medicine ball twists)
- KB Windmill (vs ball pikes)

**Phase 3 (Weeks 10-13):** Full plyometric programming
- 180° Box Jumps, Depth Jumps
- Ladder drills with complex patterns
- Band resisted sprint work

**Phase 4 (Weeks 15-18):** Elite power development
- Reactive box jumps
- Sprint mechanics testing
- Performance benchmarking

### Progress Tracking

**Three Activity Rings (Apple Watch Style):**
1. **Program Progress** - Overall completion (0-100%)
2. **Week Progress** - Current week completion
3. **Daily Supplements** - Today's supplement adherence

---

## 🎨 Design Philosophy

### User Experience

- **Mobile-First:** Optimized for phone use during workouts
- **One-Handed Operation:** Large touch targets, thumb-friendly layout
- **Progressive Disclosure:** Details hidden until needed (expandable sections)
- **Instant Feedback:** Immediate visual confirmation of actions
- **Offline-First:** Works without internet connection

### Visual Design

- **Dark Theme:** Easy on eyes in gym lighting
- **Color Coding:** 
  - Blue: Primary actions and progress
  - Green: Completed items
  - Purple/Pink: Supplements
  - Yellow: Warnings and tips
- **Gradient Accents:** Modern, energetic aesthetic
- **Smooth Animations:** CSS transitions for polished feel

---

## 🔧 Customization

### Easy Modifications

The single-file design makes customization straightforward:

**Change workout schedule:**
```javascript
// Edit baseWorkouts object (line ~xxx)
monday: {
    name: 'Your Workout',
    exercises: [...]
}
```

**Add exercise guides:**
```javascript
// Add to exerciseGuides object (line ~xxx)
'Exercise Name': {
    setup: ['step 1', 'step 2'],
    execution: ['step 1', 'step 2'],
    cues: ['cue 1', 'cue 2']
}
```

**Adjust phase logic:**
```javascript
// Modify getPhase() function (line ~xxx)
function getPhase(week) {
    if (week <= 4) return 1;
    // ... your custom phases
}
```

---

## 🙏 Acknowledgments

- **Program Design:** Based on evidence-based strength and power development principles
- **UI Inspiration:** Apple Watch activity rings, modern fitness app design patterns
- **Icons:** System emoji for broad compatibility

---

## 🏆 Why This Project?

This project demonstrates:
- ✅ **Vanilla JavaScript mastery** - No frameworks, pure DOM manipulation
- ✅ **State management** - Complex app state without external libraries
- ✅ **Progressive Web App development** - PWA manifest, installability
- ✅ **User-centered design** - Built for real-world workout tracking
- ✅ **Performance optimization** - Single-file architecture, fast load times
- ✅ **Local-first architecture** - Privacy-respecting, offline-capable
- ✅ **Product thinking** - Solved real user needs (my own training program!)

---

**Built with 💪 for serious training**
