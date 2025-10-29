#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp "$SCRIPT_DIR/day_conf.csv" "$SCRIPT_DIR/target/day_conf.csv"
cp "$SCRIPT_DIR/gen_input.json" "$SCRIPT_DIR/target/gen_input.json"