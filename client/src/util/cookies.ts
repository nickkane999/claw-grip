// Setting a cookie
type cookieInput = {
  name: string;
  value: any;
  days: number;
};

function setCookie(cookie: cookieInput) {
  var expires = "";
  if (cookie.days) {
    var date = new Date();
    date.setTime(date.getTime() + cookie.days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = cookie.name + "=" + (cookie.value || "") + expires + "; path=/";
}

// Getting a cookie
function getCookie(name: string) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function clearLogin() {
  setCookie({ name: "loginInfo", value: null, days: -1 });
}

export { setCookie, getCookie, clearLogin };
