import { useState } from "react";
import { X } from "lucide-react";

type InfoTab = "readme" | "architecture" | "releaseNotes";

type DemoDocumentationModalProps = {
  onClose: () => void;
};

export default function DemoDocumentationModal({ onClose }: DemoDocumentationModalProps) {
  const [activeInfoTab, setActiveInfoTab] = useState<InfoTab>("readme");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5 sm:p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Portfolio Demo Notes
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              E-commerce Platform Documentation
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Created by Michael Westman, Full Stack Java Developer.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-800 p-2 text-slate-400 transition hover:border-slate-500 hover:text-white"
            aria-label="Close documentation modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-800 px-5 pt-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <TabButton active={activeInfoTab === "readme"} onClick={() => setActiveInfoTab("readme")}>README</TabButton>
            <TabButton active={activeInfoTab === "architecture"} onClick={() => setActiveInfoTab("architecture")}>Architecture</TabButton>
            <TabButton active={activeInfoTab === "releaseNotes"} onClick={() => setActiveInfoTab("releaseNotes")}>Release Notes</TabButton>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
          {activeInfoTab === "readme" && <ReadmeTab />}
          {activeInfoTab === "architecture" && <ArchitectureTab />}
          {activeInfoTab === "releaseNotes" && <ReleaseNotesTab />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-t-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
    >
      {children}
    </button>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function ReadmeTab() {
  return (
    <div className="space-y-6 text-sm leading-6 text-slate-300">
      <section className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
        <h3 className="text-lg font-bold text-white">Created by Michael Westman</h3>
        <p className="mt-2 text-slate-300">Full Stack Java Developer focused on Spring Boot, REST APIs, React, PostgreSQL, security, and production-style portfolio systems.</p>
      </section>

      <section><h3 className="text-lg font-bold text-white">Project overview</h3><p className="mt-2">This is a full-stack e-commerce portfolio demo built with a Spring Boot API, React frontend, PostgreSQL persistence, role-based authentication, admin operations, and a customer storefront flow.</p></section>
      <section><h3 className="text-lg font-bold text-white">Why I built this</h3><p className="mt-2">I built this project to demonstrate practical enterprise Java development skills beyond a simple CRUD app. It shows authentication, API design, cloud deployment, admin workflows, customer workflows, monitoring, and frontend integration.</p></section>

      <section><h3 className="text-lg font-bold text-white">Tech stack</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><InfoPill label="Backend" value="Java + Spring Boot" /><InfoPill label="Frontend" value="React + Vite + Tailwind" /><InfoPill label="Database" value="PostgreSQL / Supabase" /><InfoPill label="Deployment" value="Render + GitHub Pages" /></div></section>

      <section><h3 className="text-lg font-bold text-white">Business value</h3><ul className="mt-3 list-disc space-y-2 pl-5"><li>Manage inventory and product availability.</li><li>Monitor orders, payments, and checkout outcomes.</li><li>Reduce manual administration through a central dashboard.</li><li>Separate admin and customer experiences using role-based access.</li><li>Demonstrate real-world enterprise patterns in a portfolio-friendly way.</li></ul></section>

      <section>
        <h3 className="text-lg font-bold text-white">Project Links</h3>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <a
            href="https://github.com/mikeywestie/ecommerce-admin-ui"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-center font-semibold text-blue-300 transition hover:border-blue-500 hover:bg-blue-500/10"
          >
            Frontend Repo
          </a>

          <a
            href="https://github.com/mikeywestie/ecommerce-api"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-center font-semibold text-blue-300 transition hover:border-blue-500 hover:bg-blue-500/10"
          >
            Backend Repo
          </a>

          <a
            href="https://mikeywestie.github.io"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-center font-semibold text-blue-300 transition hover:border-blue-500 hover:bg-blue-500/10"
          >
            Portfolio Website
          </a>
        </div>
      </section>
    </div>
  );
}

function ArchitectureTab() {
  return (
    <div className="space-y-6 text-sm leading-6 text-slate-300">
      <section>
        <h3 className="text-lg font-bold text-white">
          High-level architecture
        </h3>

        <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-5 font-mono text-sm text-slate-200">
          <p>GitHub Pages</p>
          <p className="text-blue-300">      │</p>
          <p className="text-blue-300">      ▼</p>

          <p>React + Vite Frontend</p>
          <p className="text-emerald-300">JWT Bearer Token</p>
          <p className="text-blue-300">      ▼</p>

          <p>Spring Boot REST API (Render)</p>
          <p className="text-blue-300">      ▼</p>

          <p>Supabase PostgreSQL</p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-white">
          Architecture highlights
        </h3>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <InfoPill
            label="Security"
            value="JWT auth + role-based access"
          />

          <InfoPill
            label="API"
            value="REST endpoints for admin and customer flows"
          />

          <InfoPill
            label="Monitoring"
            value="Spring Boot Actuator health checks"
          />

          <InfoPill
            label="Deployment"
            value="Frontend and backend deployed separately"
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-white">
          Hosting & Infrastructure
        </h3>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <InfoPill
            label="Frontend Hosting"
            value="GitHub Pages"
          />

          <InfoPill
            label="Backend Hosting"
            value="Render"
          />

          <InfoPill
            label="Database"
            value="Supabase PostgreSQL"
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-white">
          User flows
        </h3>

        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Admin users can view dashboards, orders, payments,
            coupons, inventory, and system health.
          </li>

          <li>
            Customer users can browse products, add items to cart,
            checkout, and view orders.
          </li>

          <li>
            The login screen selects demo credentials and redirects
            users based on their authenticated role.
          </li>
        </ul>
      </section>
    </div>
  );
}

function ReleaseNotesTab() {
  return (
    <div className="space-y-6 text-sm leading-6 text-slate-300">
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4"><span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">Active Development</span><h3 className="mt-4 text-lg font-bold text-white">Project status</h3><p className="mt-2">Current version: 1.9.0</p><p>Last updated: June 2026</p></section>
      <section><h3 className="text-lg font-bold text-white">Latest changes</h3><ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Added customer and admin demo account selector.</li>
          <li>Added live API health badge on the login screen.</li>
          <li>Added customer storefront flow with products, cart, checkout, and orders.</li>
          <li>Added admin modules for dashboard, inventory, payments, orders, coupons, and system health.</li>
          <li>Expanded this modal with README, Architecture, and Release Notes tabs.</li>
          <li>Added Architecture documentation tab.</li>
          <li>Added hosting and infrastructure overview.</li>
          <li>Added project links for recruiters and reviewers.</li>
          <li>Version updated to 1.9.0.</li>
      </ul></section>
      <section><h3 className="text-lg font-bold text-white">Known notes</h3><ul className="mt-3 list-disc space-y-2 pl-5"><li>The backend is hosted on Render, so the first request may be slower after inactivity.</li><li>Kafka is not required for the live demo environment and may be disabled in cloud deployment.</li><li>Demo data is intended for portfolio testing, not real customer purchases.</li></ul></section>
      <section><h3 className="text-lg font-bold text-white">Next improvements</h3><ul className="mt-3 list-disc space-y-2 pl-5"><li>Improve product images and storefront polish.</li><li>Add richer sales analytics to the admin dashboard.</li><li>Add more realistic order and payment demo scenarios.</li><li>Continue improving mobile responsiveness across admin tables and customer pages.</li></ul></section>
    </div>
  );
}

function ProjectLink({ label }: { label: string }) {
  return <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-center font-semibold text-blue-300">{label}</div>;
}
