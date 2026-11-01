/* UE DebSSoc — navigation, copy email and optional local photo uploads */
(() => {
  const button=document.querySelector('.menu-toggle');
  const drawer=document.getElementById('nav-drawer');
  const overlay=document.querySelector('.drawer-cover');
  const close=document.querySelector('.drawer-close');
  let previousFocus;
  function setOpen(open){
    if(!button||!drawer)return;
    if(open)previousFocus=document.activeElement;
    document.body.classList.toggle('menu-open',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    drawer.inert=!open;
    if(open)close?.focus();else if(previousFocus instanceof HTMLElement)previousFocus.focus();
  }
  button?.addEventListener('click',()=>setOpen(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('[data-close-menu],.drawer-link').forEach(el=>el.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && document.body.classList.contains('menu-open'))setOpen(false);
    if(event.key!=='Tab'||!document.body.classList.contains('menu-open'))return;
    const focusables=Array.from(drawer.querySelectorAll('button:not([disabled]),a[href]'));
    if(!focusables.length)return;
    if(event.shiftKey&&document.activeElement===focusables[0]){event.preventDefault();focusables.at(-1).focus();}
    else if(!event.shiftKey&&document.activeElement===focusables.at(-1)){event.preventDefault();focusables[0].focus();}
  });
  const year=document.querySelector('[data-year]');if(year)year.textContent=new Date().getFullYear();
  const copy=document.querySelector('[data-copy-email]');
  copy?.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText('uedebssoc.mnl@gmail.com');copy.textContent='Email copied ✓';}
    catch{copy.textContent='Email: uedebssoc.mnl@gmail.com';}
    setTimeout(()=>copy.textContent='Copy email address ⧉',2400);
  });
  /* Optional gallery/media: Upload images to the existing images/ folder with the names in README. */
  document.querySelectorAll('[data-photo]').forEach(el=>{
    const name=el.getAttribute('data-photo');
    const img=new Image();
    img.onload=()=>{el.style.backgroundImage=`url("images/${name}")`;el.classList.add('has-photo');};
    img.src=`images/${name}`;
  });
})();
