\# 🥊 Boxing Duel: Pixel Punch Arena



> A retro-style 2D boxing game built with HTML, CSS, and JavaScript.  

> Play locally with a friend — punch, dodge, and deliver the final KO!



---



\## 🎮 Game Overview



\*\*Boxing Duel: Pixel Punch Arena\*\* is a \*\*local two-player pixel-art fighting game\*\* that brings classic arcade vibes to the browser.  

Each player controls a pixel boxer and lands punches to drain the opponent’s health bar.  

The first player to hit \*\*0 HP\*\* loses — and the crowd goes wild!



---



\## 🧱 Features



\- 🎨 \*\*Pixel-Art Design\*\* — retro arena, glowing lights, and pixel-perfect fighters.  

\- ⚔️ \*\*2-Player Offline Mode\*\* — both players share the same keyboard.  

\- 💥 \*\*Dynamic Combat System\*\* — each punch deals random damage (5–15 HP).  

\- 💫 \*\*Smooth Animations\*\* — CSS keyframes for punches, hits, and KO effects.  

\- 🔊 \*\*Sound Effects\*\* — classic punch, crowd cheer, and victory bell tones.  

\- 🚀 \*\*Expandable\*\* — easy to extend to online multiplayer with Socket.io.



---



\## 🕹️ Controls



| Player | Action | Key |

|:-------:|:--------|:----:|

| 🧑‍🦱 Player 1 | Punch | `A` |

| 🧑‍🦰 Player 2 | Punch | `L` |



> Each punch has a cooldown of 0.7 seconds to prevent spam.  

> The player whose HP drops to 0 first \*\*loses the match\*\*.



---



\## ⚙️ Gameplay Flow



1\. \*\*Start Screen\*\*  

&nbsp;  - Title + “Start Fight” button  

&nbsp;  - Retro pixel background \& background music



2\. \*\*Arena Screen\*\*  

&nbsp;  - Two boxers face off with visible HP bars  

&nbsp;  - Players punch until one’s HP hits zero  

&nbsp;  - “KO!” text flashes across the screen  



3\. \*\*Victory Screen\*\*  

&nbsp;  - “PLAYER X WINS!” text displayed  

&nbsp;  - “Restart” button to play again  



---



\## 🎨 Design \& Styling



\- \*\*Color Palette:\*\*  

&nbsp; - Arena: `#2b2b52`  

&nbsp; - Player 1 (Red): `#ff4757`  

&nbsp; - Player 2 (Blue): `#1e90ff`  

&nbsp; - HP Bars: Gradient from `#ff6b6b` → darker shade  

&nbsp; - UI Text: `#f1f2f6`  



\- \*\*Font:\*\* \[`Press Start 2P`](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts)  

\- \*\*Animations:\*\*  

&nbsp; - `punch` — forward jab movement  

&nbsp; - `hitFlash` — brightness flicker on impact  

&nbsp; - `shake` — horizontal camera shake  

&nbsp; - `fadeIn` — KO and overlay effects  

&nbsp; - `breathing` — idle bounce loop



\- \*\*Audio Cues:\*\*  

&nbsp; - Punch impact  

&nbsp; - KO bell ring  

&nbsp; - Crowd cheer  

&nbsp; - Background retro music loop  



---



\## 🧩 Tech Stack



| Component | Technology |

|------------|-------------|

| 🎨 Frontend | HTML5 + CSS3 + JavaScript (Vanilla) |

| 🎵 Audio | Native `<audio>` elements |

| 💡 Fonts | Google Fonts (Press Start 2P) |

| 🕹️ Logic | Event listeners + DOM manipulation |

| 🌈 Effects | CSS Keyframes \& Transitions |



---



\## 🧠 Game Logic Breakdown



| Mechanic | Description |

|-----------|-------------|

| Health System | Each fighter starts with 100 HP |

| Damage | Random between 5–15 HP |

| Collision | Static hitbox detection (simple proximity check) |

| Cooldown | 700 ms between punches |

| KO Trigger | HP ≤ 0 → show KO animation and stop game loop |

| Restart | Resets HP and repositions fighters |



---



\## 🚀 How to Run Locally



1\. Clone the repository:

&nbsp;  ```bash

&nbsp;  git clone https://github.com/yourusername/boxing-duel.git



