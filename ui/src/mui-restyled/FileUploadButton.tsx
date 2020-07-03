import { Button, ButtonProps } from "@material-ui/core"
import React, { ChangeEvent } from "react"

interface FileUploadButtonProps extends ButtonProps {
    fileType: FileUploadType
    handleUpload: (event: ChangeEvent<HTMLInputElement>) => void
}

export enum FileUploadType {
    IMAGE
}

export const FileUploadButton = (props: FileUploadButtonProps) => {
    const {disabled, children, fileType, handleUpload, ...buttonProps} = props

    let accept
    switch (fileType) {
        case FileUploadType.IMAGE:
            accept = "image/jpeg"
            break
    }

    return (
        <>
            <input
                type="file"
                accept={accept}
                style={{display: "none"}}
                onChange={handleUpload}
                id={"file-upload"}
                disabled={disabled}
            />
            <label htmlFor={"file-upload"}>
                <Button {...buttonProps} component={"span"} disabled={disabled}>
                    {children}
                </Button>
            </label>
        </>
    )
}