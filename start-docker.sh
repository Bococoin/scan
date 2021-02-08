#!/bin/bash

echo "Starting Docker"
docker run -d -p 3000:3000  -e MONGO_URL=mongodb://bocoscan:123123123@18.223.52.186:27017/bocoscan -e METEOR_SETTINGS="$(cat settings.json)" --name boco-scan bococoin/boco-scan:1.0.0

