-- Investigation: What profiles exist?
SELECT id, email, role, full_name, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 20;
