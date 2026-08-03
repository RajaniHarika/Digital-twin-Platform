#!/bin/bash
# Fix MySQL user grants so dtadmin can connect from any pod IP
mysql -u root -p'DT@RootPass2024!' <<'EOF'
CREATE USER IF NOT EXISTS 'dtadmin'@'%' IDENTIFIED BY 'DT@UserPass2024!';
ALTER USER 'dtadmin'@'%' IDENTIFIED BY 'DT@UserPass2024!';
GRANT ALL PRIVILEGES ON digitaltwin.* TO 'dtadmin'@'%';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'dtadmin'@'%';
EOF
