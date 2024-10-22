#!/bin/bash

truncate -s 0 ./data/wingedit.db
sqlite3 ./data/wingedit.db < ./scripts/tables.sql
sqlite3 ./data/wingedit.db < ./scripts/valorant.sql
sqlite3 ./data/wingedit.db < ./scripts/auth.sql
sqlite3 ./data/wingedit.db < ./scripts/_example.sql