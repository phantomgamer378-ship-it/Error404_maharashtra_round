import React from "react";
import { LandingPageFrame, type LandingPageProps } from "./LandingPageFrame";
export { LandingPageFrame, applyBackgroundPresentation } from "./LandingPageFrame";
export type { LandingPageFrameProps, LandingPageProps } from "./LandingPageFrame";

export function SublevelStudioLandingPage(props: LandingPageProps) {
  return <LandingPageFrame {...props} title="VIDORA — Visual Intelligence" sourceUrl="/landing-pages/sublevel-studio.html" />;
}
