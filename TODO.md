# UI Improvement and Backend Removal Task Breakdown

## Phase 1: Backend Removal

- [ ] Remove backend-related files and folders
  - [ ] Delete client/src/modules/api/ directory (config.ts, client.ts)
  - [ ] Delete client/src/modules/auth/ directory (useAuth.ts, authService.ts)
  - [ ] Delete server/ directory (already empty)
  - [ ] Remove client/src/hooks/useAuth.ts (duplicate auth hook)
- [ ] Remove backend-related code from UI components
  - [ ] Update client/src/pages/HomePage.tsx: Remove API calls, auth hooks, and backend-dependent logic
  - [ ] Update client/src/pages/DiscoverPage.tsx: Remove API calls and auth dependencies
  - [ ] Update client/src/components/LoginForm.tsx: Remove auth service calls
  - [ ] Update client/src/components/SignupForm.tsx: Remove auth service calls
  - [ ] Update client/src/components/SignupModal.tsx: Remove auth service calls
  - [ ] Update client/src/components/PolishedProfileCard.tsx: Remove backend dependencies if any
  - [ ] Remove any remaining API imports and auth usage from other components

## Phase 2: UI Rebuild from Scratch

- [ ] Rebuild Header component (client/src/components/Header.tsx)
  - [ ] Improve navigation layout and styling
  - [ ] Add necessary buttons with consistent styling
  - [ ] Enhance header texts and branding
- [ ] Rebuild Footer component (client/src/new-ui/FooterSimple.tsx)
  - [ ] Improve layout and design (same but improved)
  - [ ] Add necessary links and buttons
  - [ ] Enhance styling and responsiveness
- [ ] Rebuild Button components
  - [ ] Update client/src/components/ui/button.tsx with improved variants
  - [ ] Update client/src/components/Button.tsx if needed
  - [ ] Ensure consistent button styling across the app
- [ ] Rebuild main pages
  - [ ] Redesign client/src/pages/HomePage.tsx from scratch with necessary buttons and header texts
  - [ ] Redesign client/src/pages/DiscoverPage.tsx from scratch
  - [ ] Remove unused components like HeroSection, SharedFeatures, DailyMatches if not needed
- [ ] Update global styles (client/src/index.css)
  - [ ] Improve overall design system
  - [ ] Ensure consistent theming

## Phase 3: File and Folder Cleanup

- [ ] Identify and delete unnecessary files
  - [ ] Remove unused components (e.g., hero/, new-ui/ if not using)
  - [ ] Remove test files related to backend (**tests**/)
  - [ ] Remove mock data files (mock/)
  - [ ] Remove attached_assets/ if not needed for UI
  - [ ] Clean up images/ folder
- [ ] Update package.json
  - [ ] Remove backend-related dependencies
  - [ ] Clean up scripts if needed
- [ ] Update configuration files
  - [ ] Remove backend config from vite.config.ts, drizzle.config.ts if applicable

## Phase 4: Testing and Verification

- [ ] Test the new UI components
  - [ ] Verify header functionality and styling
  - [ ] Verify footer improvements
  - [ ] Verify button consistency
  - [ ] Test page layouts and responsiveness
- [ ] Run the application
  - [ ] Ensure no backend calls remain
  - [ ] Verify all UI elements work without backend dependencies
- [ ] Final cleanup and optimization
  - [ ] Remove any remaining unused imports
  - [ ] Optimize bundle size by removing unused code
