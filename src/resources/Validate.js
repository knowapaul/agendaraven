function email(input) {
    const format = /^\S+@\S+\.\S+/;
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

function role(input) {
    if ((input.length > 2 && input.length < 20) || input.length=== 0) {
        return [false, '']
    } else {
        return [
            true,
            'Please input a role name between 2 and 20 characters'
        ]
    }
}

function exists(input) {
    if (input.length > 0) {
        return [false, '']
    } else {
        return [
            true,
            'This field is required'
        ]
    }
}

function document(input) {
    if (/^[\w-\*#\u0020]{2,20}$/.test(input)) {
        return [false, '']
    } else {
        return [
            true,
            'Include 0 to 20 of these characters: a-z, A-Z, 0-9, +, -, _, *'
        ]
    }
}

function text(input) {
    if (/^.{2,30}$/.test(input)) {
        return [false, '']
    } else {
        return [
            true,
            'Include 0 to 30 characters with no line breaks'
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
        role: role,
        exists: exists,
        none: () => {return ([false, ''])},
        schedule: schedule,
        document: document,
        text: text
    }
    return func[type](input, pass)
}