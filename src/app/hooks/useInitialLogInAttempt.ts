import { useEffect } from "react";
import { useStore } from "../stores/store";

const useInitialLogInAttempt = () => {
  const { userStore, commonStore } = useStore();

  useEffect(() => {
    async function firstLoginAttempt() {
      if (commonStore.token) {
        await userStore.getUser();
        commonStore.setAppLoaded(true);
      } else {
        setTimeout(() => {
          commonStore.setAppLoaded(true);
        }, 1000);
      }
    }
    firstLoginAttempt();
  }, [commonStore, userStore]);

  return commonStore.appLoaded;
};

export default useInitialLogInAttempt;
