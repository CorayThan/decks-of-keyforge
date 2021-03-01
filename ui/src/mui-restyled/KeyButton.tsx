import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import Button from "@material-ui/core/Button/Button"
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress"
import { Visibility, VisibilityOff } from "@material-ui/icons"
import * as React from "react"
import { useState } from "react"
import { spacing } from "../config/MuiConfig"

interface KeyButtonProps extends ButtonProps {
    loading?: boolean
    component?: string
    icon?: boolean
}

export const KeyButton = (props: KeyButtonProps) => {
    const {loading, children, icon, color, style, ...rest} = props
    return (
        <Button
            color={color}
            size={icon ? "small" : undefined}
            style={{width: icon ? 32 : undefined, height: icon ? 32 : undefined, minWidth: icon ? 32 : undefined, minHeight: icon ? 32 : undefined, ...style}}
            {...rest}
        >
            {children}
            {loading ? (
                <CircularProgress
                    color={color === "primary" ? "inherit" : "primary"}
                    style={{marginLeft: spacing(1)}}
                    size={spacing(2)}
                />
            ) : null}
        </Button>
    )
}

interface SafeButtonProps extends ButtonProps {
    title: string
    description: string
    warning: string
    image?: string
    onConfirm: (password: string) => void
    confirmButtonName?: string
}

export const SafeKeyButton = (props: SafeButtonProps) => {
    const {title, description, warning, image, onConfirm, confirmButtonName, ...rest} = props
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmed, setConfirmed] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    return (
        <>
            <Button
                {...rest}
                onClick={(event) => {
                    setOpen(true)
                }}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {image && (
                        <Box display={"flex"} justifyContent={"center"} mb={2}>
                            <img width={200} src={image}/>
                        </Box>
                    )}
                    <DialogContentText gutterBottom={true}>
                        {description}
                    </DialogContentText>
                    <DialogContentText style={{marginBottom: spacing(2)}} color={"error"}>
                        {warning} Please enter your password to continue.
                    </DialogContentText>
                    <FormControl
                        variant={"outlined"}
                        style={{marginBottom: spacing(2)}}
                    >
                        <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            id={"confirm-password"}
                            type={showPassword ? "text" : "password"}
                            value={confirmed}
                            onChange={(event) => setConfirmed(event.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault()}
                                    >
                                        {showPassword ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                    <KeyButton
                        loading={loading}
                        color={"primary"}
                        disabled={loading || confirmed.trim().length === 0}
                        onClick={async () => {
                            setLoading(true)
                            await onConfirm(confirmed)
                            setOpen(false)
                            setLoading(false)
                        }}
                    >
                        {confirmButtonName ?? "Confirm"}
                    </KeyButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

