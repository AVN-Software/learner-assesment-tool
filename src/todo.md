Implement Supabase’s built-in email/password authentication as the standard login method for the Coach Portal and Assessment Tool.

Key points:

Use Supabase Auth (supabase.auth.signInWithPassword) for all login flows.

Create and manage user accounts manually in the Supabase Dashboard (fellows, coaches, admins).

On successful login, store the session in context and redirect users to the main dashboard or assessment wizard.

Each user’s record links to their coach_id or fellow_id in the corresponding tables for data scoping.

The Supabase client automatically includes the session JWT, so all supabase.from() queries will respect authenticated access.

Later: enable Row-Level Security (RLS) to restrict reads/writes to each user’s own data.

Goal:
Unify authentication across all modules (Coach Portal, Data Hub, Assessment Tool) using Supabase Auth as the single source of truth for identity and permissions.