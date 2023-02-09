// React Resources
import React, { useEffect, useState } from "react";

// MUI Resources
import { Alert, AlertTitle } from "@mui/material";
import { Button, TextField, Stack, Box } from "@mui/material";

// Project Resources
import validate from "../resources/Validate";


function cleanName(name) {
    return name.toLowerCase().split(' ').join('')
}

// TODO: make this into a function instead of a class
class Input extends React.Component {
    constructor(props) {
        super(props);
        const errorState = this.props.required && !this.props.data[cleanName(this.props.name)]
        this.state = {
            check: false,
            error: errorState,
            help: errorState ? 'Please complete this field' : ''
        };

        this.props.setErrors(
            Object.assign(
                this.props.errors, 
                {[this.props.name]: errorState}
            ))
    
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
      }

    validate() {

    }
    
    handleChange(event) {
        let prunedValue = event.target.value
        if (this.props.validate === 'title') {
            // Remove whitespace
            prunedValue = prunedValue.replaceAll(/\s/g, '')
        }
        const [error, help] = validate(
            this.props.validate, 
            prunedValue, 
            this.props.password
        )

        this.setState({
            value: prunedValue,
            error: error,
            help: help
        });

        this.props.setErrors(
            Object.assign(
                this.props.errors, 
                {[this.props.name]: error}
            ))
        
        if (this.props.validate === 'password') {
            this.props.setPassword(event.target.value)
        }
        
        this.props.setData(Object.assign(this.props.data, {[cleanName(this.props.name)]: prunedValue}))
    }

    handleBlur(event) {
        this.setState({check: true})
    }

    render() {
        const error = (this.props.validate === 'confirm') && (this.props.password !== this.state.value)
        const help = error ? 'Passwords must match' : this.state.help
        return (
            <TextField 
            name={this.props.name}
            label={this.props.name}
            type={this.props.type} 
            required={this.props.required}
            multiline={this.props.multiline}
            value={this.props.data[cleanName(this.props.name)]} 
            placeholder={this.props.placeholder}
            error={((this.state.check || this.props.check) && (this.state.error || error))}
            helperText={(this.state.check || this.props.check) ? help : ''}
            onChange={this.handleChange} 
            onBlur={(event) => {this.handleBlur(event); this.handleChange(event)}}
            />
        )
    }
}

/**
 * Create a form component with automatic data updates and validation.
 * 
 * @param {list} inputs 
 * {title, type, placeholder, required, validate}
 * 
 * @param {map} data
 * the state access for form data
 * 
 * @param {function} setData
 * the state set function for form data
 * 
 * @param {text} buttonText
 * 
 * @param {function} handleSubmit
 * 
 * @param {string} formError
 */
export default function Form(props) {
    const [errors, setErrors] = useState({});
    const [check, setCheck] = useState(false);
    const [password, setPassword] = useState(false);

    const submit = (event) => {
        event.preventDefault()
        if (!Object.values(errors).includes(true)) {
            props.handleSubmit()
        } else {
            setCheck(true);
        }
    }
    
    return (
        <Box>
            <form onSubmit={submit} noValidate>
                <Stack spacing={2}>
                    {props.inputs.map((input) => (
                    <Input 
                    key={input.title}
                    name={input.title}
                    type={input.type}
                    required={input.required}
                    multiline={input.multiline}
                    placeholder={input.placeholder}
                    setData={props.setData}
                    data={props.data}
                    errors={errors}
                    setErrors={setErrors}
                    check={check}
                    validate={input.validate}
                    password={password}
                    setPassword={setPassword}
                    />
                    ))}
                    {props.children}
                    <Button type="submit" variant='contained'>{props.buttonText}</Button>
                    {props.formError ? 
                    <Alert severity="error" >
                        <AlertTitle>Error</AlertTitle>
                        {props.formError}
                    </Alert> : ''
                    }
                </Stack>
                
            </form>
        </Box>
    );
}