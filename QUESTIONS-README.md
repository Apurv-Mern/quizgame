# Questions Management

## Single Source of Truth

All questions are now managed from a single file: **`shared-questions.js`** in the root of the project.

### How it works:

1. **Backend** (`backend/src/utils/questionBank.js`)  
   - Imports questions from `shared-questions.js`
   - Converts them to Question model instances
   - Loads them into memory on server startup

2. **Host Dashboard** (`host-dashboard/src/data/staticQuestions.js`)  
   - Contains a copy of the questions from `shared-questions.js`
   - Uploads them to backend when dashboard loads
   - ⚠️ **Important**: This file should be regenerated if you edit shared-questions.js

### To Update Questions:

1. Edit `shared-questions.js` in the project root
2. Restart the backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Refresh your browser (Ctrl+Shift+R / Cmd+Shift+R for hard refresh)
4. Clear browser cache if old questions still appear

### Current Questions (10 total):

1. **Ancient City Infrastructure** - Rome (M&G Real Assets Fund - Absolute Energy)
2. **Twin-Towered Office Building** - Seoul (M&G direct holding)
3. **Regenerative Blueberry Business** - Portugal (M&G Catalyst - Regen Blue)
4. **Direct Air Capture Plants** - Iceland (M&G Catalyst - Climeworks)
5. **Waratah Super Battery** - New South Wales (M&G Real Assets Fund)
6. **Christiana Mall** - Delaware (Morgan Stanley Prime Property Fund)
7. **Tier Mobility HQ** - Berlin (M&G Catalyst - Tier Mobility)
8. **Sitawi Sustainable Development Finance** - Brazil (M&G Catalyst)
9. **Clichy Student Housing** - Paris (M&G European Real Estate Fund)
10. **Dharavi Solar Energy** - Mumbai (M&G Catalyst - Fourth Partner Energy)

### Troubleshooting:

**If you see old questions after updating:**
1. Stop the backend server (Ctrl+C)
2. Clear browser cache
3. Restart backend server
4. Hard refresh browser (Ctrl+Shift+R)

**Database has been removed:**
- All questions now load from `shared-questions.js`
- No database required
- Changes take effect immediately after backend restart
