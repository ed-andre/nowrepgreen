# Portfolio Site Development Plan

## Overview

Build a hierarchical portfolio website following the structure:
BOARDS → TALENTS → PORTFOLIOS MEDIA

## Data Flow

1. Boards listing (homepage)
2. Board detail page showing talents
3. Talent detail page with media gallery
4. (Future) Portfolio-specific media views

## Backend Tasks

### 1. Data Access Layer

Create utilities in `app/models` to query versioned views:

- `boards.server.ts`

  - `getBoards()` - Query Boards_current with talent counts
  - `getBoardById()` - Get board details using Boards_current

- `talents.server.ts`

  - `getTalentsByBoardId()` - Join BoardsTalents_current with Talents_current
  - `getTalentWithDetails()` - Join Talents_current with TalentsMeasurements_current

- `portfolios.server.ts`
  - `getTalentPortfolios()` - Query TalentsPortfolios_current (option to get all, just default, or all but default)
  - `getPortfolioMedia()` - Query PortfoliosMedia_current
  - `getUniqueMediaByTalent()` - Aggregate media across portfolios

## Frontend Tasks

### 1. Page Structure

```
app/
├── routes/
│   ├── _index.tsx        # Boards listing
│   ├── boards.$boardId/
│   │   └── index.tsx     # Talents in board
│   └── talents.$talentId/
│       └── index.tsx     # Talent portfolio
```

### 2. Component Hierarchy

- BoardGrid (homepage)
- TalentGrid (board page)
  - TalentCard (with measurements overlay)
- MediaGallery (talent page)
  - Using react-grid-gallery
  - Using yet-another-react-lightbox

### 3. UI Components Needed

- ImageCard (reusable for boards/talents)
- MeasurementsDisplay
- MediaGrid
- LightboxWrapper
- LoadingStates
- ErrorBoundaries

## Implementation Order

1. Backend Routes

   - Start with data access functions
   - Implement API endpoints
   - Add error handling

2. Frontend Base

   - Set up page routes
   - Create basic layouts
   - Implement loading states

3. Core Components

   - Build reusable components
   - Integrate grid gallery
   - Add lightbox functionality

4. Enhancements
   - Add measurements display
   - Implement filtering/sorting
   - Add portfolio-specific views

## Libraries to Use

- react-grid-gallery
- yet-another-react-lightbox
- Optional: react-intersection-observer (lazy loading)

## Notes

- Focus on mobile-first responsive design
- Implement proper loading states
- Handle empty states gracefully
- Consider pagination for large datasets
- Cache API responses where appropriate

## Design & UX Considerations

### Grid Layout

- Implement a responsive, minimalist grid system similar to Heroes Models
- Use consistent aspect ratios for thumbnails (4:5 for portraits)
- Add subtle hover effects revealing model name and key stats
- Consider masonry-style layout for portfolio pages (like APM)

### Typography & Visual Hierarchy

- Use clean, sans-serif typography with clear size hierarchy
- Standardize measurement display format (H/B/W/H/S)
- Implement consistent spacing and alignment rules
- Maintain ample whitespace around content elements

### Navigation & Filtering

- Create simple, accessible top navigation
- Implement filtering by gender, features, and specialties
- Add quick-filter buttons for common categories
- Consider search functionality with predictive results

### Model Detail Pages

- Large hero image with gallery below
- Standardized measurement display in prominent location
- Portfolio section with categorized media
- Consider tabs for different portfolio categories

### Animation & Interaction

- Implement subtle hover states for interactive elements
- Add smooth transitions between pages and states
- Consider lazy-loading for image-heavy pages
- Implement lightbox functionality for portfolio viewing

## Technical Implementation Notes

### Responsive Considerations

- Mobile-first approach with breakpoints at 640px, 768px, 1024px, 1280px
- Grid adjustments: 2 columns (mobile), 3 columns (tablet), 4+ columns (desktop)
- Touch-friendly interactions for mobile users
- Optimize image loading for mobile connections

### Performance Optimization

- Implement image lazy loading using Intersection Observer
- Consider using next-gen image formats (WebP) with fallbacks
- Optimize thumbnail sizes for different viewport widths
- Implement pagination or infinite scroll for large model lists

### Accessibility Enhancements

- Ensure proper contrast ratios for text elements
- Add appropriate ARIA labels for interactive components
- Implement keyboard navigation for gallery components
- Ensure screen reader compatibility for model information
