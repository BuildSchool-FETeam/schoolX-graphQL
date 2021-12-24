#!/bin/sh
PASS_PHRASE="$1"
FILE_NAME="$2"

# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$PASS_PHRASE" \
--output "$HOME/$FILE_NAME" "$FILE_NAME.gpg"