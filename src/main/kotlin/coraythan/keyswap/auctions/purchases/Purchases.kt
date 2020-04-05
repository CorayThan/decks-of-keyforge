package coraythan.keyswap.auctions.purchases

data class Purchases(
        val myPurchases: List<PurchaseSearchResult>,
        val mySales: List<PurchaseSearchResult>
)
