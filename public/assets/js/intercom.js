window.intercomInit = function intercomInit(intercomId) {
  window.intercomSettings = {
    app_id: intercomId
  };
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/'+intercomId;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()
}

window.intercomBoot = function intercomBoot(intercomId, username, firstName, lastName, email, merchantId, businessName) {
  window.Intercom('boot', {
      app_id: intercomId,
      user_id: username,
      name: firstName + ' ' + lastName,
      email: email,
      merchant_id: merchantId,
      company: {
        company_id: merchantId,
        name: businessName
      },
      created_at: new Date()
  });
}

window.intercomReset = function intercomReset(intercomId) {
  window.intercomInit(intercomId);
  window.Intercom('shutdown', {
    app_id: intercomId,
  });
}

window.upscope = function upscope(upscopeId) { //ctyBEhpmL4
  (function(w, u, d){var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};var l = function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://code.upscope.io/' + upscopeId + '.js';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(typeof u!=="function"){w.Upscope=i;l();}})(window, window.Upscope, document);
  window.Upscope('init', {
    // Optionally set the user ID below. If you don't have it, it doesn't matter,
    // Upscope will integrate with your live chat system anyway.
    // uniqueId: "USER UNIQUE ID",
    // Optionally set the user name or email below (e.g. ["John Smith", "john.smith@acme.com"])
    // identities: ["list", "of", "identities", "here"]
  });
}
