#!/bin/bash
FILE_NAME="migration-result.txt"
PATTERN="No need to run migration"
PATTERN_SUCCESS="executed successfully"


if [[ $(grep "$PATTERN" "$FILE_NAME") ]]; then
    echo "No need to revert migration"
    exit 0
elif [[ $(grep "$PATTERN_SUCCESS" "$FILE_NAME") ]]; then
    kubectl apply -f k8s/scripts/revert-migration.sh
fi
