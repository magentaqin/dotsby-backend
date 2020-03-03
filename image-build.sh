#! /usr/bin/env bash
#
# The script used to build docker image for the project
#

branch=$(git branch | grep \* | cut -d ' ' -f2)
commit_hash=$(git show-ref --head HEAD$ --hash=7)

echo "Build docker image for branch: *$branch* and commit: *$commit_hash*."
echo '--------------------------------------------------------------------'

new_image=registry.cn-shenzhen.aliyuncs.com/dotsby/dotsby-backend:$branch-$commit_hash
docker build -t $new_image .

echo "Push the new image to registry."
echo '--------------------------------------------------------------------'

docker push $new_image
