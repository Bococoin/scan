#!/bin/bash

echo "Builing for production..."
rm -rf ./output
rm -rf ./bundle
mkdir ./output
meteor build ./output/ --architecture os.linux.x86_64 --server-only --allow-superuser

echo BUILD FINISHED
echo UNPACK BUNDLE

tar -xf ./output/explorer.tar.gz
ls -la ./bundle
# rm -rf output

echo INSTALL DEPENDENCIES
cd ./bundle/programs/server && meteor npm install --save
