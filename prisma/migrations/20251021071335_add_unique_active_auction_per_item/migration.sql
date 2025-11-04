CREATE UNIQUE INDEX unique_active_auction_per_item
ON "Auction" ("itemId")
WHERE status = 'ACTIVE';