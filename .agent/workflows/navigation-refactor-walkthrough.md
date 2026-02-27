# Navigation Refactor — Full Walkthrough & Decision Log
**Project:** express-music (React Native / Expo Router)
**Date:** 2026-02-28
**Author:** Antigravity (AI Pair Programmer)

---

## Table of Contents
1. [The Starting Point — What We Inherited](#1-the-starting-point)
2. [The Core Confusion — Two Navigation Worlds](#2-the-core-confusion)
3. [Diagnosing Every Broken Piece](#3-diagnosing-every-broken-piece)
4. [Understanding How Expo Router Actually Works](#4-understanding-how-expo-router-works)
5. [The Decision — Why We Chose Expo Router Over Manual Navigation](#5-the-decision)
6. [Step-by-Step Changes Made](#6-step-by-step-changes)
7. [The Final Architecture](#7-final-architecture)
8. [Rules to Follow Going Forward](#8-rules-going-forward)
9. [Glossary](#9-glossary)

---

## 1. The Starting Point

When we opened the project, two files were active:

- `app/_layout.tsx` — the root layout
- `navigation/stacks/stack_navigation.tsx` — a manual stack navigator

At a glance the project looked functional. But once we mapped every file in the `app/` and `navigation/` directories, the real picture emerged — a navigation system that was **split across two completely different paradigms** that don't talk to each other.

---

## 2. The Core Confusion

### Two Navigation Paradigms Were Mixed

| Paradigm | Files Using It | How It Works |
|---|---|---|
| **Expo Router** (file-based) | `app/_layout.tsx`, `app/(app)/_layout.tsx` | Routes are inferred automatically from the file system. A file at `app/(tabs)/index.tsx` becomes the `/` route inside a tabs group. |
| **React Navigation** (manual) | `navigation/Tabs/tab-layout.tsx`, `navigation/stacks/stack_navigation.tsx` | You manually create navigators with `createStackNavigator()` or `createBottomTabNavigator()` and wire up screens explicitly in JSX. |

> ⚠️ **These two systems cannot coexist as the primary routing layer.** Expo Router IS built on top of React Navigation internally, but it takes full ownership of routing. You cannot define routes manually and also expect Expo Router to respect them.

The project's `package.json` confirmed the entry point:
```json
"main": "expo-router/entry"
```

This single line means **Expo Router is the routing authority**. The `navigation/` folder was completely invisible to it.

---

## 3. Diagnosing Every Broken Piece

### Problem 1 — `app/_layout.tsx` Referenced Routes That Did Not Exist

```tsx
// app/_layout.tsx (BEFORE)
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="(modals)" options={{ headerShown: false, presentation: "modal" }} />
</Stack>
```

- `(tabs)` → The folder `app/(tabs)/` **did not exist**
- `(modals)` → The folder `app/(modals)/` **did not exist**

In Expo Router, `Stack.Screen name="(tabs)"` tells the router "there is a route group at `app/(tabs)/`". When that folder does not exist, the router either crashes, shows a blank screen, or throws a "route not found" error at runtime.

**This is the #1 reason the app would not render correctly on Android or in the browser.**

---

### Problem 2 — The Tab Layout Was Orphaned

```
navigation/Tabs/tab-layout.tsx   ← Valid Tabs JSX, but expo-router never loads it
```

The file `navigation/Tabs/tab-layout.tsx` was a perfectly written `<Tabs>` navigator. However, because it lived **outside the `app/` directory**, Expo Router never registered it as a route. It was dead code — it existed, it compiled, but it never executed.

This is why the app had **no tab bar** — the tab bar component existed but was never mounted.

---

### Problem 3 — Stack Navigator Was an Architectural Conflict

```tsx
// navigation/stacks/stack_navigation.tsx (BEFORE)
import { createStackNavigator } from '@react-navigation/stack'
const stack = createStackNavigator()

function StackNavigation() {
  return (
    <stack.Navigator>
      <stack.Screen name="Home" component={Home} />  // ← 'Home' was not imported!
    </stack.Navigator>
  )
}
```

Beyond being orphaned (never imported anywhere), this file had its own additional bug: it referenced a `Home` component that was never imported. It would throw a `ReferenceError` if ever rendered.

More importantly, using `createStackNavigator` alongside an Expo Router project **duplicates the navigation layer**, which creates:
- Double navigation state
- Broken back-button behaviour
- Conflicts with deep linking
- Conflicts with the hardware back button on Android

---

### Problem 4 — `(app)/_layout.tsx` Was Mis-Identified as Modals

```tsx
// app/(app)/_layout.tsx (BEFORE)
const ModalsLayout = () => {   // ← Named "Modals" but used for detail screens
  return <Stack screenOptions={{ headerShown: false }} />
}
```

The component was named `ModalsLayout`, suggesting it was meant to present modal sheets. But the root layout called it with `presentation: "modal"` for a group named `(modals)` — not `(app)`. The actual `(app)` group (which had `recentlyplayed.tsx` inside it) was never even registered in `_layout.tsx`, so navigating from `LibraryScreen` with `href="/(app)/recentlyplayed"` would fail silently or crash.

---

## 4. Understanding How Expo Router Works

Before making any changes, it was critical to lock in the mental model of Expo Router's rules:

### Rule 1 — The `app/` Directory IS the Router
Every file inside `app/` becomes a route automatically:
```
app/index.tsx         → renders at "/"
app/search.tsx        → renders at "/search"
app/(tabs)/index.tsx  → renders at "/" inside a tabs group
```

### Rule 2 — Parentheses `()` Create Route Groups
A folder name wrapped in parentheses (e.g. `(tabs)`, `(app)`) creates a **group** that doesn't affect the URL path. It's purely an organisational and layout tool.

```
app/(tabs)/index.tsx   → still navigates to "/" but uses (tabs)/_layout.tsx as wrapper
app/(app)/recentlyplayed.tsx → navigates to "/recentlyplayed" using (app)/_layout.tsx
```

### Rule 3 — `_layout.tsx` Files Define the Shell
A `_layout.tsx` inside any folder defines the navigator (Stack, Tabs, Drawer) that wraps all sibling files.

```
app/(tabs)/_layout.tsx  → defines the bottom tab bar
app/(app)/_layout.tsx   → defines a stack for detail pages
app/_layout.tsx         → defines the root stack that contains everything
```

### Rule 4 — `Stack.Screen name="(tabs)"` Needs the Folder to Exist
If you declare a `Stack.Screen` in a layout, Expo Router looks for that exact folder name inside `app/`. If the folder doesn't exist, the route doesn't exist.

---

## 5. The Decision — Why Expo Router Over Manual Navigation

We had two options:

### Option A — Go Full Manual (`@react-navigation`)
- Delete Expo Router
- Change `"main"` in `package.json` away from `expo-router/entry`
- Wire all navigators manually
- **Verdict: ❌ Too destructive.** Would require rewriting every screen import and every `Link` and `useRouter` call already in the codebase.

### Option B — Go Full Expo Router (File-Based)
- Delete the orphaned `navigation/` folder files
- Create the missing `app/(tabs)/` directory with screen files
- Fix `app/_layout.tsx` to reference routes that actually exist
- **Verdict: ✅ Chosen.** The codebase already used `expo-router` APIs everywhere (`Link`, `useRouter`, `Stack`, `Tabs` from `expo-router`). This was the intended architecture.

---

## 6. Step-by-Step Changes Made

### Step 1 — Created `app/(tabs)/_layout.tsx`

**Why:** The tab bar layout must live at this exact path for Expo Router to pick it up.

**What changed:** Moved the tab definitions from `navigation/Tabs/tab-layout.tsx` into the correct location, and improved tab bar styling (active color, dark mode background, font weight).

```
navigation/Tabs/tab-layout.tsx  (was: valid but orphaned)
        ↓
app/(tabs)/_layout.tsx          (now: active, expo-router loads it)
```

---

### Step 2 — Created `app/(tabs)/index.tsx`, `search.tsx`, `library.tsx`

**Why:** A `Tabs.Screen name="index"` inside `(tabs)/_layout.tsx` needs a corresponding file `app/(tabs)/index.tsx` to render. Without these files, clicking a tab shows nothing.

**Pattern used:** Each tab file is a **thin wrapper** — it imports a screen component from `screens/` and renders it. This keeps routing logic separate from UI logic.

```
app/(tabs)/index.tsx    → renders HomeScreen (placeholder → LibraryScreen for now)
app/(tabs)/search.tsx   → renders SearchTab (placeholder)
app/(tabs)/library.tsx  → renders LibraryScreen
```

---

### Step 3 — Fixed `app/_layout.tsx`

**Why:** Removed broken references to `(tabs)` and `(modals)` that had no matching folders, and added the correct `(app)` group that was missing.

**Before:**
```tsx
<Stack.Screen name="(tabs)" … />    // ❌ folder didn't exist
<Stack.Screen name="(modals)" … />  // ❌ folder didn't exist, wrong name
```

**After:**
```tsx
<Stack.Screen name="(tabs)" … />    // ✅ app/(tabs)/ now exists
<Stack.Screen name="(app)" … />     // ✅ app/(app)/ exists, correct name
<Stack.Screen name="+not-found" />  // ✅ catch-all 404
```

---

### Step 4 — Fixed `app/(app)/_layout.tsx`

**Why:** The component was confusingly named `ModalsLayout`. It was renamed `AppLayout` to reflect its true purpose: a stack for full-screen detail pages (like `recentlyplayed`). Added `slide_from_right` animation for proper push-navigation feel.

---

### Step 5 — Deprecated `navigation/` Folder Files

**Why:** Rather than deleting them immediately (which could surprise the developer), we replaced the code in `navigation/Tabs/tab-layout.tsx` and `navigation/stacks/stack_navigation.tsx` with deprecation notices explaining:
- Why the file is not used
- Where the active equivalent lives
- That the file (and the whole `navigation/` folder) can be safely deleted

---

## 7. The Final Architecture

```
app/
 ├── _layout.tsx                  ← Root Stack
 │    │                               Providers: AudioPlayerProvider, ThemeProvider
 │    │                               Persistent UI: MiniPlayer
 │    │
 │    ├── (tabs)/                 ← Bottom Tab Navigator group
 │    │    ├── _layout.tsx        ← Defines: Home | Search | Library tabs
 │    │    ├── index.tsx          ← Home tab screen
 │    │    ├── search.tsx         ← Search tab screen
 │    │    └── library.tsx        ← Library tab screen
 │    │
 │    └── (app)/                  ← Detail Screen Stack group (full-screen, no tabs)
 │         ├── _layout.tsx        ← Stack with slide_from_right
 │         └── recentlyplayed.tsx ← Full list of recently played songs
 │
 ├── +html.tsx                    ← Web-only HTML shell
 └── +not-found.tsx               ← 404 fallback

screens/                          ← Reusable, framework-agnostic screen components
 ├── library-screen.tsx
 └── recently-played.tsx

features/                         ← Feature-based components and hooks
 ├── library/
 ├── player/
 ├── search/
 └── universal/

core/                             ← App-wide providers and utilities
 ├── audio-player.tsx
 └── media-library.tsx

navigation/                       ← ⚠️ DEPRECATED — safe to delete
 ├── Tabs/tab-layout.tsx
 └── stacks/stack_navigation.tsx
```

---

## 8. Rules Going Forward

| What you want to do | Where to put it |
|---|---|
| Add a new bottom tab | `app/(tabs)/yourscreen.tsx` + register in `app/(tabs)/_layout.tsx` |
| Add a detail/push screen (no tab bar) | `app/(app)/yourscreen.tsx` |
| Add a modal screen | Create `app/(modals)/` group with its own `_layout.tsx` using `presentation: 'modal'` |
| Add shared UI logic | `features/yourfeature/components/` or `core/` |
| Share a screen between tabs | Put it in `screens/` and import it from the tab file |
| Never do this | Manually create `createStackNavigator` or `createBottomTabNavigator` — use Expo Router's file system instead |

---

## 9. Glossary

| Term | Meaning |
|---|---|
| **Expo Router** | A file-based routing library for React Native built on top of React Navigation. Routes are defined by files in the `app/` directory. |
| **Route Group** | A folder wrapped in `()` (e.g. `(tabs)`) that organises routes without affecting the URL. |
| **`_layout.tsx`** | A special file that defines the navigator (Stack, Tabs) wrapping all siblings in the same folder. |
| **Thin Wrapper** | A route file that only imports and renders a screen component — no layout logic of its own. Keeps routing separate from UI. |
| **Orphaned File** | A file that compiles without errors but is never imported or loaded by the app — effectively dead code. |
| **Paradigm Conflict** | When two systems (Expo Router + manual React Navigation) both try to own routing, causing undefined behaviour. |

---

*This document was generated as part of the navigation refactor session on 2026-02-28.*
