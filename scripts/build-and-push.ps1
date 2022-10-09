
docker --version

./gradlew genSrc

cd ui

npm run build
cd ../src/main/resources
rm static -r -Force
xcopy ..\..\..\ui\build static /i /s
cd ../../../

./gradlew build
./gradlew dockerCopyJar

$VERSION = Get-Content version.txt

cd ./docker

docker build -t "keyswap:$VERSION" .

aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 811687120814.dkr.ecr.us-west-2.amazonaws.com/decks-of-keyforge

docker tag "keyswap:$VERSION" 811687120814.dkr.ecr.us-west-2.amazonaws.com/decks-of-keyforge:$VERSION

docker push 811687120814.dkr.ecr.us-west-2.amazonaws.com/decks-of-keyforge:$VERSION

"All done now!"
