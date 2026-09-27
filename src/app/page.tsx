import { isKleioEnabled } from "@/lib/kleio/enabled";

import { HomeClient } from "./home-client";

export default function Home() {
  return <HomeClient showKleio={isKleioEnabled()} />;
}
