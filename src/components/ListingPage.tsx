import { fetchCompanies } from "@/lib/fetchCompanies";
import { JobCard } from "./Jobs/JobCard";

export default async function ListingPage() {
  const companies = await fetchCompanies();

  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {companies.slice(0, 30).map((company) => (
        <JobCard key={company.id} company={company} />
      ))}
    </main>
  );
}
