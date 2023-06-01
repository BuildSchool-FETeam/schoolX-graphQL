#!/bin/bash
FILE_NAME="migration-result.txt"
kubectl logs -l job-name=migration > $FILE_NAME
PATTERN_1="No need to run migration"
PATTERN_2="executed successfully"

cat $FILE_NAME

if [[ $(grep "$PATTERN_1" "$FILE_NAME") || $(grep "$PATTERN_2" "$FILE_NAME") ]]
then
    echo "Migrate successfully" 
    exit 0
else 
    echo "Migrate failed"
    exit 1
fi