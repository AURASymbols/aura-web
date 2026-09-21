(function(){
  const GITHUB_URL="https://github.com/AURASymbols/aura-web";

  function detectPlatform(){
    const ua=navigator.userAgent||"";
    const platform=(navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||"";
    const value=(platform+" "+ua).toLowerCase();

    if(value.includes("win")){
      return {
        key:"windows",
        label:"Windows",
        href:"/downloads/AURA_Project_Brief_Windows.rar",
        action:"download"
      };
    }

    if(value.includes("mac")){
      return {
        key:"mac",
        label:"macOS",
        href:GITHUB_URL,
        action:"github"
      };
    }

    if(value.includes("linux")){
      return {
        key:"linux",
        label:"Linux",
        href:GITHUB_URL,
        action:"github"
      };
    }

    return {
      key:"other",
      label:"your platform",
      href:GITHUB_URL,
      action:"github"
    };
  }

  const p=detectPlatform();

  document.querySelectorAll("[data-platform-download]").forEach(function(link){
    link.href=p.href;
    link.removeAttribute("download");
    link.setAttribute(
      "aria-label",
      p.action==="download"
        ? "Download the AURA project package for "+p.label
        : "Open the AURA project repository on GitHub"
    );

    const label=link.querySelector("[data-download-label]");

    if(label){
      label.textContent =
        p.action==="download"
          ? "DOWNLOAD THE BRIEF →"
          : "VIEW THE PROJECT ON GITHUB →";
    }

    link.addEventListener("click",function(){
      if(p.action==="download"){
        if(label){
          const original=label.textContent;
          label.textContent="RAR DOWNLOAD STARTED ✓";
          window.setTimeout(function(){
            label.textContent=original;
          },2200);
        }
      }
    });
  });

  document.documentElement.dataset.platform=p.key;
})();
