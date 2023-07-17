import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";

const useCookie = () => {
  const [consent, setConsent] = useState<any>(false);
  useEffect(() => {
    setConsent(hasCookie("mfpConsent") ? getCookie("mfpConsent") : false);
  }, []);
  return {
    consent,
    hasCookie: hasCookie("mfpConsent"),
    toggleConsent: (expireDays?: number) => {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + (expireDays || 0));
      setCookie(
        "mfpConsent",
        !consent,
        expireDays ? { expires: expireDate } : undefined
      );
      setConsent(!consent);
    },
    setConsent: (consent: boolean, expireDays?: number) => {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + (expireDays || 0));
      setCookie(
        "mfpConsent",
        consent,
        expireDays ? { expires: expireDate } : undefined
      );
      setConsent(consent);
    },
    deleteConsent: () => {
      deleteCookie("mfpConsent");
      setConsent(false);
    },
  };
};

export default useCookie;
