-- 1. Add new status column
ALTER TABLE vending_machines
ADD COLUMN status VARCHAR(20);

-- 2. Preserve the existing active/inactive values
UPDATE vending_machines
SET status = CASE
    WHEN active = TRUE THEN 'ACTIVE'
    ELSE 'INACTIVE'
END;

-- 3. Make status mandatory
ALTER TABLE vending_machines
ALTER COLUMN status SET DEFAULT 'ACTIVE';

ALTER TABLE vending_machines
ALTER COLUMN status SET NOT NULL;

-- 4. Add timestamps
ALTER TABLE vending_machines
ADD COLUMN created_at TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP;

-- 5. Initialize timestamps for existing records
UPDATE vending_machines
SET created_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP;

-- 6. Make timestamps mandatory
ALTER TABLE vending_machines
ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE vending_machines
ALTER COLUMN updated_at SET NOT NULL;

-- 7. Remove old column
ALTER TABLE vending_machines
DROP COLUMN active;