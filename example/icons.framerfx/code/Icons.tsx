import * as React from "react";
import { PropertyControls, ControlType } from "framer";
import * as IconsTable from "../data/icons.tsx"

const style: React.CSSProperties = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#8855FF",
    background: "rgba(136, 85, 255, 0.1)",
    overflow: "hidden",
};

// Define type of property
interface Props {
    name: string;
}

export class Icons extends React.Component<Props> {

    // Set default properties
    static defaultProps = {
    name: "arrow"
    }

    // Items shown in property panel
    static propertyControls: PropertyControls = {
    name: { type: ControlType.String, title: "Name" },
    }

    render() {
      console.log( "IconsTable", IconsTable);
    return <div style={style}>{IconsTable[this.props.name]}</div>;
    }
}
