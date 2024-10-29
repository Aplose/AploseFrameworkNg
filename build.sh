#!/bin/bash
rm -rf ./dist/aplose-framework-ng
ng build aplose-framework-ng
cd ./dist/aplose-framework-ng
npm pack
rm -rf ~/git-repos/archimedys/ArchimedysApp/node_modules/aplose-framework-ng
rm -rf ~/git-repos/SerenityDateApp/node_modules/aplose-framework-ng
cd ..
cp -rf ./aplose-framework-ng ~/git-repos/archimedys/ArchimedysApp/node_modules/
cp -rf ./aplose-framework-ng ~/git-repos/SerenityDateApp/node_modules/


