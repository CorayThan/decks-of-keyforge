import { FormLabel, IconButton, MenuItem, TextField } from "@material-ui/core"
import { Add, Delete } from "@material-ui/icons"
import { startCase } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"

export enum Cap {
    MIN = "MIN",
    MAX = "MAX",
}

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
    removeConstraint = (idx: number) => this.constraints.splice(idx, 1)
}

export interface ConstraintDropdownsProps {
    store: FiltersConstraintsStore
    properties: string[]
    hideMinMax?: string[]
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
                    <div key={idx}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <TextField
                                select={true}
                                value={constraint.property}
                                onChange={event => constraint.property = event.target.value}
                                style={{marginRight: spacing(2), width: 192 }}
                            >
                                {properties.map(property => (
                                    <MenuItem key={property} value={property}>
                                        {startCase(property)}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <IconButton onClick={() => store.removeConstraint(idx)}>
                                <Delete fontSize={"small"}/>
                            </IconButton>
                        </div>
                        <div style={{display: "flex", alignItems: "center", marginBottom: spacing(1)}}>
                            {hideMinMax != null && hideMinMax.includes(constraint.property) ? null : (
                                <TextField
                                    select={true}
                                    value={constraint.cap}
                                    onChange={event => constraint.cap = event.target.value as Cap}
                                    style={{marginRight: spacing(2), width: 104}}
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
                                style={{width: 72, marginRight: spacing(1)}}
                            />
                        </div>
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
