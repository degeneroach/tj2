import { useState, useEffect, useContext, createContext } from "react";

const ModalContext = createContext(null);

export const ModalProviderFC = (props) => {
  const [shouldShowSignInModal, setShouldShowSignInModal] = useState(false);
  const [shouldShowSignUpModal, setShouldShowSignUpModal] = useState(false);
  const [shouldShowPaymentModal, setShouldShowPaymentModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        shouldShowSignInModal,
        setShouldShowSignInModal,
        shouldShowSignUpModal,
        setShouldShowSignUpModal,
        shouldShowPaymentModal,
        setShouldShowPaymentModal,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const {
    shouldShowSignInModal,
    setShouldShowSignInModal,
    shouldShowSignUpModal,
    setShouldShowSignUpModal,
    shouldShowPaymentModal,
    setShouldShowPaymentModal,
  } = useContext(ModalContext);
  return {
    shouldShowSignInModal,
    setShouldShowSignInModal,
    shouldShowSignUpModal,
    setShouldShowSignUpModal,
    shouldShowPaymentModal,
    setShouldShowPaymentModal,
  };
};
