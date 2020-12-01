#!/bin/sh

if [[ -n $NODE_ENV ]]
then
  if [ $NODE_ENV = "production" ] || [ $NODE_ENV = "test" ]
  then
    # sleep 5 #enable only if container statup is asynchronous
    echo -e "Executing database migrations script..."
    npx sequelize-cli db:migrate
    echo -e "Executing database seeders script..."
    npx sequelize-cli db:seed:all
    echo -e "Executing server script..."
    node ./dist/index.js
  else
    echo -e "Environment variable NODE_ENV=${NODE_ENV} is not a valid value"
    exit 1
  fi
else
  echo -e "Environment variable NODE_ENV is required to start services"
  exit 1
fi
