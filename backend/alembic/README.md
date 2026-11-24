# Migrations (stub)

Current deployment uses `Base.metadata.create_all()` on startup (see `app/main.py`).
For PostgreSQL production, initialise Alembic properly:

```
alembic init alembic
# set sqlalchemy.url in alembic.ini, target_metadata = Base.metadata in env.py
alembic revision --autogenerate -m "init"
alembic upgrade head
```

This folder is a placeholder so the structure exists; do not claim migrations
have run until the commands above have actually been executed against the target DB.
