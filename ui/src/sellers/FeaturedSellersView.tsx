import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { landingPageDrawerWidth, LandingPageTitle } from "../landing/LandingPage"
import { Loader } from "../mui-restyled/Loader"
import { screenStore } from "../ui/ScreenStore"
import { SellerCard } from "./SellerCard"
import { sellerStore } from "./SellerStore"

@observer
export class FeaturedSellersView extends React.Component<{}> {

    componentDidMount(): void {
        sellerStore.findFeaturedSellers()
    }

    render() {
        const sellers = sellerStore.featuredSellers

        if (sellers == null) {
            return <Loader/>
        } else if (sellers.length === 0) {
            return null
        }

        const screenWidth = screenStore.screenWidth
        const availableWidth = screenWidth - (screenStore.screenSizeSm() ? 24 : (landingPageDrawerWidth + 24))

        return (
            <>
                <div style={{marginLeft: spacing(4)}}>
                    <LandingPageTitle>
                        Featured Sellers
                    </LandingPageTitle>
                </div>
                <div style={{display: "flex", overflowX: "auto", maxWidth: availableWidth}}>
                    <div style={{marginLeft: spacing(2)}}/>
                    {sellers.map(seller => <SellerCard sellerDetails={seller} style={{flex: "0 0 auto"}} key={seller.username}/>)}
                    <div style={{paddingLeft: spacing(2)}}/>
                </div>
            </>
        )
    }
}
