package coraythan.keyswap.emails

import coraythan.keyswap.config.AppLinks
import kotlinx.html.*
import kotlinx.html.stream.createHTML

object EmailFormatter {
    fun format(title: String, contents: String, bottomContent: String? = null, links: AppLinks) = createHTML()
            .div {
                style = """
                    max-width: 600px;
                    margin: 16px;
                    border-radius: 8px;
                    border: 1px solid #EEE;
                    background-color: #FFF;
                    margin: 0 auto;                    
                """.trimIndent()

                table {
                    style = """
                        width: 100%;
                        border-spacing: 0px;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                    """.trimIndent()

                    tbody {
                        tr {
                            style = """
                                background-color: rgb(33, 150, 243);
                                border-top-left-radius: 8px;
                                border-top-right-radius: 8px;                                
                            """.trimIndent()
                            
                            td {
                                style = """
                                    border-top-left-radius: 8px;
                                    padding: 16px;
                                    width: 48px;
                                    height: 48px;
                                """.trimMargin()
                                div {
                                    style = """
                                        border-top-left-radius: 8px;
                                        width: 48px;
                                        height: 48px;                                        
                                    """.trimIndent()
                                    
                                    +"~~dok-img~~"
                                }
                            }
                            td {
                                style = """
                                    border-top-right-radius: 8px;
                                    padding: 14px;
                                    padding-left: 0;    
                                """.trimIndent()
                                
                                attributes.put("valign", "bottom")
                                div {
                                    p {
                                        style = """
                                            font-size: 30px;
                                            font-weight: 600;
                                            color: #FFF;
                                            margin: 0;    
                                        """.trimIndent()
                                        
                                        +title
                                    }
                                }
                            }
                        }
                    }
                }

                div {
                    style = """
                        padding: 16px;
                        font-size: 16px;
                    """.trimIndent()
                    +"~~contents~~"
                }

                if (bottomContent != null) {
                    table {
                        style = """
                            width: 100%;
                            border-spacing: 0px;
                            border-bottom-left-radius: 8px;
                            border-bottom-right-radius: 8px;
                            border-collapse: separate !important;
                        """.trimIndent()

                        tbody {
                            tr {
                                style = """
                                    background-color: #f5f5f5;
                                    border-bottom-left-radius: 8px;
                                    border-bottom-right-radius: 8px;
                                """.trimIndent()

                                td {
                                    style = """
                                        padding: 16px;
                                        border-bottom-left-radius: 8px;
                                        border-bottom-right-radius: 8px;
                                    """.trimIndent()

                                    i {
                                        style = """
                                            color: #555;
                                        """.trimIndent()
                                        +"~~bottom-content~~"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .replace("~~contents~~", contents)
            .replace("~~bottom-content~~", bottomContent ?: "")
            .replace("~~dok-img~~", links.dokImg())
}