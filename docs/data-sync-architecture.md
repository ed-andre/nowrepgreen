# Data Synchronization: NowRepBlue → NowRepGreen

## System Overview
NowRepGreen maintains a local copy of NowRepBlue data through scheduled synchronization tasks, transforming JSON API responses into normalized relational data.

## Architecture

### 1. Data Flow
NowRepBlue API → JSON Storage → Data Transformation → Normalized Tables → Web App Queries

### 2. Components
- **Sync Tasks**: Fetch and store raw JSON from API
- **Transform Tasks**: Convert JSON to normalized structure
- **Version Manager**: Maintain table versions and views
- **Cleanup Process**: Remove outdated versions

### 3. Database Structure
#### Storage Tables
- `{entity}_json`: Raw JSON storage (keeps last 3 versions)
- `{entity}_v{n}`: Normalized data tables
- `{entity}_current`: Views pointing to active version
- `sync_metadata`: Tracks active and backup versions

### 4. Implementation Guide

#### A. Transform Tasks Structure
1. Create transform tasks in `trigger/transform-tasks.ts`
2. Each task should:
   - Fetch latest JSON from entity_json table
   - Get next version number from metadata
   - Create new versioned table
   - Transform and insert data
   - Update views and metadata
   - Clean up old versions

#### B. Version Management
1. Create version manager in `trigger/version-manager.ts` with functions for:
   - Getting next version number
   - Updating metadata and views
   - Cleaning up old versions
2. Version numbering:
   - Increment from current active version
   - Keep last 2 versions (active + backup)
   - Start from version 1 if no previous versions

#### C. Data Transformation Process
1. Create type-safe transformation functions for each entity
2. Handle required fields and data type conversions
3. Maintain referential integrity
4. Use transactions for atomic operations
5. Implement proper error handling

### 5. Transformation Order
1. Transform independent entities first:
   - TalentTypes
   - MediaTags
   - PortfolioCategories

2. Transform primary entities:
   - Talents
   - Boards

3. Transform dependent entities:
   - Portfolios
   - PortfolioMedia

4. Transform junction tables:
   - BoardsTalents
   - BoardsPortfolios
   - MediaTags_Junction

### 6. Error Handling
- Implement try-catch blocks in all tasks
- Log errors with entity and version info
- Maintain backup version for quick rollback
- Use transactions for atomic updates

### 7. Testing Strategy
1. Create test JSON data fixtures
2. Verify transformation logic
3. Test version management
4. Validate view updates
5. Check cleanup process
6. Confirm rollback functionality

### 8. Best Practices
- Use TypeScript interfaces for type safety
- Implement proper error handling
- Keep transformations idempotent
- Use transactions for atomic operations
- Validate data before and after transformation
- Log all operations for debugging
- Handle null/undefined values gracefully

## Implementation Notes
- Using SQLite as database
- All media assets referenced via CDN
- Static website serving transformed data
- Zero-downtime updates via view switching