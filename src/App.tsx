import { PrescriptionProvider } from "@providers/PrescriptionProvider";
import { setupIonicReact } from "@ionic/react";
import { Suspense } from "react";
import AppLoading from "@pages/AppLoading";
import MainRouter from "@routes/MainRouter";

setupIonicReact({
  mode: "ios",
  animated: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
});

const App: React.FC = () => {
  return (
    <Suspense fallback={<AppLoading />}>
      <PrescriptionProvider>
        <MainRouter />
      </PrescriptionProvider>
    </Suspense>
  );
};

export default App;
