"use client";
import { useState } from "react";
import {
  ArrowRight,
  Plus,
  FolderOpen,
  Clock3,
  CircleCheck,
  CircleAlert,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Translate } from "./language-selector";
import type { DemoCase } from "./complaint-flow";
import { categoryIcons, categoryNames } from "./billguard-landing";
export function caseStatuses(t: Translate) {
  return [
    t("Opprettet", "Created"),
    t("Under analyse", "Under analysis"),
    t("Klageutkast klart", "Draft ready"),
    t("Klage sendt", "Complaint sent"),
    t("Avventer svar", "Awaiting response"),
    t("Krever oppfølging", "Needs follow-up"),
    t("Avsluttet", "Closed"),
  ];
}
export function CaseDashboard({
  t,
  cases,
  onOpen,
  onNew,
  onUpdate,
}: {
  t: Translate;
  cases: DemoCase[];
  onOpen: (c: DemoCase) => void;
  onNew: () => void;
  onUpdate: (c: DemoCase) => void;
}) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const statuses = caseStatuses(t);
  const categories = categoryNames(t);
  const active = cases.filter((c) => c.status < 6);
  const display = cases.filter(
    (c) =>
      filter === "all" || (filter === "active" ? c.status < 6 : c.status === 6),
  );
  return (
    <section className="workspace-view dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="overline">
            {t(
              "LITT MER OVERSIKT. LITT MER RO.",
              "MORE CLARITY. MORE PEACE OF MIND.",
            )}
          </span>
          <h1>{t("Mine saker", "My cases")}</h1>
          <p>
            {t(
              "Dine saker, samlet på ett sted.",
              "Your cases, all in one place.",
            )}
          </p>
        </div>
        <Button size="lg" onClick={onNew}>
          <Plus data-icon="inline-start" />
          {t("Ny klagesak", "New complaint")}
        </Button>
      </div>
      <div className="info-note">
        <CircleAlert size={18} />
        {t(
          "Demooversikt med eksempeldata. Endringer lagres kun i denne økten. Ingen automatisk overvåking av selskaper eller innbokser.",
          "Demo dashboard with sample data. Changes last only for this session. No automatic monitoring of companies or inboxes.",
        )}
      </div>
      <div className="stat-grid">
        {[FolderOpen, CircleAlert, Clock3, CircleCheck].map((Icon, i) => (
          <div className="stat-card" key={i}>
            <Icon size={20} />
            <strong>
              {
                [
                  active.length,
                  cases.filter((c) => c.status === 5).length,
                  active.filter(
                    (c) =>
                      c.deadline &&
                      new Date(c.deadline) >= new Date("2026-11-07"),
                  ).length,
                  cases.filter((c) => c.status === 6).length,
                ][i]
              }
            </strong>
            <span>
              {
                [
                  t("Aktive saker", "Active cases"),
                  t("Trenger deg", "Need your attention"),
                  t("Kommende frister", "Upcoming deadlines"),
                  t("Avsluttede saker", "Completed cases"),
                ][i]
              }
            </span>
          </div>
        ))}
      </div>
      <div
        className="case-tabs"
        role="group"
        aria-label={t("Filtrer saker", "Filter cases")}
      >
        {["all", "active", "closed"].map((v, i) => (
          <button
            key={v}
            aria-pressed={filter === v}
            onClick={() => setFilter(v)}
          >
            {
              [
                t("Alle saker", "All cases"),
                t("Aktive", "Active"),
                t("Avsluttede", "Closed"),
              ][i]
            }
          </button>
        ))}
      </div>
      <div className="case-list">
        {display.map((c) => {
          const Icon = categoryIcons[c.category];
          return (
            <article className="case-card" key={c.id}>
              <div className="case-card-main">
                <span className={`category-icon category-${c.category}`}>
                  <Icon size={24} />
                </span>
                <div className="case-title">
                  <span>{categories[c.category]} · DEMO</span>
                  <h2>{c.title}</h2>
                  <small>
                    <CalendarDays size={13} />
                    {t("Registrert frist", "Registered deadline")}:{" "}
                    {c.deadline || "—"}
                  </small>
                </div>
                <span className={`status-badge status-${c.status}`}>
                  {statuses[c.status]}
                </span>
                <button
                  className="text-button"
                  aria-expanded={expanded === c.id}
                  aria-label={t("Vis tidslinje", "Show timeline")}
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                >
                  <ChevronDown size={18} />
                </button>
                <Button variant="outline" onClick={() => onOpen(c)}>
                  {t("Åpne sak", "Open case")}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
              {expanded === c.id && (
                <div className="case-expanded">
                  <div className="case-timeline">
                    {statuses.map((s, i) => (
                      <div className={i <= c.status ? "done" : ""} key={s}>
                        <span>
                          {i < c.status ? (
                            <CircleCheck size={16} />
                          ) : (
                            <span className="timeline-dot" />
                          )}
                        </span>
                        <small>{s}</small>
                      </div>
                    ))}
                  </div>
                  <div className="case-controls">
                    <label>
                      {t("Oppdater status", "Update status")}
                      <select
                        value={c.status}
                        onChange={(e) =>
                          onUpdate({ ...c, status: Number(e.target.value) })
                        }
                      >
                        {statuses.map((s, i) => (
                          <option key={s} value={i}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t("Neste frist", "Next deadline")}
                      <input
                        type="date"
                        value={c.deadline}
                        onChange={(e) =>
                          onUpdate({ ...c, deadline: e.target.value })
                        }
                      />
                    </label>
                  </div>
                  <p>
                    {t("Neste steg:", "Next step:")}{" "}
                    {c.status === 6
                      ? t("Saken er avsluttet.", "This case is closed.")
                      : c.status === 4
                        ? t(
                            "Registrer svaret når du mottar det.",
                            "Record the response when you receive it.",
                          )
                        : t(
                            "Åpne saken for å gjennomgå dokumenter og fortsette utkastet.",
                            "Open the case to review documents and continue your draft.",
                          )}
                  </p>
                </div>
              )}
            </article>
          );
        })}
        {!display.length && (
          <div className="flow-panel">
            <FolderOpen />
            <h2>{t("Ingen saker her ennå", "No cases here yet")}</h2>
            <p>
              {t(
                "Start en ny klagesak for å komme i gang.",
                "Start a new complaint to get going.",
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
