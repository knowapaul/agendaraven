import { Button, TextField, Stack } from "@mui/material";
import React from "react";
import validate from "./Validate";


class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    
        this.handleChange = this.handleChange.bind(this);
      }
    
      handleChange(event) {
        const [error, help] = validate(event.target.value, this.props.type)

        this.setState({
            value: event.target.value,
            error: error,
            help: help
        });

        
        this.props.setData(Object.assign(this.props.data, {[this.props.name.toLowerCase()]: event.target.value}))
        console.log(event.target.value, this.props.data)
      }

      render() {
        return (
            <TextField 
            name={this.props.name}
            label={this.props.name}
            type={this.props.type} 
            value={this.state.value} 
            placeholder={this.props.placeholder}
            error={this.state.error}
            helperText={this.state.help}
            onChange={this.handleChange} 
            />
        )
      }
    }


function Form(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <Stack spacing={2}>
                {props.inputs.map((input) => {
                    console.log('in', input)
                return (<Input 
                key={input.title}
                name={input.title}
                type={input.type}
                placeholder={input.placeholder}
                setData={props.setData}
                data={props.data}
                />
                )})}
                <Button type="submit" variant='contained'>{props.buttonText}</Button>
            </Stack>
            
        </form>
    );
}

export default Form;