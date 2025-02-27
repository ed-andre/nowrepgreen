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
│   ├── modeling+/
│   │   ├── _index.tsx        # Boards listing
│   │   ├── boards.$boardId/
│   │   │   └── index.tsx     # Talents in board
│   │   └── talents.$talentId/
│   │       └── index.tsx     # Talent portfolio
```

### 2. Component Hierarchy

- BoardGrid (homepage)
- TalentGrid (board page)
  - TalentCard (with measurements overlay)
- MediaGallery (talent page)
  - Using react-grid-gallery
  - Using yet-another-react-lightbox

### 3. UI Components Needed

- BoardCard (for displaying board thumbnails on homepage)
- ModelCard (for displaying model thumbnails with measurements)
- MeasurementsDisplay (standardized format for model stats)
- MediaGrid (for portfolio display)
- LightboxWrapper (for image viewing)
- LoadingStates (consistent loading indicators)
- ErrorBoundaries (graceful error handling)
- Header (site navigation)
- Footer (copyright, links)

## Implementation Order

1. Backend Routes

   - Start with data access functions
   - Implement API endpoints
   - Add error handling

2. Frontend Base

   - Set up page routes under the `modeling+` namespace
   - Create basic layouts with header and footer
   - Implement loading states and error boundaries

3. Core Components

   - Build reusable components (BoardCard, ModelCard, etc.)
   - Implement BoardGrid for homepage
   - Implement ModelGrid for board detail pages
   - Integrate media gallery for talent pages
   - Add lightbox functionality for image viewing

4. Enhancements
   - Add measurements display with standardized format
   - Implement responsive design optimizations
   - Add image optimization and lazy loading
   - Ensure accessibility compliance

## Libraries to Use

- react-grid-gallery
- yet-another-react-lightbox
- react-intersection-observer (for lazy loading)
- clsx or tailwind-merge (for conditional class names)

## Design & UX Considerations

### Grid Layout

- Implement a responsive, minimalist grid system similar to Heroes Models
- Use consistent aspect ratios for thumbnails (4:5 for portraits)
- Add subtle hover effects revealing model name and key stats
- Consider masonry-style layout for portfolio pages

### Typography & Visual Hierarchy

- Use clean, sans-serif typography with clear size hierarchy
- Standardize measurement display format (H/B/W/H/S)
- Implement consistent spacing and alignment rules
- Maintain ample whitespace around content elements

### Navigation & Filtering

- Create simple, accessible top navigation
- Consider search functionality for future implementation

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

## Refined Implementation Plan

### Landing Page (Boards Display)

- Create a visually striking asymmetrical grid for board display
- Implement a mix of image sizes and orientations for visual interest
- Add subtle hover effects for interactive elements
- Ensure responsive behavior maintains visual hierarchy

### Board Detail Page (Model Listing)

- Implement uniform grid of model thumbnails with consistent aspect ratios
- Display model names and key measurements in standardized format
- Create hover states that enhance but don't distract from imagery
- Ensure mobile view maintains readability of measurement information

### Component Structure

- `BoardGrid`: Asymmetrical grid component for homepage
- `BoardCard`: Individual board display with image and title
- `ModelGrid`: Uniform grid for displaying models within a board
- `ModelCard`: Individual model card with image, name, and measurements
- `MeasurementDisplay`: Standardized component for displaying model stats

### Data Requirements

- Board data: title, description, cover image, model count
- Model data: name, measurements, hair/eye color, portfolio images
- Relationship mapping between boards and models

### Technical Considerations

- Implement image optimization for fast loading
- Consider lazy loading for model grids with many entries
- Ensure accessibility for all interactive elements
- Optimize for mobile viewing with appropriate breakpoints

### Component Organization

All modeling-specific components should be placed in:

```
app/
├── components/
│   ├── modeling/
│   │   ├── BoardCard.tsx
│   │   ├── BoardGrid.tsx
│   │   ├── ModelCard.tsx
│   │   ├── ModelGrid.tsx
│   │   ├── MeasurementDisplay.tsx
│   │   ├── MediaGallery.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
```

### Styling Approach

Create a dedicated CSS file for the modeling site:

```
app/
├── styles/
│   ├── modeling.css
```

This will allow for site-specific styling while maintaining separation from other demo sites. The CSS file should be imported in the root layout component for the modeling routes.

### Route Implementation

Each route should:

1. Import necessary components from the modeling component directory
2. Use the appropriate data loader functions
3. Handle loading and error states consistently
4. Implement responsive layouts using the styling defined in modeling.css
