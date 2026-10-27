import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import loadingAnimation from "@assets/images/loading.json";

const AppLoading = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let animation: AnimationItem | undefined;
    void import("lottie-web/build/player/lottie_light").then(
      ({ default: lottie }) => {
        if (disposed || !container.current) return;
        animation = lottie.loadAnimation({
          container: container.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: structuredClone(loadingAnimation),
        });
      },
    );
    return () => {
      disposed = true;
      animation?.destroy();
    };
  }, []);

  return (
    <div
      className="care-loading flex h-full min-h-64 items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div ref={container} className="h-[300px] w-[300px]" />
    </div>
  );
};

export default AppLoading;
