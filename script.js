const menuBtn=document.querySelector('.menu-btn'), nav=document.querySelector('#mainNav');
menuBtn?.addEventListener('click',()=>nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const bookingForm=document.querySelector('#bookingForm'), result=document.querySelector('#bookingResult');
bookingForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(bookingForm);
  const ref='ZZ-'+new Date().getFullYear()+'-'+String(Math.floor(10000+Math.random()*90000));
  result.hidden=false;
  result.innerHTML=`<strong>Request received.</strong><br>Your reference number is <strong>${ref}</strong>. Z&Z iPhone Repairs will contact you to confirm the booking.`;
  bookingForm.reset();
});

document.querySelector('#trackForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const ref=document.querySelector('#ref').value.trim();
  const out=document.querySelector('#trackResult');
  out.hidden=false;
  out.innerHTML=`<strong>Reference ${ref}</strong><br>Online repair tracking will be connected to the Z&Z business dashboard before launch.`;
});
