# Data Synchronization: NowRepBlue → NowRepGreen

## Refactored Architecture: API-Driven Synchronization

### Problem Statement

The original synchronization architecture relied on direct database access from trigger.dev tasks. This approach encountered issues in the trigger.dev cloud environment where:

1. SQLite database files couldn't be accessed or created at the expected path (`file:/data/sqlite.db`)
2. Error messages indicated "Error code 14: Unable to open the database file"
3. While the approach works in local development, it fails in the cloud environment

### Solution: API-Driven Synchronization

To address these limitations, we've implemented an API-driven approach that decouples trigger.dev tasks from direct database operations:

```mermaid
graph TD
    A[NowRepBlue API] -->|Manual Trigger or Scheduled| B[NowRepBlue Sync Utility]
    B -->|API Call| C[Orchestration API Endpoint]
    C -->|Trigger.dev Task| D[orchestrate-sync-api Task]
    D -->|Orchestrates| E[sync-all-api Task]
    E -->|API Call| F[Store JSON API Endpoint]
    F -->|Store Raw JSON| G[JSON Stage Tables]
    G -->|Orchestrated by| D
    D -->|Orchestrates| H[transform-all-api Task]
    H -->|API Call| I[Transform API Endpoint]
    I -->|Transform & Version| J[Versioned Tables v1/v2]
    J -->|Dynamic View Switch| K[Current Views]
    K -->|Serve Data| L[NowRepGreen Application]
```

#### Key Benefits

- Trigger.dev tasks no longer require direct database access
- Database operations occur in the main application where SQLite is properly configured
- Improved separation of concerns between orchestration and data processing
- Maintains compatibility with both local and cloud environments
- Enables manual triggering from the source application (NowRepBlue)

### Implementation Guide

#### 1. Server-Side API Endpoints

Three new API endpoints in the main application:

1. **Store JSON Endpoint** (`/api/internal/sync/store-json`):

   - Accepts entity name and JSON data
   - Stores data in the appropriate `{entity}_json` table
   - Handles cleanup of old records (keeping only the 3 most recent)
   - Secured with `SYNC_SECRET_KEY`

2. **Transform Endpoint** (`/api/internal/transform/:entity`):

   - Accepts entity name to transform
   - Executes the appropriate transformation logic
   - Returns success/failure status and version information
   - Secured with `SYNC_SECRET_KEY`

3. **Orchestration Endpoint** (`/api/internal/orchestrate-sync-api`):

   - Triggers the orchestration task in trigger.dev
   - Returns task ID for monitoring
   - Secured with `SYNC_SECRET_KEY`
   - Supports both `Authorization: Bearer` and `x-sync-secret` headers

4. **Task Status Endpoint** (`/api/internal/task-status/:taskId`):
   - Retrieves status of a specific task or lists multiple tasks
   - Supports filtering by task type, status, and limit
   - Secured with `SYNC_SECRET_KEY`
   - Enables monitoring of task progress

#### 2. Refactored Trigger.dev Tasks

Three trigger.dev tasks that use API calls instead of direct database access:

1. **API-Driven Sync Task** (`sync-all-api.ts`):

   - Fetches data from NowRepBlue API endpoints
   - Calls the Store JSON API endpoint instead of using Prisma directly
   - Maintains the same orchestration flow
   - Configures `keepCount: 3` to retain only 3 most recent records

2. **API-Driven Transform Task** (`transform-all-api.ts`):

   - Calls the Transform API endpoint for each entity
   - Maintains the same dependency order for transformations
   - Handles errors and reporting

3. **Orchestration Task** (`orchestrate-sync-api.ts`):
   - Coordinates the execution of sync and transform tasks
   - Ensures sync completes successfully before starting transform
   - Provides comprehensive error handling and reporting
   - Returns detailed results including success status and timing information

#### 3. Source Application (NowRepBlue) Integration

The source application includes a user-friendly interface for manually triggering and monitoring the sync process:

1. **UI Components**:

   - Sync dropdown button in the application header
   - Last sync timestamp display
   - Manual sync trigger button
   - Visual feedback during sync operations

2. **Server-Side Utilities**:

   - `triggerAndMonitorSync`: Handles the complete sync workflow
     - Initiates sync via the orchestration endpoint
     - Polls for task status until completion
     - Records timestamps for each status check
     - Returns comprehensive results including success status and timing data
   - Supporting functions for triggering sync and checking task status
   - Retrieves historical task information including last successful run

3. **Process Flow**:
   - User triggers sync manually via the header dropdown
   - System initiates the sync process and provides visual feedback
   - Application polls the target system to monitor progress
   - Upon completion, the UI updates with the new sync timestamp
   - Detailed error information is available in case of failures

#### 4. Security Considerations

- Authentication via `SYNC_SECRET_KEY` for all API endpoints
- Support for both `Authorization: Bearer` and `x-sync-secret` header formats
- Validation of input data before processing
- Detailed error logging without exposing sensitive information
- Environment variable validation in trigger.dev tasks

### Configuration Requirements

For the sync process to work correctly, the following environment variables must be set:

1. **In NowRepGreen (Target Application)**:

   - `SYNC_SECRET_KEY`: Secret key for authenticating sync requests
   - `DATABASE_URL`: Path to the SQLite database

2. **In Trigger.dev**:

   - `SYNC_SECRET_KEY`: Same secret key as in NowRepGreen
   - `TARGET_API_URL`: URL of the NowRepGreen application
   - `SOURCE_API_URL`: URL of the NowRepBlue API

3. **In NowRepBlue (Source Application)**:
   - `SYNC_SECRET_KEY`: Same secret key as in NowRepGreen
   - `TARGET_API_URL`: Comma-separated list of NowRepGreen URLs to try

### Monitoring and Troubleshooting

1. **Task Status Endpoint**:

   - Check the status of specific tasks: `/api/internal/task-status/{taskId}`
   - List recent tasks: `/api/internal/task-status/all`
   - Filter by task type: `/api/internal/task-status/all?type=orchestrate-sync-api`

2. **Trigger.dev Dashboard**:

   - Monitor task execution and logs
   - View detailed error information
   - Access via `npx @trigger.dev/cli@latest dev` or online dashboard

3. **Application Logs**:
   - Detailed logging throughout the sync process
   - Timestamps for each step
   - Error details for troubleshooting

# Initial Implementation of data sync process

## System Overview

NowRepGreen maintains a local copy of NowRepBlue data through an event-driven synchronization system, transforming JSON API responses into normalized relational data. The system is designed for reliability, zero-downtime updates, and automatic recovery.

## Architecture

### 1. Data Flow

```mermaid
graph TD
    A[NowRepBlue API] -->|Trigger.dev Task| B[sync-all-json Task]
    B -->|Store Raw JSON| C[JSON Stage Tables]
    C -->|Trigger.dev Task| D[transform-all-data Task]
    D -->|Transform & Version| E[Versioned Tables v1/v2]
    E -->|Dynamic View Switch| F[Current Views]
    F -->|Serve Data| G[NowRepGreen Application]

    subgraph "Data Storage"
    C
    E
    F
    end

    subgraph "Transformation Process"
    B
    D
    end
```

### 2. Entity Relationships

```mermaid
erDiagram
    Boards ||--o{ BoardsTalents : contains
    Boards ||--o{ BoardsPortfolios : contains
    Talents ||--o{ BoardsTalents : belongs_to
    Talents ||--o{ TalentsPortfolios : owns
    TalentsPortfolios ||--o{ PortfoliosMedia : contains
    PortfoliosMedia ||--o{ MediaTags : tagged_with
    Talents ||--o{ TalentsMeasurements : has
    Talents ||--o{ TalentsSocials : has
```

### 3. Components

- **API Endpoint** (`/api/internal/orchestrate-sync`): Receives sync triggers from NowRepBlue
- **Sync Task**: Fetches and stores raw JSON from all API endpoints
- **Transform Task**: Converts JSON to normalized relational structure
- **Version Manager**: Maintains table versions and views
- **Cleanup Process**: Removes outdated versions

### 4. Database Structure

#### Storage Tables

- `{entity}_json`: Raw JSON storage (keeps last 3 versions)
- `{entity}_v{n}`: Normalized data tables (v1, v2)
- `{entity}_current`: Views pointing to active version
- `sync_metadata`: Tracks active and backup versions

### 5. Implementation Guide

#### A. Task Structure

1. **Orchestration Endpoint** (`/api/internal/orchestrate-sync`):

   ```typescript
   export async function action({ request }: ActionFunctionArgs) {
     validateSecretKey(request);
     return await tasks.trigger<typeof orchestrateSyncTask>(
       "orchestrate-sync",
       undefined,
       {},
     );
   }
   ```

2. **JSON Sync Task** (`sync-all-json`):

   ```typescript
   export const syncAllJson = task({
     id: "sync-all-json",
     retry: {
       maxAttempts: 3,
       minTimeoutInMs: 1000,
       maxTimeoutInMs: 10000,
     },
   });
   ```

3. **Transform Task** (`transform-all-data`):
   ```typescript
   export const transformAllData = task({
     id: "transform-all-data",
   });
   ```

#### B. Version Management

1. Version Control:

   - Each entity maintains v1 and v2 tables
   - Active version alternates between v1 and v2
   - Current views automatically point to active version
   - Zero-downtime updates through atomic view switching

2. Version Tracking:
   ```typescript
   async function getNextVersion(entity: string) {
     const current = await prisma.syncMetadata.findFirst({
       where: { entityName: entity },
     });
     return {
       newVersion: current?.activeVersion === 1 ? 2 : 1,
       oldVersion: current?.activeVersion,
     };
   }
   ```

### 6. Transformation Order

1. Independent Entities:

   - Talents
   - Boards
   - MediaTags

2. Dependent Entities:

   - TalentsPortfolios
   - PortfoliosMedia
   - TalentsMeasurements
   - TalentsSocials

3. Junction Tables:
   - BoardsTalents
   - BoardsPortfolios
   - MediaTags_Junction

### 7. Error Handling

- Transaction-based atomic operations
- Retry mechanism for sync tasks
- Validation of sync secret key
- Granular error reporting per entity
- Automatic rollback capability

### 8. Security

- SYNC_SECRET_KEY validation for all sync triggers
- Environment-based configuration
- Secure API endpoints

### 9. Monitoring

Monitor sync process through:

```bash
npx @trigger.dev/cli@latest dev
```

Or access trigger.dev dashboard online

## Implementation Notes

- Using SQLite for data storage
- All media assets referenced via URLs
- Zero-downtime updates via view switching
- Type-safe transformations using TypeScript
- Automated cleanup of old JSON versions
