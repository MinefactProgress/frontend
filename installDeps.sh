cd node_modules/@minefactprogress/schematicjs/
yarn build
cd ../schematicwebviewer
yarn build
cd ../../..
cp /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicwebviewer/src/renderer/transparent.json /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicwebviewer/dist/cjs/renderer
cp /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicwebviewer/src/renderer/nonOccluding.json /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicwebviewer/dist/esm/renderer
cp /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicjs/src/schematic/mcedit/legacy.json /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicjs/dist/esm/schematic/mcedit
cp /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicwebviewer/src/renderer/transparent.json /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicwebviewer/dist/esm/renderer
cp /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicjs/src/schematic/mcedit/legacy.json /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicjs/dist/cjs/schematic/mcedit
cp /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicwebviewer/src/renderer/nonOccluding.json /home/BuildTheEarth/MinefactProgress/frontend/node_modules/@minefactprogress/schematicwebviewer/dist/cjs/renderer
