const menuBtn=document.querySelector('.menu-btn'), nav=document.querySelector('#mainNav');
menuBtn?.addEventListener('click',()=>nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const bookingForm = document.querySelector('#bookingForm');
const result = document.querySelector('#bookingResult');
const formNote = document.querySelector('#formNote');
const requestType = document.querySelector('#requestType');
const submitBtn = bookingForm?.querySelector('button[type="submit"]');
const preferredDateInput = bookingForm?.querySelector('input[name="date"]');
const preferredDateLabel = preferredDateInput?.closest('label');
function updateBookingText() {
  const isQuote = requestType?.value === 'quote';
if (preferredDateLabel) {
  preferredDateLabel.style.display = isQuote ? 'none' : '';
}
  if (formNote) {
    formNote.textContent = isQuote
      ? 'This is a free quote request. We’ll contact you shortly with pricing.'
      : 'This is a booking request. Your appointment is confirmed only after Z&Z contacts you.';
  }

  if (submitBtn) {
    submitBtn.textContent = isQuote
      ? 'Submit Free Quote Request'
      : 'Submit Repair Request';
  }
}
document.querySelectorAll('a[href="#book"]').forEach(link => link.addEventListener('click', () => setTimeout(updateBookingText, 0)));
bookingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  result.hidden = false;
  result.innerHTML =
  document.getElementById('requestType')?.value === 'quote'
    ? 'Sending your free quote request...'
    : 'Sending your repair request...';

  const formData = new FormData(bookingForm);
  const form = Object.fromEntries(formData.entries());

 const payload = {
  name: form.name || form.fullName || form.fullname || '',
  phone: form.phone || form.phoneNumber || '',
  email: form.email || '',
  requestType: form.requestType || 'repair',
  device: form.device || form.model || form.iphoneModel || '',
  issue: form.issue || form.service || form.repairService || '',
  message: form.message || form.problem || form.description || '',
  preferredDate: form.preferredDate || form.date || ''
};

  try {
    const response = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to send booking');
    }

   const isQuote = payload.requestType === 'quote';

result.innerHTML = isQuote ? `
  <strong>Free quote request received.</strong><br>
  Your reference number is <strong>${data.ref}</strong>.<br><br>
  We’ll review your iPhone model and repair details and contact you shortly with pricing.
` : `
  <strong>Repair booking request received.</strong><br>
  Your reference number is <strong>${data.ref}</strong>.<br><br>
  Z&Z iPhone Repairs will contact you shortly to confirm the booking.
`;

    bookingForm.reset();

  } catch (error) {
    console.error(error);

    result.innerHTML = `
      <strong>Sorry, your request could not be sent.</strong><br>
      Please try again.
    `;
  }
});

document.querySelector('#trackForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const ref = document.querySelector('#ref')?.value.trim();
  const out = document.querySelector('#trackResult');

  if (!ref || !out) return;

  out.hidden = false;
  out.innerHTML = 'Checking repair status...';

  try {
    const response = await fetch(
      `/api/track?reference=${encodeURIComponent(ref)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to find repair request');
    }

    const repair = data.repair;

    out.innerHTML = `
      <strong>Reference ${repair.reference}</strong><br>
      Status: <strong>${repair.status}</strong><br>
      Device: ${repair.device || 'Not provided'}<br>
      Repair: ${repair.issue || 'Not provided'}
    `;
  } catch (error) {
    console.error(error);

    out.innerHTML = `
      <strong>Repair request not found.</strong><br>
      Please check your reference number and try again.
    `;
  }
});
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
