document.querySelectorAll("[data-open-dialog]").forEach((trigger)=>{
  trigger.addEventListener("click",(event)=>{
    event.preventDefault();
    const dialog=document.getElementById(trigger.dataset.openDialog);
    if(dialog instanceof HTMLDialogElement) dialog.showModal();
  });
});
document.querySelectorAll("[data-close-dialog]").forEach((button)=>{
  button.addEventListener("click",()=>{
    const dialog=button.closest("dialog");
    if(dialog instanceof HTMLDialogElement) dialog.close();
  });
});
document.querySelectorAll("dialog").forEach((dialog)=>{
  dialog.addEventListener("click",(event)=>{
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) dialog.close();
  });
});
