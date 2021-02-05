import { Button, IconButton, MenuItem, TextField } from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import { startCase } from "lodash"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { Utils } from "../../config/Utils"
import { Constraint } from "../../generated-src/Constraint"

export enum Cap {
    MIN = "MIN",
    MAX = "MAX",
    EQUALS = "EQUALS",
}

export class FiltersConstraintsStore {

    @observable
    constraints: Constraint[]

    constructor(initialConstraints?: Constraint[]) {
        makeObservable(this)
        this.constraints = initialConstraints ? initialConstraints : []
        if (initialConstraints == null || initialConstraints.length === 0) {
            this.addDefault()
        }
    }

    reset = () => this.constraints = []
    cleanConstraints = () => this.constraints.filter(constraint => !!constraint.property)
    removeConstraint = (idx: number) => this.constraints.splice(idx, 1)

    addDefault = () => {
        this.constraints.push({
            property: "",
            cap: Cap.MIN,
            value: 0
        })
    }

    isDefaultConstraints = () => {
        return Utils.equals(this.constraints, this.defaultConstraints())
    }

    private defaultConstraints = () => [{
        property: "",
        cap: Cap.MIN,
        value: 0
    }]
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
                {store.constraints.map((constraint, idx) => (
                    <div key={idx}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <TextField
                                select={true}
                                value={constraint.property}
                                onChange={event => constraint.property = event.target.value}
                                style={{marginRight: spacing(2), width: 192}}
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
                                    <MenuItem value={Cap.EQUALS}>
                                        Equals
                                    </MenuItem>
                                </TextField>
                            )}
                            <TextField
                                value={constraint.value}
                                type={"number"}
                                onChange={event => constraint.value = Number(event.target.value)}
                                style={{width: 72, marginRight: spacing(1)}}
                            />
                        </div>
                    </div>
                ))}
                <Button onClick={store.addDefault} style={{marginTop: spacing(1)}}>
                    Add Constraint
                </Button>
            </div>
        )
    }
}
