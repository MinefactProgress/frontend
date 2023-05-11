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
    toggleConsent: () => {
      setCookie("mfpConsent", !consent);
      setConsent(!consent);
    },
    setConsent: (consent: boolean) => {
      setCookie("mfpConsent", consent);
      setConsent(consent);
    },
    deleteConsent: () => {
      deleteCookie("mfpConsent");
      setConsent(false);
    },
  };
};

export default useCookie;
