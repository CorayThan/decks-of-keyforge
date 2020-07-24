import { Button, ButtonGroup } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { SendEmailDialog, SendEmailDialogStore } from "../../emails/SendEmailDialog"
import { OfferDto } from "../../generated-src/OfferDto"
import { OfferStatus } from "../../generated-src/OfferStatus"
import { offerStore } from "./OfferStore"

interface OfferActionProps {
    offer: OfferDto
}

@observer
export class OfferActions extends React.Component<OfferActionProps> {

    emailStore = new SendEmailDialogStore()

    render() {
        const {id, status, senderArchived, recipientArchived} = this.props.offer

        const isFromMe = offerStore.offerIsFromMe(id)
        const isToMe = offerStore.offerIsToMe(id)

        if (!isFromMe && !isToMe) {
            return null
        }

        const actions: React.ReactNode[] = []

        if (isFromMe) {
            if (status === OfferStatus.SENT) {
                actions.push(
                    <Button
                        key={"cancel"}
                        onClick={() => offerStore.cancelOffer(id)}
                    >
                        Cancel
                    </Button>
                )
            }

        }

        if (isToMe) {
            if (status === OfferStatus.SENT) {
                actions.push(
                    <Button
                        key={"accept"}
                        onClick={() => offerStore.acceptOffer(id)}
                    >
                        Accept
                    </Button>
                )
                actions.push(
                    <Button
                        key={"reject"}
                        onClick={() => offerStore.rejectOffer(id)}
                    >
                        Reject
                    </Button>
                )
            }
        }

        if (status !== OfferStatus.SENT) {
            const isArchived = (senderArchived && isFromMe) || (recipientArchived && isToMe)
            actions.push(
                <Button
                    key={"archive"}
                    onClick={() => offerStore.archiveOffer(id, !isArchived)}
                >
                    {isArchived ? "Unarchive" : "Archive"}
                </Button>
            )
        }

        actions.push(
            <Button
                key={"email"}
                onClick={() => this.emailStore.handleOpen()}
            >
                Email
            </Button>
        )

        return (
            <div>
                <ButtonGroup
                    orientation="vertical"
                    color="primary"
                >
                    {actions}
                </ButtonGroup>
                <SendEmailDialog offerId={id} buttonText={"Email"} store={this.emailStore}/>
            </div>
        )
    }
}
