import { Button, ButtonProps } from "@material-ui/core"
import React, { ChangeEvent } from "react"

interface FileUploadButtonProps extends ButtonProps {
    fileType: FileUploadType
    handleUpload: (event: ChangeEvent<HTMLInputElement>) => void
    id: string
}

export enum FileUploadType {
    IMAGE
}

export const FileUploadButton = (props: FileUploadButtonProps) => {
    const {disabled, children, fileType, id, handleUpload, ...buttonProps} = props

    let accept
    switch (fileType) {
        case FileUploadType.IMAGE:
            accept = "image/jpeg;image/png"
            break
    }

    const inputId = "file-upload-" + id

    return (
        <>
            <input
                type="file"
                accept={accept}
                style={{display: "none"}}
                onChange={handleUpload}
                id={inputId}
                disabled={disabled}
            />
            <label htmlFor={inputId}>
                <Button {...buttonProps} component={"span"} disabled={disabled}>
                    {children}
                </Button>
            </label>
        </>
    )
}