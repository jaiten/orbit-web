import type { Metadata } from "next";
import { ConnectedStatus } from "./ConnectedStatus";

// Orbit for Windows sends the browser here after a Google or Microsoft calendar sign-in.
export const metadata: Metadata = {
  title: "Calendar connected",
  robots: { index: false, follow: false },
  alternates: { canonical: "/connected/" },
};

export default function Connected() {
  return (
    <main
      id="main"
      className="grid min-h-dvh place-items-center bg-canvas px-6 py-16"
    >
      <ConnectedStatus />
    </main>
  );
}
