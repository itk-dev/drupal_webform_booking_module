(()=>{"use strict";const e=document.getElementById("booking-filters-user_bookings"),t=e.getAttribute("booking-element-id");let n;!function(a){n=a.user_bookings[t],fetch(`${n.front_page_url}/itkdev_booking/user-bookings`).then((e=>e.json())).then((a=>function(a){let o=[];o=a["hydra:member"],o.forEach((function(a,i){let{hitId:d}=a;d=btoa(d),fetch(`${n.front_page_url}/itkdev_booking/booking-details/${d}`).then((e=>e.json())).then((n=>{o[i].displayName=n["hydra:member"][0].displayName,o[i].eventBody=n["hydra:member"][0].body,function(n){const a=e.querySelector(`div.bookings-${t}`);if(null!==e.querySelector("div.loader")&&(a.innerHTML=""),null===n.start||null===n.end)return!1;const o=new Date(n.start).toLocaleDateString("da-dk",{weekday:"short",year:"numeric",month:"short",day:"numeric"}),i=new Date(n.start).toLocaleTimeString("da-dk",{hour:"2-digit",minute:"2-digit"}),d=new Date(n.end).toLocaleDateString("da-dk",{weekday:"short",year:"numeric",month:"short",day:"numeric"}),r=new Date(n.end).toLocaleTimeString("da-dk",{hour:"2-digit",minute:"2-digit"}),s=document.createElement("button");s.classList.add("btn"),s.classList.add("btn-danger"),s.innerText="Slet booking",s.onclick=function(e){e.preventDefault()};const c=document.createElement("span");c.classList.add("location"),c.innerHTML=`<b>${n.displayName}</b><span class='subject'>${n.subject}</span>`;const l=document.createElement("span");l.innerHTML=`${o} kl. ${i}`;const u=document.createElement("span");u.innerHTML=`${d} kl. ${r}`;const m=document.createElement("div"),b=document.createElement("div");b.classList.add("date-container");const g=document.createElement("div");g.classList.add("button-container"),m.setAttribute("data-id",n.id),m.classList.add("user-booking"),m.append(c),b.append(l,"→",u),m.append(b),g.append(s),m.append(g),a.append(m)}(o[i])}))}))}(a)))}(drupalSettings)})();
//# sourceMappingURL=userbookings.js.map