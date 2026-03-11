#!/bin/bash

# Generate SRI hashes for bookmarklet scripts
# Usage: ./generate-sri.sh path/to/script.js [path/to/another/script.js ...]

if [ $# -eq 0 ]; then
  echo "Usage: $0 path/to/script.js [path/to/another/script.js ...]"
  echo "Example: $0 bookmarklets/*.js"
  exit 1
fi

for file in "$@"; do
  if [ -f "$file" ]; then
    echo -n "$file: sha384-"
    cat "$file" | openssl dgst -sha384 -binary | openssl base64 -A
  else
    echo "Error: File $file not found"
  fi
done
