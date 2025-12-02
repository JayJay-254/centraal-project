# Deployment to Render (example)

This document explains how to deploy the Central Adventures Django app to Render.com with a managed database and S3 media storage.

Quick summary
- Use the provided `render.yaml` or manually set Render web service `Start Command` to:

```
gunicorn central_adventures.wsgi:application --bind 0.0.0.0:$PORT
```

- Set environment variables on Render:
  - `SECRET_KEY` (a secure generated key)
  - `DEBUG = False`
  - `ALLOWED_HOSTS = your-render-domain.onrender.com` (or use render's auto-generated domain)
  - `DATABASE_URL` (Render's managed Postgres — auto-provided if you attach a database)
  - (Optional) AWS S3 credentials if you want persistent media storage

Render deployment steps
1. Push your code to GitHub (main branch).
2. Go to render.com and create a new Web Service.
3. Connect your GitHub repo and select the `main` branch.
4. In the service settings:
   - **Name**: central-adventures
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn central_adventures.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan**: Free (or paid if desired)

5. Add environment variables (click "Environment"):
   - `DEBUG = False`
   - `SECRET_KEY = <your-secret-key>` (use a secure generated value, NOT the dev key)
   - `ALLOWED_HOSTS = *` (or restrict to your domain: `yourdomain.onrender.com`)

6. (Optional) Add a PostgreSQL database:
   - Click "Database" in Render and create a managed PostgreSQL instance.
   - Render will auto-set `DATABASE_URL` in the web service environment.
   - No manual `DATABASE_URL` env var needed if you link a database.

7. Deploy — Render runs the build command (migrations + collectstatic) and starts the web service.

Environment variables explained
- `SECRET_KEY`: Django secret key. Generate a new one (do NOT use the development key in the code). Use `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` to generate one.
- `DEBUG = False`: Disables debug mode (required for production).
- `ALLOWED_HOSTS`: Comma-separated list of domain names the app responds to. Set to your Render domain or `*` (less secure but simpler for testing).
- `DATABASE_URL`: Auto-set by Render if you attach a Postgres instance. Format: `postgres://user:pass@host:port/dbname`.

S3 media storage (optional)
- By default, media uploads (user profile images, gallery images) are stored on Render's ephemeral filesystem (lost on redeploy).
- To persist media uploads, use AWS S3. Add these environment variables on Render:
  - `AWS_ACCESS_KEY_ID`: Your AWS access key.
  - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.
  - `AWS_STORAGE_BUCKET_NAME`: Your S3 bucket name.
  - `AWS_S3_REGION_NAME`: AWS region (e.g., `us-east-1`).

Once set, all media uploads go to S3 and persist across redeployments.

Troubleshooting
- **"django.core.exceptions.ImproperlyConfigured: The SECRET_KEY setting must not be empty"** — Set `SECRET_KEY` env var on Render.
- **"ValueError: settings.DATABASES is improperly configured"** — If using Postgres, ensure `DATABASE_URL` is set (auto-done if you attach a Render database).
- **Static files 404** — Ensure `collectstatic` ran during build. Check build logs on Render.
- **Media uploads not persisting** — Use S3 (add AWS env vars) or Render's persistent disk feature.

Render.yaml (alternative)
Instead of manual settings, you can use the included `render.yaml` file. However, you must still set secret environment variables in the Render dashboard (they cannot be in the YAML file for security).

Testing locally before deploy
- Run `python manage.py runserver` and test signup/login/admin flows.
- Test admin at `http://localhost:8000/admin/` (use superuser credentials).
- Verify static files load and profile/gallery image uploads work.
- Run `python manage.py check` to catch any configuration issues.

Further reading
- Render docs: https://render.com/docs
- Django deployment checklist: https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/
