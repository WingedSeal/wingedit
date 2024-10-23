REM. > .\data\wingedit.db
sqlite3 ./data/wingedit.db < ./scripts/sql/tables.sql
sqlite3 ./data/wingedit.db < ./scripts/sql/auth.sql
sqlite3 ./data/wingedit.db < ./scripts/sql/valorant.sql
sqlite3 ./data/wingedit.db < ./scripts/sql/_example.sql