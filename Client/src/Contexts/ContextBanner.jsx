import React, { createContext, useState } from 'react';

const BannerContext = createContext({
  bannerMessage: "",
  bannerType: "",         // "alert" | "confirm"
  showBanner: false,
  confirmAction: () => {}, // callback for confirmation
  setBannerMessage: () => {},
  setBannerType: () => {},
  setBanner: () => {},
  setConfirmAction: () => {},
  resetBanner: () => {},
});

export default BannerContext;

export const BannerProvider = ({ children }) => {
  const [banner, setBannerState] = useState({
    message: "",
    type: "",
    flag: false,
    confirmAction: null, // function to run on confirm
  });

  const setBannerMessage = (message) => {
    setBannerState((prev) => ({ ...prev, message }));
  };

  const setBannerType = (type) => {
    setBannerState((prev) => ({ ...prev, type }));
  };

  const setBanner = (flag) => {
    setBannerState((prev) => ({ ...prev, flag }));
  };

  const setConfirmAction = (actionFn) => {
    setBannerState((prev) => ({ ...prev, confirmAction: actionFn }));
  };

  const resetBanner = () => {
    setBannerState({ message: "", type: "", flag: false, confirmAction: null });
  };

  return (
    <BannerContext.Provider
      value={{
        bannerMessage: banner.message,
        bannerType: banner.type,
        showBanner: banner.flag,
        confirmAction: banner.confirmAction,
        setBannerMessage,
        setBannerType,
        setBanner,
        setConfirmAction,
        resetBanner,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};
