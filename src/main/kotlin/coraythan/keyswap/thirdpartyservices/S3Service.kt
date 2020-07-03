package coraythan.keyswap.thirdpartyservices

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.ObjectMetadata
import com.amazonaws.services.s3.model.PutObjectRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileOutputStream
import java.util.*

@Service
class S3Service(
        @Value("\${aws-secret-key}")
        private val awsSecretkey: String
) {

    companion object {
        private const val userContentBucket = "dok-user-content"

        fun userContentUrl(key: String) = "${urlStart(userContentBucket)}$key"
        private fun urlStart(bucket: String) = "https://$bucket.s3-us-west-2.amazonaws.com/"
    }

    private val s3client = AmazonS3ClientBuilder
            .standard()
            .withCredentials(AWSStaticCredentialsProvider(BasicAWSCredentials(
                    "AKIAJDCMSGEGUEAQIVLQ",
                    awsSecretkey
            )))
            .withRegion(Regions.US_WEST_2)
            .build()

    fun addSpoilerCard(spoilerImage: MultipartFile, key: String) {
        val spoilerImageNormalFile = File(spoilerImage.originalFilename!!)
        val fileOutputStream = FileOutputStream(spoilerImageNormalFile)
        fileOutputStream.write(spoilerImage.bytes)
        fileOutputStream.close()
        s3client.putObject(
                "keyforge-card-images",
                key,
                spoilerImageNormalFile
        )
    }

    fun addDeckImage(deckImage: MultipartFile, deckId: Long, userId: UUID): String {

        val key = "deck-ownership/$deckId-$userId-${UUID.randomUUID()}.jpg"
        s3client.putObject(
                PutObjectRequest(
                        userContentBucket,
                        key,
                        deckImage.inputStream,
                        ObjectMetadata()
                                .apply {
                                    this.cacheControl = "max-age=31536000"
                                    this.contentType = "image/jpeg"
                                }
                )
        )
        return key
    }

    fun deleteUserContent(key: String) {
        s3client.deleteObject(
                userContentBucket,
                key
        )
    }
}
