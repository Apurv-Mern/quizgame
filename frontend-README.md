# Quiz Game - React Applications

Three React 18 applications for the interactive quiz game.

## Applications

### 1. Participant Mobile App (Port 3000)
Mobile-first interface for quiz participants.

**Features:**
- QR code landing with nickname entry
- One-hand optimized UI
- Real-time question receiving
- Double-tap answer submission
- Live score & rank updates
- Connection status monitoring

**Run:**
```bash
cd participant-app
npm install
npm run dev
```

### 2. Host Dashboard (Port 3002)
Desktop dashboard for quiz host control.

**Features:**
- Game flow controls (start/end questions)
- Live participant count
- Real-time answer monitoring
- Live leaderboard display
- Statistics panel
- Emergency controls (pause/end game)

**Run:**
```bash
cd host-dashboard
npm install
npm run dev
```

### 3. Display Screen (Port 3003)
Big screen presentation mode for live events.

**Features:**
- Waiting room with participant count
- Full-screen question display
- Animated top 10 leaderboard
- Auto-switching views
- Presentation-ready design

**Run:**
```bash
cd display-screen
npm install
npm run dev
```

## Architecture

### Shared Socket Service Pattern
All apps use a similar WebSocket service:

```javascript
// services/socket.js
import { io } from 'socket.io-client';

class SocketService {
  connect() { /* WebSocket connection */ }
  emit(event, data) { /* Send to server */ }
  on(event, callback) { /* Listen to events */ }
  disconnect() { /* Clean up */ }
}
```

### State Management
React hooks-based state management:
- `useReducer` for complex state logic
- `useState` for local component state
- `useEffect` for socket event listeners

## Environment Variables

Create `.env` file in each app:

```env
VITE_SOCKET_URL=http://localhost:3001
```

For production:
```env
VITE_SOCKET_URL=https://your-backend-domain.com
```

## Build for Production

```bash
# Build all apps
cd participant-app && npm run build
cd ../host-dashboard && npm run build
cd ../display-screen && npm run build

# Output in dist/ folder for each app
```

## Deployment

### Option 1: Static Hosting (Recommended)
Deploy each `dist/` folder to:
- **Vercel** / **Netlify** (automatic builds)
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**

### Option 2: Single Server
Serve all apps from Express backend:

```javascript
// In backend server.js
app.use('/participant', express.static('../participant-app/dist'));
app.use('/host', express.static('../host-dashboard/dist'));
app.use('/display', express.static('../display-screen/dist'));
```

## Tech Stack

- **React 18.2** - Latest React with concurrent features
- **Vite 5** - Fast build tool and dev server
- **Socket.IO Client 4.6** - WebSocket communication
- **Vanilla CSS** - No framework dependencies
- **ES6 Modules** - Modern JavaScript

## Key Features

### Mobile Optimization (Participant App)
- Viewport meta tags for mobile
- Touch-friendly buttons (48px+ targets)
- One-hand thumb zone layout
- Pull-to-refresh disabled
- Connection resilience with retry logic

### Responsive Design
All apps work on:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large displays (1920px+)

### Real-time Updates
- Event-driven architecture
- Optimistic UI updates
- Automatic reconnection
- Graceful error handling

## Component Structure

### Participant App
```
src/
├── App.jsx                    # Main app with routing
├── components/
│   ├── NicknameEntry.jsx     # Landing screen
│   ├── WaitingRoom.jsx       # Pre-game lobby
│   ├── QuestionView.jsx      # Question display
│   ├── ResultsView.jsx       # Question results
│   └── ConnectionStatus.jsx  # Connection indicator
├── services/
│   └── socket.js             # WebSocket service
└── styles/
    ├── global.css            # Global styles
    └── *.css                 # Component styles
```

### Host Dashboard
```
src/
├── App.jsx                    # Main dashboard
├── components/
│   ├── Header.jsx            # Top navigation
│   ├── GameControls.jsx      # Control buttons
│   ├── StatsPanel.jsx        # Live statistics
│   ├── LiveAnswers.jsx       # Real-time answers
│   └── LeaderboardPanel.jsx  # Sidebar leaderboard
└── ...
```

### Display Screen
```
src/
├── App.jsx                    # View switcher
├── components/
│   ├── WaitingScreen.jsx     # Pre-game display
│   ├── QuestionDisplay.jsx   # Question view
│   └── Leaderboard.jsx       # Leaderboard view
└── ...
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

## Performance

- Initial load: < 2s on 3G
- Bundle sizes (gzipped):
  - Participant: ~45KB
  - Host: ~48KB
  - Display: ~42KB
- 60fps animations
- < 100ms WebSocket latency

## Development Tips

### Hot Reload
Vite provides instant HMR (Hot Module Replacement).

### Debugging
```javascript
// Enable Socket.IO debug logs
localStorage.setItem('debug', 'socket.io-client:*');
```

### Testing Mobile
```bash
# Run on network (accessible from phone)
npm run dev -- --host
# Access via http://<your-ip>:3000
```

## Troubleshooting

**WebSocket Connection Failed:**
- Check backend is running on port 3001
- Verify CORS settings in backend
- Check firewall/network restrictions

**Styling Issues:**
- Clear browser cache
- Check CSS import order
- Verify Vite config

**State Not Updating:**
- Check socket event names match backend
- Verify reducer actions
- Use React DevTools to inspect state

## License

MIT
