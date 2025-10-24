#!/bin/sh

set -e

export $(grep -v '^#' .env | xargs)

CONSTANTS_PATH="node_modules/dpg-mapa/src/handlers/constants.ts"

MAP_CENTER=$(grep 'center:' "$CONSTANTS_PATH" | sed -E 's/.*center:\s*\[([^]]+)\].*/[\1]/')
MAP_CENTER="[$MAP_CENTER]" 

MAP_ZOOM=$(grep 'zoom:' "$CONSTANTS_PATH" | sed -E 's/.*zoom:\s*([0-9]+).*/\1/' | tail -n 1)

ROOT_DIR=$(dirname "$(dirname "$(realpath "$0")")")
PACKAGE_JSON="$ROOT_DIR/package.json"
LANGUAGES_JSON="$ROOT_DIR/src/config/languages.json"
DIFFS_AREA_JSON="$ROOT_DIR/src/config/diff_area.json"
DIST_DIR="$ROOT_DIR/dist"
CONFIG_JSON="$DIST_DIR/config.json"

mkdir -p "$DIST_DIR"

PACKAGE_NAME=$(jq -r '.name' "$PACKAGE_JSON")
PACKAGE_VERSION=$(jq -r '.version' "$PACKAGE_JSON")

DEFAULT_LANGUAGE=$(jq -r '.defaultlanguage // "en-us"' "$LANGUAGES_JSON")

MAP_LAYERS_PATH="$ROOT_DIR/node_modules/dpg-mapa/src/assets/layers/mapLayers.json"

if [ -f "$MAP_LAYERS_PATH" ]; then
  CAMADAS_MAPA=$(jq -c '.mapLayers' "$MAP_LAYERS_PATH")
else
  CAMADAS_MAPA="[]"
fi

if [ -f "$DIFFS_AREA_JSON" ]; then
  LAYER_CODE=$(jq -r '.layer_code' "$DIFFS_AREA_JSON")
  IS_PROHIBITIVE=$(jq -r '.is_prohibitive' "$DIFFS_AREA_JSON")
  PERCENTUAL_LIMIT=$(jq -r '.percentual_limit' "$DIFFS_AREA_JSON")
else
  LAYER_CODE=""
  IS_PROHIBITIVE=""
  PERCENTUAL_LIMIT=""
fi

cat <<EOF > "$CONFIG_JSON"
{
  "frontend_project_name": "$PACKAGE_NAME",
  "frontend_version": "$PACKAGE_VERSION",
  "ci_version": "${APP_VERSION:-}",
  "backend_url": "${VITE_DPG_URL:-}",
  "vite_base_url": "${VITE_BASE_URL:-}",
  "mapa_center": $MAP_CENTER,
  "mapa_zoom_inicial": $MAP_ZOOM,
  "linguagem_padrao": "$DEFAULT_LANGUAGE",
  "camadas_mapa": $CAMADAS_MAPA,
  "diff_area": {
    "layer_code": "$LAYER_CODE",
    "is_prohibitive": $IS_PROHIBITIVE,
    "percentual_limit": $PERCENTUAL_LIMIT
  }
}
EOF

echo "Arquivo config.json gerado em $CONFIG_JSON"
