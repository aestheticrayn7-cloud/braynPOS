SELECT id, name, code FROM "channels" WHERE name ILIKE '%HQ%' OR code = 'HQ';
SELECT i.name, i.sku, ib."channelId", ib."availableQty"
FROM "items" i
JOIN inventory_balances ib ON i.id = ib."itemId"
ORDER BY i.name;
