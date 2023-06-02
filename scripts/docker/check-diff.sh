CONTEXT=$1
FILE_NAME=$2
echo "Compare diff with last commit" 
echo "Save data to workspace/diff-result"

CHECK_RESULT=$(git diff --name-status HEAD^ HEAD -- "$CONTEXT")
echo "Diff result:"
echo "$CHECK_RESULT"

mkdir workspace
if [ ! -z "$CHECK_RESULT" ]; then
    # Later fix to Need to build
    echo "Need to build $CONTEXT" > workspace/diff-result-$FILE_NAME
else 
    echo "No need to build" > workspace/diff-result-$FILE_NAME
fi