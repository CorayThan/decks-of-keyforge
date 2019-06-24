import { FormLabel, IconButton, MenuItem, TextField } from "@material-ui/core"
import { Add } from "@material-ui/icons"
import { startCase } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"

const makeDefaultConstraint = () => ({
    property: "",
    cap: Cap.MIN,
    value: "0"
})

export class FiltersConstraintsStore {

    @observable
    constraints: Constraint[]

    constructor(initialConstraints?: Constraint[]) {
        this.constraints = initialConstraints ? initialConstraints : []
    }

    reset = () => this.constraints = []
    cleanConstraints = () => this.constraints.filter(constraint => !!constraint.property)
}

export interface ConstraintDropdownsProps {
    store: FiltersConstraintsStore
    properties: string[]
    hideMinMax: string[]
}

@observer
export class ConstraintDropdowns extends React.Component<ConstraintDropdownsProps> {
    render() {
        const {store, properties, hideMinMax} = this.props
        return (
            <div style={{width: "100%"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <FormLabel style={{marginRight: spacing(1)}}>Constraints</FormLabel>
                    <IconButton onClick={() => store.constraints.push(makeDefaultConstraint())}>
                        <Add fontSize={"small"}/>
                    </IconButton>
                </div>
                {store.constraints.map((constraint, idx) => (
                    <div style={{display: "flex", alignItems: "center", marginBottom: spacing(1)}} key={idx}>
                        <TextField
                            select={true}
                            value={constraint.property}
                            onChange={event => constraint.property = event.target.value}
                            style={{marginRight: spacing(2), flexGrow: 1}}
                        >
                            {properties.map(property => (
                                <MenuItem key={property} value={property}>
                                    {startCase(property)}
                                </MenuItem>
                            ))}
                        </TextField>
                        {hideMinMax.includes(constraint.property) ? null : (
                            <TextField
                                select={true}
                                value={constraint.cap}
                                onChange={event => constraint.cap = event.target.value as Cap}
                                style={{marginRight: spacing(2)}}
                            >
                                <MenuItem value={Cap.MIN}>
                                    Min
                                </MenuItem>
                                <MenuItem value={Cap.MAX}>
                                    Max
                                </MenuItem>
                            </TextField>
                        )}
                        <TextField
                            value={constraint.value}
                            type={"number"}
                            onChange={event => constraint.value = event.target.value}
                            style={{width: 40}}
                        />
                    </div>
                ))
                }
            </div>
        )
    }
}

export interface Constraint {
    property: string
    cap: Cap
    value: string
}

export enum Cap {
    MIN = "MIN",
    MAX = "MAX",
}
