SET @password_column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'password_hash'
);

SET @add_password_column = IF(
  @password_column_exists = 0,
  'ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL AFTER role',
  'SELECT 1'
);

PREPARE add_password_stmt FROM @add_password_column;
EXECUTE add_password_stmt;
DEALLOCATE PREPARE add_password_stmt;
