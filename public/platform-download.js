(function(){
  function detectPlatform(){
    const ua=navigator.userAgent||"";
    const platform=(navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||"";
    const value=(platform+" "+ua).toLowerCase();
    if(value.includes("mac")) return {key:"mac",label:"macOS",file:"/downloads/AURA_Project_Brief.pdf"};
    if(value.includes("win")) return {key:"windows",label:"Windows",file:"/downloads/AURA_Project_Brief.pdf"};
    if(value.includes("linux")) return {key:"linux",label:"Linux",file:"/downloads/AURA_Project_Brief.pdf"};
    return {key:"linux",label:"your desktop platform",file:"/downloads/AURA_Project_Brief.pdf"};
  }
  const p=detectPlatform();
  document.querySelectorAll("[data-platform-download]").forEach(function(link){
    link.href=p.file;
    link.setAttribute("download","");
    link.setAttribute("aria-label","Download AURA project brief for "+p.label);
    const label=link.querySelector("[data-download-label]");
    if(label) label.textContent="DOWNLOAD AURA PROJECT BRIEF PDF →";
  });
  document.documentElement.dataset.platform=p.key;
})();
