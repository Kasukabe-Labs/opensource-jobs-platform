import { useEffect, useState, useRef, useCallback } from "react";

interface Company {
  id: string;
  companyname: string;
  location: string;
  description: string;
  logourl: string;
  websiteurl: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchJobs = useCallback(async (currentCursor: string | null = null) => {
    setLoading(true);
    const url = currentCursor
      ? `/companies?limit=20&cursor=${encodeURIComponent(currentCursor)}`
      : `/companies?limit=20`;

    try {
      const res = await fetch(`http://127.0.0.1:8001${url}`);
      const data = await res.json();

      setCompanies((prev) => [...prev, ...data?.companiesData]);
      setCursor(data?.nextCursor);
      setHasMore(data?.companiesData?.length > 0);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCompanyRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchJobs(cursor);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, cursor, fetchJobs]
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-zinc-100 p-6 font-sans text-zinc-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          Remote -- OSS Companies
        </h1>

        {companies?.map((company, index) => (
          <a
            href={company.websiteurl}
            target="_blank"
            rel="noopener noreferrer"
            key={`${company.id}-${index}`}
            ref={index === companies.length - 1 ? lastCompanyRef : null}
            className="flex gap-4 items-start bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition duration-200"
          >
            <img
              src={company.logourl}
              alt={company.companyname}
              className="w-16 h-16 object-contain rounded-lg bg-gray-50"
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">{company.companyname}</h2>
              <p className="text-sm text-gray-600">{company.location}</p>
              <p className="text-sm mt-1 line-clamp-3">{company.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Joined: {new Date(company.created_at).toLocaleDateString()}
              </p>
            </div>
          </a>
        ))}

        {loading && (
          <p className="text-center text-gray-500">Loading more companies...</p>
        )}
        {!hasMore && (
          <p className="text-center text-gray-400">You've reached the end.</p>
        )}
      </div>
    </div>
  );
}

export default App;
