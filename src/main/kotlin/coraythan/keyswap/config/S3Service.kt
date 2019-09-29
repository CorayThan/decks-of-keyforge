package coraythan.keyswap.config

import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileOutputStream

@Service
class S3Service(
        @Value("\${aws-secret-key}")
        private val awsSecretkey: String
) {

    private val s3client = AmazonS3ClientBuilder
            .standard()
            .withCredentials(AWSStaticCredentialsProvider(BasicAWSCredentials(
                    "AKIAJDCMSGEGUEAQIVLQ",
                    awsSecretkey
            )))
            .withRegion(Regions.US_EAST_2)
            .build()

    fun addSpoilerCard(spoilerImage: MultipartFile, name: String, set: Int) {
        val spoilerImageNormalFile = File(spoilerImage.originalFilename!!)
        val fileOutputStream = FileOutputStream(spoilerImageNormalFile)
        fileOutputStream.write(spoilerImage.getBytes())
        fileOutputStream.close()
        s3client.putObject(
                "spoiler-images",
                set.toString() + "_" + name,
                spoilerImageNormalFile
        )
    }
}
