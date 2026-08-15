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
      Your reference number is <strong>${data.ref}</strong>.
      Z&Z iPhone Repairs will contact you to confirm the booking.
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

document.querySelector('#trackForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const ref=document.querySelector('#ref').value.trim();
  const out=document.querySelector('#trackResult');
  out.hidden=false;
  out.innerHTML=`<strong>Reference ${ref}</strong><br>Online repair tracking will be connected to the Z&Z business dashboard before launch.`;
});
