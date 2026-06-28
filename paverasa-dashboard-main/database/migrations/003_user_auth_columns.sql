SET @password_hash_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'password_hash'
);

SET @hashed_password_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'hashed_password'
);

SET @rename_password_column = IF(
  @password_hash_exists > 0 AND @hashed_password_exists = 0,
  'ALTER TABLE users CHANGE COLUMN password_hash hashed_password VARCHAR(255) NULL',
  'SELECT 1'
);

PREPARE rename_password_stmt FROM @rename_password_column;
EXECUTE rename_password_stmt;
DEALLOCATE PREPARE rename_password_stmt;

SET @add_hashed_password_column = IF(
  @password_hash_exists = 0 AND @hashed_password_exists = 0,
  'ALTER TABLE users ADD COLUMN hashed_password VARCHAR(255) NULL AFTER role',
  'SELECT 1'
);

PREPARE add_hashed_password_stmt FROM @add_hashed_password_column;
EXECUTE add_hashed_password_stmt;
DEALLOCATE PREPARE add_hashed_password_stmt;

SET @created_at_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'created_at'
);

SET @add_created_at_column = IF(
  @created_at_exists = 0,
  'ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER hashed_password',
  'SELECT 1'
);

PREPARE add_created_at_stmt FROM @add_created_at_column;
EXECUTE add_created_at_stmt;
DEALLOCATE PREPARE add_created_at_stmt;
