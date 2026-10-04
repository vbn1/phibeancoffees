const inquiryForm = document.getElementById('roasterInquiryForm');
const opportunityField = inquiryForm.querySelector('[name="interest"]');
const hintField = document.getElementById('interestHint');
const submitButtonEl = inquiryForm.querySelector('button[type="submit"]');
const fieldWrappers = Object.fromEntries(
  [...inquiryForm.querySelectorAll('[data-field]')].map((el) => [el.dataset.field, el])
);
const labelOf = (name) => fieldWrappers[name].querySelector('label');
const controlOf = (name) => fieldWrappers[name].querySelector('input[name], select[name], textarea');

// Copy that is replaced per opportunity type. Anything not listed falls back to the standard copy read from the HTML.
const standardFormCopy = {
  hint: hintField.textContent,
  companyLabel: labelOf('company').textContent,
  companyPlaceholder: controlOf('company').placeholder,
  varietyLabel: labelOf('variety').textContent,
  processLabel: labelOf('process').textContent,
  volumeLabel: labelOf('volume').textContent,
  volumePlaceholder: controlOf('volume').placeholder,
  notesLabel: labelOf('notes').textContent,
  notesPlaceholder: controlOf('notes').placeholder,
  submit: submitButtonEl.textContent
};

const buyerFields = ['variety', 'process', 'volume', 'cup'];

// Name, company and contact email are required for every opportunity type. Phone number is optional.
const coreFields = ['name', 'company', 'email'];

// Volume units offered per opportunity type (samples are requested in grams).
const unitSelect = inquiryForm.querySelector('[name="volume_unit"]');
const unitLabels = { g: 'g', kg: 'kg', tonnes: 'tonnes' };
const standardUnits = ['kg', 'tonnes'];

const inquiryContexts = {
  '': { show: [] },
  'Sample request': {
    show: buyerFields,
    hint: 'Tell us which varieties and processes you’d like to evaluate.',
    volumeLabel: 'Sample size (grams)',
    volumePlaceholder: 'e.g. 250',
    units: ['g'],
    notesPlaceholder: 'Which lots would you like to evaluate, and where should samples be sent?',
    submit: 'Request samples'
  },
  'Spot micro-lot order': {
    show: buyerFields,
    hint: 'Share the quantity and profile you need. We’ll confirm current lots and availability.',
    volumeLabel: 'Quantity required',
    notesPlaceholder: 'Destination, timing, and any delivery requirements.',
    submit: 'Send your order inquiry'
  },
  'Annual forward contract': {
    show: buyerFields,
    hint: 'Share your expected annual volume and delivery timing.',
    volumeLabel: 'Expected annual volume',
    volumePlaceholder: 'e.g. 300',
    notesPlaceholder: 'Delivery schedule, destination, and quality requirements.',
    submit: 'Discuss a contract'
  },
  'Estate visit': {
    show: [],
    hint: 'Share your preferred dates and group size.',
    notesLabel: 'Visit details',
    notesPlaceholder: 'Preferred dates, group size, and what you’d like to see.',
    submit: 'Request a visit'
  },
  'Grower registration': {
    show: ['variety', 'process', 'volume'],
    hint: 'Tell us about your farm, the varieties you grow and your harvest.',
    companyLabel: 'Farm or Estate Name',
    companyPlaceholder: 'Your farm or estate name',
    varietyLabel: 'Varieties grown',
    processLabel: 'Processing methods',
    volumeLabel: 'Available Coffee Volume',
    volumePlaceholder: 'Available volume',
    notesPlaceholder: 'Share your farm location, coffee varieties, growing practices, and harvest details.',
    submit: 'Register your farm'
  }
};

function updateInquiryContext() {
  const context = { ...standardFormCopy, ...(inquiryContexts[opportunityField.value] || inquiryContexts['']) };
  const visible = new Set(context.show);

  hintField.textContent = context.hint;
  labelOf('company').textContent = context.companyLabel;
  controlOf('company').placeholder = context.companyPlaceholder;
  labelOf('variety').textContent = context.varietyLabel;
  labelOf('process').textContent = context.processLabel;
  labelOf('volume').textContent = context.volumeLabel;
  controlOf('volume').placeholder = context.volumePlaceholder;
  labelOf('notes').textContent = context.notesLabel;
  controlOf('notes').placeholder = context.notesPlaceholder;
  submitButtonEl.textContent = context.submit;

  // Hidden fields are disabled so they are neither validated nor sent.
  for (const name of buyerFields) {
    const hidden = !visible.has(name);
    fieldWrappers[name].hidden = hidden;
    fieldWrappers[name].querySelectorAll('input, select, textarea').forEach((el) => { el.disabled = hidden; });
  }
  controlOf('volume').required = visible.has('volume');

  const units = context.units || standardUnits;
  const previousUnit = unitSelect.value;
  unitSelect.replaceChildren(...units.map((unit) => new Option(unitLabels[unit], unit)));
  unitSelect.value = units.includes(previousUnit) ? previousUnit : units[0];

  for (const name of coreFields) {
    inquiryForm.querySelector(`[name="${name}"]`).required = true;
  }
}

function startGrowerRegistration() {
  opportunityField.value = 'Grower registration';
  updateInquiryContext();
  document.dispatchEvent(new Event('phibean:grower-registration-started'));
}

function captureTrafficSource(form) {
  const query = new URLSearchParams(window.location.search);
  const referrer = document.referrer ? new URL(document.referrer) : null;
  const values = {
    traffic_source: query.get('utm_source') || referrer?.hostname || 'direct',
    referrer: referrer?.origin || '',
    landing_page: window.location.pathname,
    utm_source: query.get('utm_source') || '',
    utm_medium: query.get('utm_medium') || '',
    utm_campaign: query.get('utm_campaign') || '',
    utm_content: query.get('utm_content') || '',
    utm_term: query.get('utm_term') || ''
  };

  for (const [name, value] of Object.entries(values)) {
    const field = form.querySelector(`[data-attribution="${name}"]`);
    if (field) field.value = value;
  }
}

const successMessage = inquiryForm.querySelector('[data-form-success]');
const errorMessage = inquiryForm.querySelector('[data-form-error]');

captureTrafficSource(inquiryForm);

inquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = inquiryForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  successMessage.classList.add('hidden');
  errorMessage.classList.add('hidden');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  try {
    const response = await fetch(inquiryForm.action, {
      method: 'POST',
      body: new FormData(inquiryForm),
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error(`Form submission failed (${response.status})`);
    }

    document.dispatchEvent(new CustomEvent('phibean:inquiry-submitted', {
      detail: { opportunityType: opportunityField.value }
    }));

    if (opportunityField.value === 'Grower registration') {
      document.dispatchEvent(new Event('phibean:grower-registration-submitted'));
    }

    inquiryForm.reset();
    captureTrafficSource(inquiryForm);
    updateInquiryContext();
    successMessage.classList.remove('hidden');
  } catch (error) {
    console.error('Unable to submit form:', error);
    document.dispatchEvent(new Event('phibean:inquiry-submission-failed'));
    errorMessage.classList.remove('hidden');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

window.addEventListener('pageshow', () => {
  inquiryForm.reset();
  captureTrafficSource(inquiryForm);
  updateInquiryContext();
  successMessage.classList.add('hidden');
  errorMessage.classList.add('hidden');
});

opportunityField.addEventListener('change', (event) => {
  updateInquiryContext();
  if (opportunityField.value === 'Grower registration' && event.isTrusted) {
    document.dispatchEvent(new Event('phibean:grower-registration-started'));
  }
});

document.getElementById('visitButton')?.addEventListener('click', () => {
  opportunityField.value = 'Estate visit';
  updateInquiryContext();
});

document.querySelectorAll('[data-opportunity]').forEach((link) => {
  link.addEventListener('click', () => {
    opportunityField.value = link.dataset.opportunity;
    updateInquiryContext();
  });
});

document.querySelectorAll('[data-grower-registration]').forEach((link) => {
  link.addEventListener('click', () => {
    startGrowerRegistration();
  });
});

updateInquiryContext();
