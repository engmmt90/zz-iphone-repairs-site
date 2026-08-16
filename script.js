const menuBtn=document.querySelector('.menu-btn'), nav=document.querySelector('#mainNav');
menuBtn?.addEventListener('click',()=>nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const bookingForm = document.querySelector('#bookingForm');
const result = document.querySelector('#bookingResult');

bookingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  result.hidden = false;
  result.innerHTML = 'Sending your repair request...';

  const formData = new FormData(bookingForm);
  const form = Object.fromEntries(formData.entries());

  const payload = {
    name: form.name || form.fullName || form.fullname || '',
    phone: form.phone || form.phoneNumber || '',
    email: form.email || '',
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

    result.innerHTML = `
  <strong>Request received.</strong><br>
  Your reference number is <strong>${data.ref}</strong>.<br><br>
  We’ve sent a confirmation email if you provided an email address.<br>
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

  const ref = document.querySelector('#reference')?.value.trim();
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
