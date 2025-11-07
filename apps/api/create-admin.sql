-- First, check if user exists and get their ID
-- If they don't exist, we'll need to create them via the app first
SELECT id, email, role FROM "User" WHERE email = 'admin@botpe.com';
