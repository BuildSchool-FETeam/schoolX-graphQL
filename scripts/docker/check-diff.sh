CONTEXT=$1
echo "Compare diff with last commit" 

if [[ $(git diff --name-status HEAD^ HEAD -- "$CONTEXT") ]]; then
    echo "Need to build $CONTEXT"
    exit 0
else 
    echo "No need to build"
    exit 1
fi