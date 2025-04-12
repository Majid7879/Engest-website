function validateFormData(formData = '', rules = {
    isRequired: true,
    isEmail: false,
    isPhone: false,
    isNumber: false,
    isName: false,
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    shouldMatch: null,
    shouldNotMatch: null,
}) {
    let errors = [];
    // Check if the name is empty
    formData = formData.trim();
    if ((formData === "" || formData === null) && rules.isRequired) {
        errors.push("This field cannot be empty.");
    }

    // check minimun length
    if (formData.length < rules.minLength && rules.minLength !== null) {
        errors.push(`This field must be at least ${rules.minLength} characters long.`);
    }
    // check maximum length
    if (formData.length > rules.maxLength && rules.maxLength !== null) {
        errors.push(`This field must be at most ${rules.maxLength} characters long.`);
    }

    // check minimum value
    if (parseInt(formData) < rules.minValue && rules.isNumber && rules.minValue !== null) {
        errors.push(`This field must be at least ${rules.minValue}.`);
    }
    // check maximum value
    if (parseInt(formData) > rules.maxValue && rules.isNumber && rules.maxValue !== null) {
        errors.push(`This field must be at most ${rules.maxValue}.`);
    }

    return errors;
}