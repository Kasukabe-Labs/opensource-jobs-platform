"use client";
import { Company } from "@/types/company";
import Link from "next/link";

export const JobCard = ({ company }: { company: Company }) => {
  return (
    <Link href={`/companies/${company.slug}`} className="group">
      <div className="border p-4 rounded-xl hover:shadow-lg transition">
        <div className="flex items-center gap-3">
          <img
            src={company.small_logo_thumb_url}
            alt={company.name}
            className="rounded-md h-10 w-10 object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
          <div>
            <h2 className="font-semibold text-lg">{company.name}</h2>
            <p className="text-sm text-muted-foreground">{company.one_liner}</p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{company.all_locations.split(";")[0]}</span>
          <span>{company.industry}</span>
          {company.isHiring && (
            <span className="text-green-600 font-medium">Hiring</span>
          )}
        </div>
      </div>
    </Link>
  );
};
