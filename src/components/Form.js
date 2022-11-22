import { Button, TextField, Stack } from "@mui/material";
import React, { useState } from "react";
import validate from "./Validate";

function cleanName(name) {
    return name.toLowerCase().split(' ').join('')
}
class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '', 
            check: false,
            error: this.props.required,
            help: this.props.required ? 'Please complete this field' : ''
        };

        this.props.setErrors(
            Object.assign(
                this.props.errors, 
                {[this.props.name]: this.props.required}
            ))
    
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
      }
    
    handleChange(event) {
        const [error, help] = validate(
            this.props.validate, 
            event.target.value, 
            this.props.password
        )

        this.setState({
            value: event.target.value,
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
        
        this.props.setData(Object.assign(this.props.data, {[cleanName(this.props.name)]: event.target.value}))
        console.log(event.target.value, this.props.data)
    }

    handleBlur(event) {
        this.setState({check: true})
        console.log('blurring')
    }

    render() {
        const error = (this.props.validate === 'confirm') && (this.props.password != this.state.value)
        const help = error ? 'Passwords must match' : this.state.help
        return (
            <TextField 
            name={this.props.name}
            label={this.props.name}
            type={this.props.type} 
            required={this.props.required}
            value={this.state.value} 
            placeholder={this.props.placeholder}
            error={((this.state.check || this.props.check) && (this.state.error || error))}
            helperText={(this.state.check || this.props.check) ? help : ''}
            onChange={this.handleChange} 
            onBlur={this.handleBlur}
            />
        )
      }
    }

/**
 * Create a form component with automatic data updates and validation.
 * 
 * @param {list} inputs 
 * {title: title, type: type, placeholder: placeholder, required: required}
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
 */
function Form(props) {
    const [errors, setErrors] = useState({});
    const [check, setCheck] = useState(false);
    const [password, setPassword] = useState(false);

    const submit = (event) => {
        console.log(errors)
        event.preventDefault()
        if (!Object.values(errors).includes(true)) {
            props.handleSubmit()
        } else {
            setCheck(true);
        }
    }

    return (
        <form onSubmit={submit} noValidate>
            <Stack spacing={2}>
                {props.inputs.map((input) => (
                <Input 
                key={input.title}
                name={input.title}
                type={input.type}
                required={input.required}
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
                <Button type="submit" variant='contained'>{props.buttonText}</Button>
            </Stack>
            
        </form>
    );
}

export default Form;