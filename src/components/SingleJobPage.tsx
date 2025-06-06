import { fetchCompanies } from "@/lib/fetchCompanies";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const companies = await fetchCompanies();
  return companies.map((c) => ({ slug: c.slug }));
}

export default async function SingleJobPage({
  params,
}: {
  params: { slug: string };
}) {
  const companies = await fetchCompanies();
  const company = companies?.find((c) => c?.slug === params?.slug);
  if (!company) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
      <p className="text-muted-foreground">{company.one_liner}</p>
      <a
        href={company.website}
        target="_blank"
        className="text-blue-600 underline"
      >
        {company.website}
      </a>
      <div className="mt-4">
        <p className="text-lg">{company.long_description}</p>
      </div>
    </div>
  );
}
