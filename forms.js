//
// A lightweight, configurable wrapper around HTML5 form validation. Provides
// hooks at both the form and field levels for maximum flexibility.
//
// - Set <form novalidate> to suppress native validation messages
// - Uses Object.assign, which should be polyfilled for IE
//

const defaultOptions = {
  // False to ignore field-level events
  fieldEvent: 'change',

  // What to validate? Can be used with validateCustom() to validate
  // non-standard form fields (ex: Stripe Checkout)
  fieldSelector: '[data-validate]',

  // Custom validators that return promises. Assign via
  // data-validate-custom='key'.
  validateCustom: {
    // matchValue() { return new Promise() },
    // stripe() { return new Promise() }
  },

  // Disable submit button, show loading icon, etc.
  beforeValidate(form, fields) {
  },

  // Skip certain fields, etc.
  filterFields(fields) {
    return fields.filter(field => !field.disabled);
  },

  // Submit, show message, etc.
  formValid(form, fields) {
    form.submit();
  },

  // Show form errors, reset submit button, etc.
  formError(form, fields) {
  },

  // Clear field error
  fieldValid(field) {
  },

  // Show field error
  fieldError(field) {
  }
};

export function validateForm(form, options = {}) {
  const opts = Object.assign({}, defaultOptions, options);
  const fields = Array.prototype.slice.call(form.querySelectorAll(opts.fieldSelector));

  // Validate each field
  if (opts.fieldEvent) {
    form.addEventListener(opts.fieldEvent, e => {
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

// TODO Handle checkboxes, radios
function validateAll(fields, opts) {
  const filtered = opts.filterFields(fields);
  return Promise.all(filtered.map(field => {
    return validateField(field, opts);
  }));
}

function validateField(field, opts) {
  let validation;

  // Custom validation
  const custom = field.dataset.validateCustom;
  if (custom && typeof opts.validateCustom[custom] === 'function') {
    validation = opts.validateCustom[custom](field);

  // Default HTML5 validations
  } else if (field.validity) {
    if (field.validity.valid) {
      validation = Promise.resolve(field);
    } else {
      validation = Promise.reject(field);
    }

  } else {
    validation = Promise.resolve(field);
  };

  validation
    .then(opts.fieldValid)
    .catch(opts.fieldError);

  return validation;
}
