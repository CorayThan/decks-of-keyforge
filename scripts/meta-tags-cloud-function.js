const path = require('path');
const https = require('https');
const zlib = require('zlib');

const contentUrl = 'https://d3vrfoel8dxoqo.cloudfront.net/index.html';

const replaceMetaRegex = /<!--Begin Replace-->[\s\S]*<!--End Replace-->/g

const postOptions = {
    hostname: "api.decksofkeyforge.com",
    port: 443,
    path: "/api/metadata",
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    }
}

const findMetaTagsWithUri = (uri, callback) => {
    let req = https.request(postOptions, (res) => {
        let response;
        let body = '';

        if (res.headers['content-encoding'] === 'gzip') {
            response = res.pipe(zlib.createGunzip());
        } else {
            response = res;
        }

        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                callback(true, body);
            } else {
                console.log("Oh no the dok server returned status code " + response.statusCode)
                callback(false)
            }
        });
    })

    req.on('error', (e) => {
        console.log('Error fetching meta data:', e);
        callback(false)
    });
    req.write(JSON.stringify({uri}))
    req.end()
};

const downloadContent = (url, callback) => {
    https.get(url, (res) => {
        let response;
        let body = '';

        if (res.headers['content-encoding'] === 'gzip') {
            response = res.pipe(zlib.createGunzip());
        } else {
            response = res;
        }

        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {
            callback(true, body, res.headers);
        });
    }).on('error', (e) => callback(false, e));
};

const fetchIndexHtmlAndCreateCloudFrontResponse = (metaTags, callback) => {

    https.get(contentUrl, (res) => {
        let response;
        let body = '';

        const headers = res.headers

        if (headers['content-encoding'] === 'gzip') {
            response = res.pipe(zlib.createGunzip());
        } else {
            response = res;
        }

        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {

            const finalBody = body.replace(replaceMetaRegex, metaTags);

            log("new body: " + finalBody)

            const buffer = zlib.gzipSync(finalBody);
            const base64EncodedBody = buffer.toString('base64');

            const responseHeaders = {
                'content-type': [{key: 'Content-Type', value: 'text/html'}],
                'content-encoding': [{key: 'Content-Encoding', value: 'gzip'}],
                'accept-ranges': [{key: 'Accept-Ranges', value: 'bytes'}]
            };

            let eTag = '';

            if (headers) {
                const lastModified = headers['last-modified'];
                const cacheControl = headers['cache-control'];
                const contentETag = headers['etag'];

                if (lastModified) {
                    responseHeaders['last-modified'] = [{key: 'Last-Modified', value: lastModified}]
                }

                if (cacheControl) {
                    responseHeaders['cache-control'] = [{key: 'Cache-Control', value: cacheControl}]
                }

                if (contentETag) {
                    eTag += contentETag.replace(/"/g, '');
                }
            }

            if (eTag !== '') {
                responseHeaders['etag'] = [{key: 'ETag', value: eTag}]
            }

            const newResponse = {
                status: '200',
                statusDescription: 'OK',
                headers: responseHeaders,
                body: base64EncodedBody,
                bodyEncoding: 'base64',
            };

            callback(true, newResponse);

        });
    }).on('error', (e) => callback(false, e));

};

exports.handler = (event, context, callback) => {
    const {request, config} = event.Records[0].cf;

    const originalUri = request.uri;
    const queryString = request.querystring
    const parsedPath = path.parse(originalUri);

    if (parsedPath.ext === '') {

        log("Parsing cloudfront request for uri: " + originalUri + " and ext: " + parsedPath.ext + " queryString: " + queryString)
        logPretty("Request info", JSON.stringify(request, 0, 2))

        request.uri = '/index.html';

        findMetaTagsWithUri(originalUri, (isOk, metaTags) => {
            logPretty("MetaTags", metaTags)
            if (!isOk) {
                return callback(null, request); // Return same request so CloudFront can process as usual.
            } else {
                fetchIndexHtmlAndCreateCloudFrontResponse(metaTags, (isOk, newResponse) => {
                    if (!isOk) {
                        log("Failed to fetch index.html")
                        return callback(null, request);
                    } else {
                        log("parsed out a new response")
                        return callback(null, newResponse);
                    }
                });
            }
        });
    } else {
        return callback(null, request);
    }
};

const log = (toLog) => {
    console.log(toLog)
}

const logPretty = (name, makePretty) => {
    console.log(name + ": " + JSON.stringify(makePretty, 0, 2))
}

const badIndex = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png">
    <link rel="manifest" href="%PUBLIC_URL%/site.webmanifest">
    <link rel="mask-icon" href="%PUBLIC_URL%/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#2196F3">
    <meta name="keywords" content="KeyForge,deck,decks,card,cards,SAS,crucible,buy,sell,search,AERC">

    <!--Begin Replace-->
    <title>Decks of KeyForge</title>
    <meta name="description" content="Search, evaluate, buy and sell KeyForge decks. Find synergies and antisynergies with the SAS and AERC rating systems.">

    <!-- Open Graph / Facebook Meta Tags -->

    <meta property="og:title" content="Decks of KeyForge">
    <meta property="og:description" content="Search, evaluate, buy and sell KeyForge decks. Find synergies and antisynergies with the SAS and AERC rating systems.">
    <meta property="og:image" content="https://dok-imgs.s3.us-west-2.amazonaws.com/dok-square.png">
    <meta property="og:image:width" content="256">
    <meta property="og:image:height" content="256">

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:image" content="https://dok-imgs.s3.us-west-2.amazonaws.com/dok-square.png">
    <!--End Replace-->

    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-132818841-1"></script>
    <script>

        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'UA-132818841-1');
    </script>

</head>
<body>
<noscript>
    You need to enable JavaScript to run this app.
</noscript>
<div>Terrible Terrible site</div>
</body>
</html>

`