# [Kitty Cones](https://kitty-cones.pages.dev/)

## Game Description
You're the head server at Kitty Cones, a cute little ice cream shop that caters to catty customers. Your first shift just started, so get to work! Match customer orders by selecting the correct cone and scoop combinations before time runs out. 

## Video Demo (Link)
[![Watch the demo](./public/assets/video-thumbnail.png)](https://www.loom.com/share/cf84d44bc4db4eb9bf1ffc3a66f3ce06?sid=91524d9a-ad86-4ef5-819f-293d9d337df3)


### Features
✦ Cute animated cat customers

✦ Fast-paced gameplay with a timer

✦ Playful background music and sound effects

✦ Responsive design for mobile and desktop

### How to Play
1. Check customer order
2. Click matching cone
3. Click matching scoop(s)
4. Click customer to serve
5. ??????????????????????
6. Profit

### Game Modes
✦ **Normal Mode**: Standard gameplay where your catty customers slowly move across the screen

✦ **Rush Hour Mode**: Faster and more challenging gameplay where customers move much quicker
<br>These modes can be switched back and forth in-game. Toggle the mode to Rush Hour to kick things into high gear and get customers moving faster; if it's too much, you can switch right back to Normal Mode to slow customers down.

### Technical Details
✦ Built with React using React Router and context

✦ Responsive design using CSS Flexbox and Grid

✦ Local storage for saving high scores

✦ Global leaderboard integration using Val Town

### Dependencies
✦ React

✦ React Router

✦ Material UI Icons

✦ Radix UI Buttons

✦ Motion Animations

### How it Works
On load, main.jsx mounts App inside BrowserRouter and a Radix Theme. App wraps everything in GameProvider (our GameContext) which holds coins, high scores (localStorage), audio/mode toggles, pause state, and global leaderboard fetch/submit. 

App renders global controls (pause, Rush Hour, sound/music), a background image, and routes: home/about/leaderboard go through Layout (with animated kitties); /game renders the game; /game-over shows results. The game screen uses the useGame hook: it preloads sounds, generates cat orders, and runs a 45s timer and a movement loop that scrolls cats across the screen (both respect Pause; Rush Hour increases speeds). Players click a cone stand, add scoops, then click a cat/order bubble; useGame validates cone and exact scoop sequence, awards coins (+20/25/30) or subtracts 5, triggers animations/SFX, and replaces served cats. 

When time hits zero, useGame asks GameContext to check for a high score; if it qualifies, InitialsModal collects initials, saves top 10 locally, submits to Val.town, and then navigates to /game-over. The Game Over and Leaderboard screens display the local top 10 and fetched global scores.

<img width="1920" height="700" alt="architecture" src="https://github.com/user-attachments/assets/b765568e-cb63-413d-8966-5b88b688aad8" />

