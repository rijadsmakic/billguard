"use client";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoScenarios } from "@/lib/demo-scenarios";
import { BillGuardOrb } from "./billguard-orb";
import { ComplaintEditor, type DemoCase } from "./complaint-flow";
import { categoryNames } from "./billguard-landing";
import type { Translate } from "./language-selector";

export function DemoCaseDetail({
  caseData,
  t,
  onUpdate,
  onBack,
}: {
  caseData: DemoCase;
  t: Translate;
  onUpdate: (c: DemoCase) => void;
  onBack: () => void;
}) {
  const scenario = demoScenarios.find((s) => s.id === caseData.scenarioId)!;
  const [activeDoc, setActiveDoc] = useState(0);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [notice, setNotice] = useState("");
  const documentPanel = useRef<HTMLDivElement>(null);
  const doc = scenario.documents[activeDoc];
  function reference(document: number, section: number) {
    setActiveDoc(document);
    setActiveSection(section);
    requestAnimationFrame(() => {
      documentPanel.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      documentPanel.current?.focus({ preventScroll: true });
    });
  }
  const labels = [
    t("Sak opprettet", "Case created"),
    t("Dokumenter analysert · demo", "Documents analyzed · demo"),
    t("Klageutkast klart", "Complaint draft ready"),
    caseData.submissionConfirmed
      ? t("Innsending bekreftet · simulert", "Submission confirmed · simulated")
      : t(
          "Klage sendt – krever din bekreftelse",
          "Complaint submitted — confirmation required",
        ),
  ];
  return (
    <section className="workspace-view scenario-view">
      <div className="workspace-top">
        <button className="text-button" onClick={onBack}>
          <ArrowLeft size={16} />
          {t("Tilbake til sakene", "Back to cases")}
        </button>
        <span className="demo-badge">
          {t("FIKTIV DEMONSTRASJONSSAK", "FICTIONAL DEMONSTRATION CASE")}
        </span>
      </div>
      <div className="flow-heading">
        <BillGuardOrb small />
        <span className="overline">
          {categoryNames(t)[scenario.category]} ·{" "}
          {scenario.amount.toLocaleString("nb-NO")} NOK
        </span>
        <h1 lang="nb">{scenario.title}</h1>
        <p>
          {t(
            "Utforsk dokumenter, funn og klageutkast. Alt innhold er oppdiktet, og ingen klage sendes.",
            "Explore documents, findings and a draft. All content is fictional and no complaint is sent.",
          )}
        </p>
      </div>
      <div className="info-note">
        <Info size={18} />
        {t(
          "Norske eksempeldokumenter og forhåndsskrevne analyser – ikke faktisk AI-analyse eller juridisk rådgivning. Endringer lagres kun i denne økten.",
          "Norwegian example documents and prewritten analyses — not actual AI analysis or legal advice. Changes last only for this session.",
        )}
      </div>
      <div
        className="scenario-timeline"
        aria-label={t("Sakens fremdrift", "Case progress")}
      >
        {labels.map((label, i) => (
          <div
            key={i}
            className={i < 3 || caseData.submissionConfirmed ? "reached" : ""}
          >
            <span>
              {i < 3 || caseData.submissionConfirmed ? <Check size={16} /> : 4}
            </span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
      <div className="results-grid">
        <div className="result-main">
          <div className="flow-panel">
            <span className="overline">{t("BAKGRUNN", "BACKGROUND")}</span>
            <p lang="nb">{scenario.summary}</p>
            <div className="info-note">
              <Sparkles size={20} />
              <div>
                <strong>
                  {t(
                    "BillGuard · forhåndsskrevet eksempel",
                    "BillGuard · prewritten example",
                  )}
                </strong>
                <p lang="nb">{scenario.assistant}</p>
              </div>
            </div>
            <h2>
              {t("Hva viser dokumentene?", "What do the documents show?")}
            </h2>
            <ol className="scenario-findings">
              {scenario.findings.map((finding, i) => (
                <li key={i}>
                  <span className="finding-number">0{i + 1}</span>
                  <div>
                    <p lang="nb">{finding.text}</p>
                    <button
                      className="text-button purple-text"
                      onClick={() =>
                        reference(finding.document, finding.section)
                      }
                    >
                      <FileText size={14} />
                      {scenario.documents[finding.document].name} ·{" "}
                      {
                        scenario.documents[finding.document].sections[
                          finding.section
                        ].heading
                      }
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
            <div className="info-note">
              <Info size={19} />
              <p lang="nb">{scenario.caution}</p>
            </div>
            <h3>{t("Anbefalt handling", "Recommended action")}</h3>
            <p lang="nb">{scenario.action}</p>
            <Button size="lg" onClick={() => setEditing(!editing)}>
              {editing
                ? t("Skjul klageutkast", "Hide complaint draft")
                : t("Åpne klageutkast", "Open complaint draft")}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
        <aside className="flow-panel result-aside">
          <h3>{t("Fiktive dokumenter", "Fictional documents")}</h3>
          <p>
            {t(
              "Åpne en tekstforhåndsvisning. Dette er ikke ekte PDF-filer.",
              "Open a text preview. These are not real PDF files.",
            )}
          </p>
          <div className="scenario-documents">
            {scenario.documents.map((d, i) => (
              <button
                key={d.name}
                aria-pressed={activeDoc === i}
                onClick={() => reference(i, 0)}
              >
                <FileText size={20} />
                <span>
                  {d.name}
                  <small>
                    {t("Fiktiv tekstforhåndsvisning", "Fictional text preview")}
                  </small>
                </span>
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
          <div className="scenario-amount">
            <small>{t("Omstridt beløp", "Amount in dispute")}</small>
            <strong>
              {scenario.amount.toLocaleString("nb-NO")} <span>NOK</span>
            </strong>
            <p>
              {t(
                "Ikke en beregnet eller garantert erstatning.",
                "Not calculated or guaranteed compensation.",
              )}
            </p>
          </div>
        </aside>
      </div>
      <div
        className="flow-panel document-preview"
        ref={documentPanel}
        tabIndex={-1}
        aria-label={`${t("Dokumentforhåndsvisning", "Document preview")}: ${doc.name}`}
      >
        <div className="editor-toolbar">
          <span>
            <FileText size={19} />
            {doc.name}
          </span>
          <span className="demo-badge">
            {t("FIKTIVT DOKUMENT", "FICTIONAL DOCUMENT")}
          </span>
        </div>
        <article lang="nb">
          <p className="reference">
            {doc.issuer} · {doc.date} · Side 1 av 1
          </p>
          {doc.sections.map((s, i) => (
            <section
              key={s.heading}
              className={activeSection === i ? "highlighted" : ""}
            >
              <h3>{s.heading}</h3>
              <p>{s.text}</p>
            </section>
          ))}
          <p className="reference">
            Kun demonstrasjon. Ikke et gyldig dokument, en ekte avtale eller
            dokumentasjon på et reelt krav.
          </p>
        </article>
      </div>
      {editing && (
        <div className="scenario-editor">
          <ComplaintEditor
            t={t}
            initialDraft={caseData.draft}
            scenarioTemplates={{
              nb: scenario.draft,
              en: scenario.englishDraft,
            }}
            onSave={(draft) => {
              onUpdate({ ...caseData, draft });
              setNotice(
                t(
                  "Utkast lagret i denne demoøkten. Ingenting er sendt.",
                  "Draft saved for this demo session. Nothing has been sent.",
                ),
              );
            }}
          />
        </div>
      )}
      <div className="flow-panel submission-panel">
        <h2>{t("Du bestemmer neste steg", "You decide what happens next")}</h2>
        <p>
          {t(
            "BillGuard sender ikke klagen. Bekreftelsen nedenfor simulerer bare at du selv har sendt den, og oppdaterer tidslinjen i demoen.",
            "BillGuard does not send the complaint. The confirmation below only simulates that you sent it yourself and updates the demo timeline.",
          )}
        </p>
        {caseData.submissionConfirmed ? (
          <div className="notice" role="status">
            {t(
              "Innsending bekreftet i demoen. Ingen e-post eller dokumenter er sendt.",
              "Submission confirmed in the demo. No email or documents were sent.",
            )}
          </div>
        ) : (
          <>
            <label className="approval">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              {t(
                "Jeg bekrefter simulert innsending av denne fiktive klagen.",
                "I confirm simulated submission of this fictional complaint.",
              )}
            </label>
            <Button
              disabled={!confirmed}
              onClick={() => {
                onUpdate({ ...caseData, status: 3, submissionConfirmed: true });
                setNotice(
                  t(
                    "Tidslinjen er oppdatert. Dette er kun en simulering.",
                    "Timeline updated. This is only a simulation.",
                  ),
                );
              }}
            >
              {t("Bekreft simulert innsending", "Confirm simulated submission")}
              <Check data-icon="inline-end" />
            </Button>
          </>
        )}
      </div>
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
    </section>
  );
}
