import { getCookie } from "./cookies";

const user = getCookie("loginInfo") ? JSON.parse(getCookie("loginInfo")).userData : null;

const formattedDate = (date) => {
  date = new Date(date);
  var formattedDate = date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "EST",
  });
  return formattedDate + " EST";
};

export { user, formattedDate };
