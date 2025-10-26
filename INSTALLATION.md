# Installation Instructions

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js**: Version 18.0 or higher
  - Download from: <https://nodejs.org/>
  - Verify installation: `node --version`
  
- **npm**: Version 9.0 or higher (comes with Node.js)
  - Verify installation: `npm --version`

### System Requirements

- **Operating System**: macOS, Windows, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **Browser**: Chrome, Firefox, Safari, or Edge (latest version)

---

## Step-by-Step Installation

### Step 1: Verify Prerequisites

Open your terminal and run:

```bash
node --version
# Should output: v18.x.x or higher

npm --version
# Should output: 9.x.x or higher
```

If these commands fail, install Node.js first.

---

### Step 2: Navigate to Project Directory

```bash
cd "/Users/tjmoipolai/Documents/SaluLink App Building/Diabetes App"
```

---

### Step 3: Install Dependencies

This will install all required packages (Next.js, React, TypeScript, etc.):

```bash
npm install
```

**Expected output:**

```
added 300+ packages in 30s
```

**If you see errors:**

- Check your internet connection
- Try: `npm cache clean --force` then `npm install` again
- Ensure you're in the correct directory

---

### Step 4: Verify Installation

Check that all key files are present:

```bash
ls -la
```

**You should see:**

- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.js`
- ✅ `next.config.js`
- ✅ `app/` directory
- ✅ `components/` directory
- ✅ `lib/` directory
- ✅ `public/` directory with CSV files

---

### Step 5: Start Development Server

```bash
npm run dev
```

**Expected output:**

```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

---

### Step 6: Open in Browser

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the SaluLink welcome screen

**If the page doesn't load:**

- Check that the dev server is still running
- Try a different port: `npm run dev -- -p 3001`
- Clear browser cache and reload

---

## Verification Checklist

After installation, verify these features work:

### ✅ Basic Functionality

- [ ] Application loads without errors
- [ ] Welcome screen displays
- [ ] "Start New Case" button works
- [ ] Sidebar is visible
- [ ] Workflow progress bar appears

### ✅ Data Loading

- [ ] No console errors (press F12 to check)
- [ ] CSV files load successfully
- [ ] Authi 1.0 initializes

### ✅ Step 1 Test

- [ ] Can enter clinical note
- [ ] "Analyze Note" button works
- [ ] Conditions are detected
- [ ] Can select and confirm condition

### ✅ Navigation

- [ ] Can move between steps
- [ ] Progress bar updates
- [ ] Sidebar navigation works

---

## Troubleshooting

### Problem: `npm install` fails

**Solution 1:** Clear npm cache

```bash
npm cache clean --force
npm install
```

**Solution 2:** Delete node_modules and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
```

**Solution 3:** Use different registry

```bash
npm install --registry=https://registry.npmjs.org/
```

---

### Problem: Port 3000 already in use

**Solution:** Use a different port

```bash
npm run dev -- -p 3001
```

Then open: `http://localhost:3001`

---

### Problem: CSV files not loading

**Symptoms:**

- Error message: "Failed to load application data"
- Console error about CSV files

**Solution:**

1. Verify CSV files are in `/public` directory:

```bash
ls public/
# Should show:
# Endocrine CONDITIONS.csv
# Endocrine MEDICINE.csv
# Endocrine TREATMENT.csv
```

2. If missing, copy them:

```bash
cp "Endocrine CONDITIONS.csv" public/
cp "Endocrine MEDICINE.csv" public/
cp "Endocrine TREATMENT.csv" public/
```

---

### Problem: TypeScript errors

**Solution:** Rebuild TypeScript

```bash
npm run build
```

If errors persist, check `tsconfig.json` is present.

---

### Problem: Styling not working

**Symptoms:**

- No colors or styling
- Plain HTML appearance

**Solution:** Rebuild Tailwind CSS

```bash
rm -rf .next
npm run dev
```

---

### Problem: Browser shows blank page

**Solutions:**

1. Check browser console (F12) for errors
2. Try incognito/private mode
3. Clear browser cache
4. Try different browser
5. Check terminal for server errors

---

## Building for Production

Once everything works in development:

### Step 1: Create Production Build

```bash
npm run build
```

**Expected output:**

```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size
┌ ○ /                                   150 kB
└ ○ /_not-found                         0 B

○  (Static)  prerendered as static content
```

### Step 2: Start Production Server

```bash
npm start
```

The app will run on `http://localhost:3000` in production mode.

---

## Environment Setup (Optional)

### For Development

Create `.env.local` file (optional):

```bash
# Add any environment variables here
# Example:
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### For Production

Set environment variables based on your hosting platform:

- **Vercel**: Use dashboard environment variables
- **Netlify**: Use dashboard environment variables
- **Custom server**: Use `.env.production`

---

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

3. Follow prompts to deploy

### Option 2: Netlify

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Build and deploy:

```bash
npm run build
netlify deploy --prod
```

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t salulink-app .
docker run -p 3000:3000 salulink-app
```

---

## Post-Installation

### Recommended Next Steps

1. **Read Documentation**
   - Start with `QUICK_START.md`
   - Review `README.md` for features
   - Check `TESTING_GUIDE.md` for examples

2. **Test the Application**
   - Run through complete workflow
   - Try all test cases
   - Verify PDF export

3. **Customize (Optional)**
   - Update branding in `tailwind.config.js`
   - Modify colors and fonts
   - Add your logo

4. **Set Up Version Control**

```bash
git init
git add .
git commit -m "Initial commit"
```

---

## Getting Help

### Documentation Files

- `README.md` - Project overview
- `QUICK_START.md` - Usage guide
- `PROJECT_STRUCTURE.md` - Technical details
- `TESTING_GUIDE.md` - Test cases
- `BUILD_SUMMARY.md` - Complete summary

### Common Issues

- Check console for errors (F12)
- Review terminal output
- Verify all files are present
- Ensure Node.js version is correct

### Debug Mode

Run with debug logging:

```bash
DEBUG=* npm run dev
```

---

## Success Indicators

You'll know installation was successful when:

✅ Dev server starts without errors  
✅ Application loads in browser  
✅ Welcome screen displays correctly  
✅ Can create new case  
✅ Can analyze clinical note  
✅ Can navigate through all 5 steps  
✅ Can save and load cases  
✅ Can export PDF  

---

## Quick Reference

### Start Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Run Linter

```bash
npm run lint
```

### Clean Build

```bash
rm -rf .next node_modules
npm install
npm run dev
```

---

## System Check Script

Create a file `check-system.sh` and run it to verify your setup:

```bash
#!/bin/bash

echo "🔍 Checking SaluLink Installation..."
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
node --version || echo "❌ Node.js not found"

# Check npm
echo "✓ Checking npm..."
npm --version || echo "❌ npm not found"

# Check files
echo "✓ Checking project files..."
[ -f "package.json" ] && echo "  ✓ package.json" || echo "  ❌ package.json missing"
[ -f "tsconfig.json" ] && echo "  ✓ tsconfig.json" || echo "  ❌ tsconfig.json missing"
[ -d "app" ] && echo "  ✓ app/ directory" || echo "  ❌ app/ directory missing"
[ -d "components" ] && echo "  ✓ components/ directory" || echo "  ❌ components/ directory missing"
[ -d "public" ] && echo "  ✓ public/ directory" || echo "  ❌ public/ directory missing"

# Check CSV files
echo "✓ Checking CSV files..."
[ -f "public/Endocrine CONDITIONS.csv" ] && echo "  ✓ CONDITIONS.csv" || echo "  ❌ CONDITIONS.csv missing"
[ -f "public/Endocrine MEDICINE.csv" ] && echo "  ✓ MEDICINE.csv" || echo "  ❌ MEDICINE.csv missing"
[ -f "public/Endocrine TREATMENT.csv" ] && echo "  ✓ TREATMENT.csv" || echo "  ❌ TREATMENT.csv missing"

# Check node_modules
echo "✓ Checking dependencies..."
[ -d "node_modules" ] && echo "  ✓ node_modules installed" || echo "  ⚠️  Run 'npm install'"

echo ""
echo "✅ System check complete!"
```

Run it:

```bash
chmod +x check-system.sh
./check-system.sh
```

---

**Installation Complete! 🎉**

You're now ready to use the SaluLink Chronic Treatment App.

Run `npm run dev` and open `http://localhost:3000` to get started!
