import { IonPage } from "@ionic/react";
import type { PropsWithChildren } from "react";
import Header from "@components/Header";

const MainLayout = ({ children }: PropsWithChildren) => (
  <IonPage className="care-shell">
    <Header />
    {children}
  </IonPage>
);

export default MainLayout;
