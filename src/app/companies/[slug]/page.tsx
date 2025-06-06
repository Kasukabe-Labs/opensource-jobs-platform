// app/companies/[slug]/page.tsx

import SingleJobPage from "@/components/SingleJobPage";
import React from "react";

interface Props {
  params: {
    slug: string;
  };
}

export default function Page({ params }: Props) {
  return (
    <div>
      <SingleJobPage params={params} />
    </div>
  );
}
