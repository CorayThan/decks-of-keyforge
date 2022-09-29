
./gradlew genSrc
./gradlew build
./gradlew dockerCopyJar

$VERSION = Get-Content version.txt

cd ui

npm run build

cd ../docker

docker build -t "keyswap:$VERSION" .

aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 811687120814.dkr.ecr.us-west-2.amazonaws.com/decks-of-keyforge

docker tag "keyswap:$VERSION" 811687120814.dkr.ecr.us-west-2.amazonaws.com/decks-of-keyforge:$VERSION

docker push 811687120814.dkr.ecr.us-west-2.amazonaws.com/decks-of-keyforge:$VERSION

cd ../ui

aws s3 sync ./build s3://dok-frontend --exclude "index.html" --cache-control max-age=31536000
aws s3 sync ./build s3://dok-frontend --exclude "*" --include="index.html" --cache-control max-age=0

aws cloudfront create-invalidation --distribution-id E1C476PM892SYB --paths /index.html

"All done now!"
