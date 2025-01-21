import Image from "next/image";
import Reports from "./components/reports";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading Reports...</div>}>
      <Reports />
    </Suspense>
  );
}
