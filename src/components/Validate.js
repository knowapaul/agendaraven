function email(input) {
    const format = /^\w+@\w+\.\w+/;
    if (format.test(input)) {
        return [false, '']
    } else {
        return [
            true,
            'Please input a valid email address'
        ]
    }
}

function phone(input) {
    const adapted = input.replaceAll(/((?!\w).)/g, '')
    const format = /^\d{10}$/i

    if (format.test(adapted)) {
        return [false, '']
    } else {
        return [
            true, 
            'Must contain 10 digits and no letters.'
        ]
    }
}

function title(input) {
    const format = /^\w{2,20}$/
    if (format.test(input)) {
        
        return [false, '']
    } else {
        return [
            true,
            'Please input a name between 2 and 20 characters'
        ]
    }
}

function schedule(input) {
    const format = /^\w{2,20}$/
    if (format.test(input) || input.length=== 0) {
        return [false, '']
    } else {
        return [
            true,
            'Please input a name between 2 and 20 characters'
        ]
    }
}

function password(input) {
    if (input.length > 8) {
        return [false, '']
    } else {
        return [
            true,
            'Passwords must be longer than 8 characters'
        ]
    }
}

function confirm(input, password) {
    if (input === password) {
        return [false, '']
    } else {
        return [
            true,
            'Passwords must match'
        ]
    }
}



export default function vaildate(type, input, pass) {
    const func = {
        email: email,
        phone: phone,
        title: title,
        password: password,
        confirm: confirm,
        none: () => {return ([false, ''])},
        schedule: schedule,
    }
    return func[type](input, pass)
}