#!/bin/bash
ng build aplose-framework-ng
cd ./dist/aplose-framework-ng
npm pack
npm publish --access public