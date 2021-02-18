package coraythan.keyswap.thirdpartyservices

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.ObjectMetadata
import com.amazonaws.services.s3.model.PutObjectRequest
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.*

@Service
class S3Service(
        @Value("\${aws-secret-key}")
        private val awsSecretkey: String,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

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

    fun addDeckImage(deckImage: MultipartFile, deckId: Long, userId: UUID, extension: String): String {
        return addImage(deckImage, "deck-ownership", "$deckId-$userId", extension)
    }

    fun addStoreIcon(storeIcon: MultipartFile, userId: UUID, extension: String): String {
        return addImage(storeIcon, "stores", "$userId-icon", extension)
    }

    fun addStoreBanner(storeBanner: MultipartFile, userId: UUID, extension: String): String {
        return addImage(storeBanner, "stores", "$userId-banner", extension)
    }

    fun addGenericUserImg(img: MultipartFile, extension: String): String {
        return addImage(img, "user-imgs", UUID.randomUUID().toString(), extension)
    }

    fun deleteUserContent(key: String) {
        s3client.deleteObject(
                userContentBucket,
                key
        )
    }

    private fun addImage(image: MultipartFile, folderName: String, details: String, extension: String? = null): String {

        val key = "$folderName/$details-${UUID.randomUUID()}${if (extension.isNullOrBlank()) "" else ".$extension"}"

        s3client.putObject(
                PutObjectRequest(
                        userContentBucket,
                        key,
                        image.inputStream,
                        ObjectMetadata()
                                .apply {
                                    this.cacheControl = "max-age=31536000"
                                    this.contentType = "image/jpeg"
                                }
                )
        )
        return key
    }
}
