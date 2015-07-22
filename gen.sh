#!/bin/bash

mkdir -p output
node gen-v8-binding.js samples/global.json
node gen-v8-binding.js samples/point.json
