import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { screenWidthAtom } from "../atoms/screenWidth";

export default function useScreenWidth() {
  const setScreenWidth = useSetAtom(screenWidthAtom);

  function handleWindowResize() {
    setScreenWidth(window.innerWidth);
  }
  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [setScreenWidth]);
}
