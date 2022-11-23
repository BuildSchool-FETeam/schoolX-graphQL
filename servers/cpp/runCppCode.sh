#!/bin/bash
FILE_NAME=$2
DIR_NAME=$1

cd "$DIR_NAME"

g++ -o "$FILE_NAME.exe" "$FILE_NAME.cpp"

if [ $? -ne 0 ]
then
    rm -r "$DIR_NAME"
    exit 1
fi

"./$FILE_NAME.exe"

cd ..

rm -r "$DIR_NAME"