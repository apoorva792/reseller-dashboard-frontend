# Reseller Onboarding Flow

This module provides a 3-step onboarding experience for new resellers to personalize their product feed.

## Features

- 3-step wizard flow to collect reseller preferences
- Step 1: Category selection
- Step 2: Price range selection (up to 4 ranges)
- Step 3: Product discovery and selection
- Export selected products as CSV
- Fully responsive design
- Seamless integration with the existing authentication flow

## Structure

- `/components` - Reusable UI components
- `/context` - State management using React Context
- `/data` - JSON data files for products and keywords
- `/hooks` - Custom hooks
- `/layouts` - Layout components
- `/pages` - Page components for each onboarding step
- `/types.ts` - TypeScript types and interfaces

## Technical Implementation

- Uses React Context for state management
- Stores onboarding progress in localStorage
- Redirects users to onboarding after login if not completed
- Fully isolated from the main application
- Mobile-optimized with responsive design

## Integration Points

- Hooks into the authentication flow via the Login component
- Updates routes.tsx to add new onboarding routes
- Dashboard component checks if onboarding is needed

## How to Test

1. Clear localStorage to reset onboarding state
2. Log in with valid credentials
3. You should be redirected to the onboarding flow
4. Complete all 3 steps
5. After completion, you should land on the dashboard
6. Log out and log in again - you should go directly to the dashboard now

## How to Remove

If needed, this module is designed to be easily removed:

1. Remove the onboarding-flow directory
2. Remove the onboarding routes from routes.tsx
3. Remove the onboarding check from Dashboard.tsx
4. Remove the onboarding redirect logic from Login.tsx
5. Restore the original login navigation in auth.tsx 