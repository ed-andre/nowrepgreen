# Deployment Strategy

## DEV BRANCH - Fly.io

### Initial Setup

1. **Install Fly CLI and authenticate**

   ```bash
   # Install Fly CLI (if not already installed)
   curl -L https://fly.io/install.sh | sh

   # Authenticate with Fly.io
   fly auth login
   ```

2. **Create a new Fly.io application**

   ```bash
   fly apps create nowrepgreen-e197-staging
   ```

3. **Set up GitHub environment and secrets**

   - Go to GitHub repository > Settings > Environments
   - Create a new environment named `nowrepgreen-e197-staging`
   - Add the following secrets to this environment:
     - `FLY_API_TOKEN`: Your Fly.io API token
     - `DATABASE_URL`: `file:/data/sqlite.db`
     - `TRIGGER_API_KEY`: Your Trigger.dev API key
     - `TRIGGER_SECRET_KEY`: Your Trigger.dev secret key
     - `SYNC_SECRET_KEY`: Secret key for sync validation
     - `SESSION_SECRET`: A secure random string
     - `TRIGGER_ACCESS_TOKEN`: Your Trigger.dev access token
     - `DOMAIN`: (Optional) custom domain if available
     - `SOURCE_API_URL`: URL for the source app (e.g.: https://nowrepblue-e197-staging.fly.dev)
     - `TARGET_API_URL`: URL for the this app (e.g.: https://nowrepgreen-e197-staging.fly.dev)

4. **Set up required secrets in Fly.io**

   ```bash
   # Generate a secure SESSION_SECRET
   fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app nowrepgreen-e197-staging

   # Set other required secrets
   fly secrets set DATABASE_URL="file:/data/sqlite.db" --app nowrepgreen-e197-staging
   fly secrets set TRIGGER_API_KEY="your-trigger-api-key" --app nowrepgreen-e197-staging
   fly secrets set TRIGGER_SECRET_KEY="your-trigger-secret-key" --app nowrepgreen-e197-staging
   fly secrets set SYNC_SECRET_KEY="your-sync-secret-key" --app nowrepgreen-e197-staging
   ```

5. **Create a persistent volume for SQLite database**
   ```bash
   fly volumes create data --size 1 --app nowrepgreen-e197-staging
   ```

### GitHub Actions Workflow

The deployment process is automated through GitHub Actions in `.github/workflows/deploy.yml`:

1. **Trigger**: Pushes to the `dev` branch

2. **Validation Steps**:

   - Linting (ESLint)
   - TypeScript type checking
   - Unit tests
   - Integration tests

3. **Pre-Deployment Backup**:

   - Creates a snapshot of the SQLite database volume
   - Maintains only the most recent snapshot
   - Uses timestamp naming for snapshots

4. **Deployment**:

   - Uses `flyctl deploy` to build and deploy the application
   - Passes environment variables from GitHub Secrets
   - Deploys to the staging environment

5. **Post-Deployment**:
   - Deploys Trigger.dev jobs

### Database Management

- SQLite database is stored in a persistent volume mounted at `/data`
- Database migrations run automatically during startup via `start.sh`
- Pre-deployment snapshots provide backup/rollback capability

### Environment Variables

All environment variables must be set in two places:

1. **Fly.io Secrets**: For runtime use by the application

   ```bash
   fly secrets set KEY=VALUE --app nowrepgreen-e197-staging
   ```

2. **GitHub Environment Secrets**: For use during CI/CD
   - All secrets must be added to the `nowrepgreen-e197-staging` environment in GitHub
   - These secrets are used during the build and deployment process
   - The GitHub workflow references these secrets when running tests and deploying
   - Missing secrets will cause the deployment to fail

> **Important**: The values should be identical in both Fly.io and GitHub to ensure consistent behavior between CI/CD and runtime.

### Dockerfile Configuration

The application uses a multi-stage Dockerfile that:

- Installs required dependencies
- Generates Prisma client
- Builds the application
- Sets up the runtime environment
- Configures the database path
- Runs migrations on startup

### Monitoring and Maintenance

- **View logs**:

  ```bash
  fly logs --app nowrepgreen-e197-staging
  ```

- **SSH into the application**:

  ```bash
  fly ssh console --app nowrepgreen-e197-staging
  ```

- **Manage database backups**:

  ```bash
  # List snapshots
  fly volumes snapshots list data --app nowrepgreen-e197-staging

  # Restore from snapshot
  fly volumes create data --app nowrepgreen-e197-staging --snapshot-id <snapshot-id>
  ```

- **Scale the application**:
  ```bash
  fly scale count 2 --app nowrepgreen-e197-staging
  ```

## MAIN BRANCH - Azure Container Apps

_Coming soon_
