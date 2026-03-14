# Backend API Integration Update

## Overview

The frontend has been updated to use the new backend API structure with three distinct endpoints for better performance and separation of concerns.

## New API Endpoints

### 1. Authentication Profile - `GET /auth/profile`

- **Purpose**: Basic authentication info and user verification
- **Usage**: Auth checks, navbar display
- **Response**: Basic user data without detailed stats
- **Used in**: AuthContext.refreshUser()

### 2. Detailed User Profile - `GET /users/profile`

- **Purpose**: Complete user profile with level progression
- **Usage**: Profile pages, dashboards, level displays
- **Response**: User data + currentLevel + nextLevel + levelProgress
- **Used in**: useUserProfile hook

### 3. User Statistics - `GET /users/stats`

- **Purpose**: Detailed analytics and activity data
- **Usage**: Statistics pages, performance tracking
- **Response**: dailyActivity + weeklyStats + achievements
- **Used in**: useUserStats hook

## Frontend Changes

### New Hooks Created

1. **useUserProfile** (`src/hooks/useUserProfile.ts`)
   - Fetches detailed profile data from `/users/profile`
   - Provides level progression information
   - Used in HomeScreen and ProgressScreen

2. **useUserStats** (`src/hooks/useUserStats.ts`)
   - Fetches analytics data from `/users/stats`
   - Provides daily activity, weekly stats, achievements
   - Used in ProgressScreen for enhanced statistics

### Updated Components

1. **AuthContext** (`src/context/AuthContext.tsx`)
   - Updated to handle new `/auth/profile` response structure
   - Maintains backward compatibility

2. **HomeScreen** (`src/screens/HomeScreen.tsx`)
   - Now uses useUserProfile for detailed level information
   - Shows accurate level progression from backend
   - Displays proper level descriptions and XP requirements

3. **ProgressScreen** (`src/screens/ProgressScreen.tsx`)
   - Enhanced with useUserProfile and useUserStats
   - Shows more detailed statistics when available
   - Fallback to basic user data if detailed stats unavailable

## Benefits

- **Better Performance**: Lighter auth checks, detailed data only when needed
- **Accurate Level Data**: Level progression comes directly from backend
- **Enhanced Statistics**: Rich analytics data for better user insights
- **Backward Compatibility**: Graceful fallbacks to basic user data
- **Separation of Concerns**: Clear API boundaries for different use cases

## Usage Examples

```typescript
// Quick auth check (lightweight)
const { user } = useAuth();

// Detailed profile with level progression
const { profile, loading } = useUserProfile();
const currentLevel = profile?.currentLevel;
const levelProgress = profile?.levelProgress;

// Detailed statistics and analytics
const { stats, loading } = useUserStats();
const weeklyStats = stats?.weeklyStats;
const achievements = stats?.achievements;
```

## Migration Notes

- All existing functionality preserved
- New features automatically available when backend provides data
- Graceful degradation when new endpoints unavailable
- No breaking changes to existing components
