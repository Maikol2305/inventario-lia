-- Triggers for LÍA Inventory

-- 1. Function to update timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger: Update timestamp on product change
CREATE TRIGGER update_product_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE update_last_updated_column();


-- 2. Function to log inventory changes automatically
CREATE OR REPLACE FUNCTION log_stock_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.quantity IS DISTINCT FROM NEW.quantity) THEN
        INSERT INTO inventory_log (product_id, change_amount, reason, timestamp)
        VALUES (NEW.id, NEW.quantity - OLD.quantity, 'Automatic update from trigger', CURRENT_TIMESTAMP);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger: Log inventory changes
CREATE TRIGGER trigger_log_inventory
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE log_stock_changes();


-- Stored Procedures (Functions)

-- Function to get products with low stock (below their own min_stock)
CREATE OR REPLACE FUNCTION get_products_below_min_stock()
RETURNS TABLE(id INT, name TEXT, sku VARCHAR, quantity INT, min_stock INT) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.name, p.sku, p.quantity, p.min_stock
    FROM products p
    WHERE p.quantity <= p.min_stock;
END;
$$ LANGUAGE 'plpgsql';


-- Procedure to perform a secure inventory transaction
CREATE OR REPLACE PROCEDURE secure_update_stock(p_id INT, p_change_amount INT, p_reason TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- This transaction ensures we don't go below 0 if not allowed by check constraint
    UPDATE products
    SET quantity = quantity + p_change_amount
    WHERE id = p_id;
    
    -- Explicit log entry if needed, but trigger already handles automatic logging
    -- If trigger is not used, we would do it here.
END;
$$;
