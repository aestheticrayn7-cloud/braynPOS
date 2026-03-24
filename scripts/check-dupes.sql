SELECT name, COUNT(*) 
FROM categories 
WHERE "deletedAt" IS NULL 
GROUP BY name 
HAVING COUNT(*) > 1;
