//
// A configurable wrapper around HTML5 form validation. Provides hooks at both
// the form and field levels as well as conventions for custom validation.
//
// - Set <form novalidate> to suppress native validation messages
// - Uses Object.assign, which should be polyfilled for IE11
//

const defaultOptions = {
  // Set to false to only validate on submit
  trigger: 'change',

  // Select fields to validate. Can be used with validateCustom() to validate
  // non-standard elements (ex: Stripe Checkout)
  fieldSelector: '[data-validate]',

  // Optionally exclude some fields before each validation
  fieldFilter(fields) {
    return fields.filter(field => !field.disabled);
  },

  // Custom validators. Matched by field[name]. Must return a promise.
  customValidators: {
    // checkboxes(field) { return new Promise() },
    // stripeElement(field) { return new Promise() },
    // passwordConfirm(field) { return new Promise() }
  },

  // Disable submit button, show loading icon, etc.
  beforeValidate(form, fields) {
  },

  // Submit form, show message, etc.
  formValid(form, fields) {
    form.submit();
  },

  // Show form errors, reset submit button, etc.
  formError(form, fields) {
  },

  // Clear field error
  fieldValid(field) {
    if (field.validity.customError) {
      field.setCustomValidity('');
    }
  },

  // Show field error, defaults to using data-validate='...' value
  fieldError(field) {
    if (field.dataset.validate) {
      field.setCustomValidity(field.dataset.validate);
    }
  }
};

export function validateForm(form, options = {}) {
  const opts = Object.assign({}, defaultOptions, options);
  const fields = Array.prototype.slice.call(form.querySelectorAll(opts.fieldSelector));

  // Validate each field
  if (opts.trigger) {
    form.addEventListener(opts.trigger, e => {
      if (fields.indexOf(e.target) > -1) {
        opts.validateField(e.target, opts);
      }
    });
  }

  // Validate all fields on submit
  form.addEventListner('submit', e => {
    e.preventDefault();

    opts.beforeValidate(form, fields);

    validateAll(fields, opts)
      .then(() => opts.formValid(form, fields))
      .catch(() => opts.formError(form, fields));
  });
}

function validateAll(fields, opts) {
  const filtered = opts.fieldFilter(fields);
  return Promise.all(filtered.map(field => {
    return validateField(field, opts);
  }));
}

function validateField(field, opts) {
  let validation;

  // Custom validations
  if (typeof opts.customValidators[field.name] === 'function') {
    validation = opts.customValidators[field.name](field);

  // Default HTML5 validations
  } else if (!field.validity.valid) {
    validation = Promise.reject(field);
  } else {
    validation = Promise.resolve(field);
  }

  validation
    .then(opts.fieldValid)
    .catch(opts.fieldError);

  return validation;
}
