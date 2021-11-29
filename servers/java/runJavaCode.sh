#!/bin/bash
if [[ ${?} -ne 0 ]] 
then
  echo "USAGE: ${0} [DIR_NAME] [CLASS_NAME]"
  exit 1
fi  

DIR_NAME="$1"
CLASS_NAME="$2"

PATH_FILE="$DIR_NAME/$CLASS_NAME"

cd $DIR_NAME

javac "$CLASS_NAME.java"

if [[ ${?} -ne 0 ]]
then 
  rm -r $DIR_NAME
  exit 1
fi

# for resolving some weird behavior any other command can help.
pwd

java "$CLASS_NAME"

rm -r "$DIR_NAME"