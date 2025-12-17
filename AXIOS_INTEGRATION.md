# Axios Integration - Frontend Apps

## ✅ Axios Installed in All Apps

Axios has been successfully installed in:
- host-dashboard
- participant-app  
- display-screen

## 📁 New API Service Files

### Host Dashboard
**File:** `src/services/api.js`
- Centralized axios instance with interceptors
- `gameAPI` - Game status and health check
- `questionsAPI` - Questions CRUD operations
- Auto error handling and logging

**File:** `src/services/questionsAPI.js` (Updated)
- Now uses axios instead of fetch
- 10-second timeout
- Proper error handling with response interceptors

### Participant App
**File:** `src/services/api.js`
- Axios instance for game APIs
- Health check endpoint
- Request/response interceptors
- Standardized error messages

### Display Screen
**File:** `src/services/api.js`
- Axios instance for display APIs
- Game status endpoint
- Health check functionality
- Error interceptors for logging

## 🎯 Key Features

### Axios Configuration
```javascript
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 seconds
});
```

### Interceptors
**Request Interceptor:**
- Add auth tokens (if needed)
- Custom headers
- Request logging

**Response Interceptor:**
- Automatic error handling
- Console logging
- Error message standardization

### Usage Examples

**Host Dashboard:**
```javascript
import { questionsAPI, gameAPI } from './services/api';

// Save questions
await questionsAPI.saveQuestions(questions);

// Load questions  
const data = await questionsAPI.loadQuestions();

// Health check
await gameAPI.healthCheck();
```

**Participant/Display:**
```javascript
import { gameAPI } from './services/api';

// Get game status
const status = await gameAPI.getGameStatus();

// Health check
const health = await gameAPI.healthCheck();
```

## 🔧 Environment Variables

Create `.env` files in each app:

```env
VITE_API_URL=http://localhost:3001
```

## 🚀 Benefits of Axios

✅ **Automatic JSON transformation** - No need for `response.json()`
✅ **Request/Response interceptors** - Centralized error handling
✅ **Timeout support** - Prevents hanging requests
✅ **Better error messages** - Structured error responses
✅ **Request cancellation** - Can cancel pending requests
✅ **Progress tracking** - For file uploads (future use)
✅ **CSRF protection** - Built-in support

## 📊 Migration from Fetch

**Before (Fetch):**
```javascript
const response = await fetch(`${API_URL}/api/questions`);
const data = await response.json();
if (!response.ok) throw new Error(data.error);
```

**After (Axios):**
```javascript
const response = await apiClient.get('/api/questions');
// response.data is already parsed JSON
```

## 🎨 Error Handling

All errors are automatically caught and formatted:
```javascript
try {
  await questionsAPI.saveQuestions(data);
} catch (error) {
  // error.message contains user-friendly message
  console.error(error.message);
}
```

No additional configuration needed - all apps are ready to use Axios!
