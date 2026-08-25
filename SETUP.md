# 🔧 Dentech Garage Manager - Setup Guide

## Project Structure

```
dentech-garage-manager/
├── server.js                 # Express backend (port 5000)
├── package.json             # Dependencies & scripts
├── .env.example             # Template (commit this)
├── .env                     # Your secrets (DO NOT COMMIT)
├── .gitignore              # Prevents .env from being committed
├── vite.config.js          # Vite configuration
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── components/
│   │   └── RepairForm.jsx
│   ├── services/
│   │   └── api.js          # Frontend API calls
│   └── styles/
│       └── RepairForm.css
└── public/
```

---

## Step 1: Initial Setup in GitHub Codespaces

### 1.1 Clone & Open in Codespaces

```bash
# Your repo is already open in Codespaces
# Just verify you're in the project root
cd /workspaces/Dentech-Garage-manager-
```

### 1.2 Create `.env` File

Copy `.env.example` and replace with your actual API key:

```bash
cp .env.example .env
```

Edit `.env`:
```bash
# Open the file
nano .env
```

Replace `your_meta_api_key_here` with your actual Meta AI API key:

```env
NODE_ENV=development
META_AI_API_KEY=sk-xxx-your-actual-key-xxx
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs:
- **Frontend**: React, React-DOM, Vite
- **Backend**: Express, CORS, dotenv, node-fetch
- **Dev Tools**: concurrently (to run both simultaneously)

---

## Step 3: Running the Application

### Option A: Run Everything Together (Recommended)

```bash
npm run dev:all
```

This starts:
- ✅ Backend server on `http://localhost:5000`
- ✅ Frontend on `http://localhost:5173`

### Option B: Run Separately (in different terminals)

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Option C: Run Frontend Only

```bash
npm run dev
```

(Backend must be running separately)

---

## Step 4: Access the Application

1. **Frontend**: Open `http://localhost:5173` in your browser
2. **Backend Health Check**: Visit `http://localhost:5000/api/health`

---

## Step 5: Test the API

### Using the UI:

1. Go to `http://localhost:5173`
2. Fill in the form:
   - Customer Name: `John Doe`
   - Job Type: `Oil Change`
   - Description: `Customer requested full oil change with filter replacement`
3. Click "Generate Description"
4. You should see AI-generated response

### Using cURL (Terminal):

```bash
# Health check
curl http://localhost:5000/api/health

# Generate repair description
curl -X POST http://localhost:5000/api/generate-repair \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "jobType": "Oil Change",
    "description": "Full oil change with filter replacement"
  }'
```

---

## Step 6: Debugging

### Backend Logs
- Check terminal running `npm run dev:server`
- Look for: ✅ API key status, 🚀 Server running message

### Frontend Errors
- Open Browser DevTools: `F12` or `Right-click → Inspect`
- Check Console tab for errors
- Network tab shows API requests

### Common Issues

| Problem | Solution |
|---------|----------|
| `Cannot find module 'express'` | Run `npm install` |
| `META_AI_API_KEY not configured` | Check `.env` file has your key |
| `Failed to fetch` | Ensure backend is running on port 5000 |
| `Port 5000 already in use` | Kill process: `lsof -i :5000 \| grep LISTEN \| awk '{print $2}' \| xargs kill` |
| `Port 5173 already in use` | Kill process: `lsof -i :5173 \| grep LISTEN \| awk '{print $2}' \| xargs kill` |

---

## Step 7: Environment Variables Reference

### `.env` (Local - Never commit)
```env
NODE_ENV=development              # dev or production
META_AI_API_KEY=sk-xxx            # Your Meta AI API key
PORT=5000                          # Backend port
FRONTEND_URL=http://localhost:5173 # Frontend URL
```

### `.env.example` (Template - Safe to commit)
```env
NODE_ENV=development
META_AI_API_KEY=your_meta_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

## Step 8: API Endpoints

### Backend Endpoints (http://localhost:5000)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Server status check |
| POST | `/api/chat` | Conversational AI |
| POST | `/api/ai` | General AI responses |
| POST | `/api/generate-repair` | Generate repair descriptions |

### Request Examples

**Generate Repair Description:**
```json
POST /api/generate-repair
{
  "customerName": "John Doe",
  "jobType": "Oil Change",
  "description": "Full oil change with synthetic oil"
}
```

**Response:**
```json
{
  "success": true,
  "repairDescription": "Professional repair description here..."
}
```

---

## Step 9: Building for Production

```bash
# Build optimized frontend
npm run build

# Output in: dist/
```

---

## Step 10: Security Checklist ✅

- ✅ `.env` is in `.gitignore` (won't be committed)
- ✅ `.env.example` has placeholder values (safe to commit)
- ✅ API key never exposed in frontend code
- ✅ All API calls go through backend (key stays secure)
- ✅ CORS configured for localhost development

---

## Useful Commands

```bash
# Install dependencies
npm install

# Start everything
npm run dev:all

# Start backend only
npm run dev:server

# Start frontend only
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill

# Kill process on port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill and restart
npm run dev:server
```

### Frontend shows "Cannot connect to API"
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check .env file exists and has correct API key
cat .env
```

### API key not working
1. Verify key is in `.env` (not `.env.example`)
2. Restart backend after changing key
3. Check key format in Meta AI dashboard

---

## Next Steps

1. ✅ Create `.env` file with your Meta API key
2. ✅ Run `npm install`
3. ✅ Run `npm run dev:all`
4. ✅ Test at `http://localhost:5173`
5. ✅ Deploy when ready

---

**Questions?** Check the API service file at `src/services/api.js` or backend at `server.js`
