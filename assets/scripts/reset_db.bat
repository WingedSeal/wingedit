REM. > .\data\wingedit.db
sqlite3 ./data/wingedit.db < ./assets/scripts/create_tables.sql
sqlite3 ./data/wingedit.db < ./assets/scripts/populate_db.sql