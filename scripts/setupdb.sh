#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

POSTGRESQL_CONFIGURE_SQL=$DIR/postgresql/configurePostgresqlDatabase.sql
POSTGRESQL_RESTORE_SQL=$DIR/postgresql/restorePostgresqlDatabase.sql

function termsize() {
  TERM_HEIGHT=`expr $(tput lines) \* $1 / 100`
  TERM_WIDTH=`expr $(tput cols) \* $2 / 100`
  echo $TERM_HEIGHT $TERM_WIDTH
}

DATABASE=$(
whiptail \
--title "Dictionary Database Setup" \
--menu "Select An Operation" $(termsize 60 55) 3 \
  "1)" "Configure PostgreSQL Database Server" \
  "2)" "Restore PostgreSQL Database Server" 3>&2 2>&1 1>&3
)

case $DATABASE in
  "1)")
    HAS_FAILED=$(sudo -u postgres psql -a -f $POSTGRESQL_CONFIGURE_SQL 2>&1 > /dev/null)
    if [ -z "$HAS_FAILED" ]
    then
      exit 0
    else
      whiptail --msgbox "$HAS_FAILED" $(termsize 70 65)
    fi
  ;;

  "2)")
    HAS_FAILED=$(sudo -u postgres psql -a -f $POSTGRESQL_RESTORE_SQL 2>&1 > /dev/null)
    if [ -z "$HAS_FAILED" ]
    then
      exit 0
    else
      whiptail --msgbox "$HAS_FAILED" $(termsize 70 65)
    fi
  ;;

  *)
    exit
  ;;

esac
