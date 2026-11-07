"use client";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileSearch,
  FileText,
  ImageIcon,
  Info,
  PenLine,
  Plus,
  Save,
  Scale,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BillGuardOrb } from "./billguard-orb";
import { categoryIcons, categoryNames } from "./billguard-landing";
import { AskBillGuard, ComplaintEditor, type DemoCase } from "./complaint-flow";
import type { Translate } from "./language-selector";

export type Stage =
  | "welcome"
  | "category"
  | "upload"
  | "analysis"
  | "results"
  | "draft";

type SelectedFile = { id: string; file: File };

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILES = 10;
const MIN_DESCRIPTION = 20;
const ease = [0.22, 1, 0.36, 1] as const;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileType(file: File) {
  return (file.name.split(".").pop() ?? "").toUpperCase();
}

export function GuidedAssistant({
  t,
  initialStage = "welcome",
  initialCategory,
  onSave,
  onOpenCases,
}: {
  t: Translate;
  initialStage?: Stage;
  initialCategory?: number;
  onSave: (c: DemoCase) => void;
  onOpenCases: () => void;
}) {
  const [stage, setStage] = useState<Stage>(initialStage);
  const [category, setCategory] = useState<number | undefined>(initialCategory);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [description, setDescription] = useState("");
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [caseId] = useState(() => `journey-${Date.now()}`);
  const [notice, setNotice] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const names = categoryNames(t);

  const analysisSteps = [
    t("Mottar dokumenter og beskrivelse", "Receiving documents and description"),
    t("Leser innholdet", "Reading the content"),
    t("Finner relevante opplysninger", "Finding relevant information"),
    t("Vurderer mulige klagegrunnlag", "Reviewing possible complaint grounds"),
    t("Forbereder oversikten din", "Preparing your overview"),
  ];

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  useEffect(() => {
    if (stage !== "analysis") return;
    if (progress >= analysisSteps.length) {
      const done = setTimeout(() => setStage("results"), 650);
      return () => clearTimeout(done);
    }
    const next = setTimeout(() => setProgress((p) => p + 1), 750);
    return () => clearTimeout(next);
  }, [stage, progress, analysisSteps.length]);

  const meaningfulDescription = description.trim().length >= MIN_DESCRIPTION;
  const canAnalyze = files.length > 0 || meaningfulDescription;
  const compact = stage !== "welcome";

  function addFiles(incoming: File[]) {
    const valid = incoming.filter(
      (f) => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE,
    );
    const room = MAX_FILES - files.length;
    const accepted = valid.slice(0, Math.max(0, room));
    setFileError(
      valid.length !== incoming.length
        ? t(
            "Noen filer ble ikke lagt til. Bruk PDF, JPG, PNG eller WEBP på maks. 20 MB.",
            "Some files were not added. Use PDF, JPG, PNG or WEBP up to 20 MB.",
          )
        : accepted.length < valid.length
          ? t("Du kan legge til opptil 10 filer.", "You can add up to 10 files.")
          : "",
    );
    setFiles((prev) => [
      ...prev,
      ...accepted.map((file) => ({ id: `${file.name}-${file.size}-${Math.random()}`, file })),
    ]);
  }

  function chooseCategory(i: number) {
    setCategory(i);
    setTimeout(() => setStage("upload"), 420);
  }

  function startAnalysis() {
    setProgress(0);
    setNotice("");
    setStage("analysis");
  }

  function saveCase(draft?: string) {
    const fallbackTitle = names[category ?? 0];
    const snippet = description.trim();
    onSave({
      id: caseId,
      title:
        snippet.length > 0
          ? snippet.length > 52
            ? `${snippet.slice(0, 52).trimEnd()} …`
            : snippet
          : fallbackTitle,
      category: category ?? 0,
      status: draft ? 2 : 1,
      deadline: "",
      documents: files.map((f) => f.file.name),
      draft,
    });
    setNotice(
      draft
        ? t(
            "Klageutkastet og saken er lagret i denne demoøkten. Ingenting er sendt.",
            "The draft and case are saved for this demo session. Nothing has been sent.",
          )
        : t(
            "Saken er lagret i denne demoøkten. Du finner den under Mine saker.",
            "The case is saved for this demo session. You’ll find it under My cases.",
          ),
    );
  }

  const messages: Record<Stage, { title: string; text: string }> = {
    welcome: {
      title: t("Hei! Hva kan jeg hjelpe deg med?", "Hi! What can I help you with?"),
      text: t(
        "Fortell meg hva som har skjedd, så finner vi veien videre sammen.",
        "Tell me what happened, and we’ll find the way forward together.",
      ),
    },
    category: {
      title: t("Hva gjelder saken din?", "What is your case about?"),
      text: t(
        "Velg det som passer best. Du kan alltid gå tilbake.",
        "Choose the best fit. You can always go back.",
      ),
    },
    upload: {
      title: t("Fortell meg litt om hva som har skjedd.", "Tell me a little about what happened."),
      text: t(
        "Legg til dokumenter, beskriv problemet – eller begge deler.",
        "Add documents, describe the problem — or both.",
      ),
    },
    analysis: {
      title: t("Da ser jeg nærmere på saken din.", "Let me take a closer look at your case."),
      text: t(
        "Demomodus: fremdriften er simulert, og ingen dokumenter analyseres ennå.",
        "Demo mode: progress is simulated and no documents are analyzed yet.",
      ),
    },
    results: {
      title: t("Her er oversikten over saken din.", "Here’s an overview of your case."),
      text: t(
        "Eksempelresultat – ikke en faktisk analyse av dine dokumenter eller juridisk rådgivning.",
        "Example result — not an actual analysis of your documents or legal advice.",
      ),
    },
    draft: {
      title: t("Din sak. Med dine ord.", "Your case. In your words."),
      text: t(
        "Les gjennom, tilpass og godkjenn utkastet før du sender det selv.",
        "Review, personalize and approve the draft before sending it yourself.",
      ),
    },
  };

  const backTarget: Partial<Record<Stage, Stage>> = {
    category: "welcome",
    upload: "category",
    results: "upload",
    draft: "results",
  };

  const featureCards = [
    { label: t("Dokumentanalyse", "Document analysis"), Icon: FileSearch, tone: "ice", pos: "pos-a" },
    { label: t("Dine rettigheter", "Your rights"), Icon: Scale, tone: "pink", pos: "pos-b" },
    { label: t("Klageutkast", "Complaint draft"), Icon: PenLine, tone: "peach", pos: "pos-c" },
  ];

  const categoryDescriptions = [
    t("Avslag, erstatning og uklare vilkår.", "Denials, compensation and unclear terms."),
    t(
      "Strøm, mobilabonnement og uventede gebyrer.",
      "Electricity, mobile plans and unexpected fees.",
    ),
    t("Ødelagte produkter, feil og mangler.", "Broken products, faults and defects."),
  ];

  const message = messages[stage];
  const back = backTarget[stage];

  return (
    <section className={`journey ${compact ? "is-compact" : ""}`} aria-label="BillGuard">
      <div className="journey-top">
        <AnimatePresence initial={false}>
          {back && (
            <motion.button
              key="back"
              className="text-button"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => setStage(back)}
            >
              <ArrowLeft size={16} />
              {t("Tilbake", "Back")}
            </motion.button>
          )}
        </AnimatePresence>
        {compact && <span className="demo-badge">{t("INTERAKTIV DEMO", "INTERACTIVE DEMO")}</span>}
      </div>

      <motion.div
        layout
        transition={{ layout: { duration: 0.7, ease } }}
        className="journey-orb-wrap"
      >
        <div className="journey-orb-halo" aria-hidden="true" />
        <motion.div layout transition={{ layout: { duration: 0.7, ease } }} className="journey-orb">
          <BillGuardOrb active={stage === "analysis"} />
        </motion.div>
        <AnimatePresence>
          {stage === "welcome" &&
            featureCards.map(({ label, Icon, tone, pos }, i) => (
              <motion.div
                key={label}
                className={`journey-feature ${pos}`}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                transition={{ delay: 0.35 + i * 0.28, duration: 0.6, ease }}
              >
                <span className={`mini-icon ${tone}`}>
                  <Icon size={17} />
                </span>
                {label}
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      <motion.div layout="position" className="journey-message" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
            transition={{ duration: 0.45, ease, delay: stage === "welcome" ? 1.1 : 0.1 }}
          >
            {stage === "welcome" ? (
              <h1 ref={headingRef} tabIndex={-1}>
                {message.title}
              </h1>
            ) : (
              <h2 ref={headingRef} tabIndex={-1}>
                <Sparkles size={18} aria-hidden="true" />
                {message.title}
              </h2>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: stage === "welcome" ? 1.55 : 0.25, duration: 0.5 }}
            >
              {message.text}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className="journey-body"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, ease, delay: stage === "welcome" ? 1.95 : 0.2 }}
        >
          {stage === "welcome" && (
            <div className="journey-center">
              <button className="start-cta" onClick={() => setStage("category")}>
                {t("Start her", "Start here")}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}

          {stage === "category" && (
            <div className="journey-categories" role="group" aria-label={t("Kategori", "Category")}>
              {names.map((name, i) => {
                const Icon = categoryIcons[i];
                const selected = category === i;
                return (
                  <motion.button
                    key={name}
                    className={`journey-category tone-${i} ${selected ? "selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => chooseCategory(i)}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.08, duration: 0.45, ease }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="journey-category-icon">
                      <Icon size={24} />
                    </span>
                    <strong>{name}</strong>
                    <span>{categoryDescriptions[i]}</span>
                    <span className="journey-check" aria-hidden="true">
                      <Check size={14} />
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {stage === "upload" && (
            <div className="journey-panel">
              {category !== undefined && (
                <button className="chosen-category" onClick={() => setStage("category")}>
                  {(() => {
                    const Icon = categoryIcons[category];
                    return <Icon size={15} />;
                  })()}
                  {names[category]}
                  <span>{t("Endre", "Change")}</span>
                </button>
              )}
              <label
                className={`journey-drop ${dragging ? "dragging" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addFiles(Array.from(e.dataTransfer.files));
                }}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    addFiles(Array.from(e.target.files || []));
                    e.target.value = "";
                  }}
                />
                <span className="journey-drop-icon">
                  {files.length ? <Plus size={26} /> : <Upload size={26} />}
                </span>
                <strong>
                  {files.length
                    ? t("Legg til flere dokumenter", "Add more documents")
                    : t("Slipp dokumentene dine her", "Drop your documents here")}
                </strong>
                <span>{t("Eller klikk for å velge filer", "Or click to choose files")}</span>
                <small>PDF, JPG, PNG, WEBP · {t("maks. 20 MB per fil", "max. 20 MB each")}</small>
              </label>
              {fileError && (
                <p role="alert" className="error-text">
                  {fileError}
                </p>
              )}
              <AnimatePresence initial={false}>
                {files.length > 0 && (
                  <motion.ul
                    className="journey-files"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AnimatePresence initial={false}>
                      {files.map(({ id, file }) => (
                        <motion.li
                          key={id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                        >
                          <span className="journey-file-icon">
                            {file.type.startsWith("image/") ? <ImageIcon size={19} /> : <FileText size={19} />}
                          </span>
                          <div>
                            <strong>{file.name}</strong>
                            <small>
                              {fileType(file)} · {formatSize(file.size)}
                            </small>
                          </div>
                          <span className="journey-file-status">
                            <Check size={12} />
                            {t("Klar · kun lokalt", "Ready · local only")}
                          </span>
                          <button
                            aria-label={`${t("Fjern", "Remove")} ${file.name}`}
                            onClick={() => setFiles((prev) => prev.filter((f) => f.id !== id))}
                          >
                            <X size={16} />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                )}
              </AnimatePresence>

              <div className="journey-describe">
                <label htmlFor="journey-description">{t("Beskriv problemet ditt", "Describe your problem")}</label>
                <textarea
                  id="journey-description"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-describedby="journey-description-help"
                  placeholder={t(
                    "Fortell med dine egne ord hva som har skjedd. For eksempel: Jeg fikk avslag på forsikringen min, men mener at selskapet har misforstått årsaken til skaden ...",
                    "Tell us in your own words what happened. For example: My insurance claim was denied, but I believe the company misunderstood the cause of the damage ...",
                  )}
                />
                <p id="journey-description-help">
                  {t(
                    "Du trenger ikke bruke juridiske ord. Bare forklar situasjonen slik du opplevde den.",
                    "You don’t need legal terms. Just explain the situation as you experienced it.",
                  )}
                </p>
              </div>

              <div className="journey-actions">
                <p className="journey-hint">
                  {canAnalyze
                    ? t(
                        "Klar! Dokumenter og beskrivelse behandles sammen.",
                        "Ready! Documents and description are processed together.",
                      )
                    : t(
                        "Legg til minst ett dokument eller en kort beskrivelse for å fortsette.",
                        "Add at least one document or a short description to continue.",
                      )}
                </p>
                <button className="start-cta" disabled={!canAnalyze} onClick={startAnalysis}>
                  {t("Analyser saken min", "Analyze my case")}
                  <Sparkles size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {stage === "analysis" && (
            <div className="journey-panel">
              <span className="demo-badge">{t("DEMOMODUS · SIMULERT FREMDRIFT", "DEMO MODE · SIMULATED PROGRESS")}</span>
              <ol className="journey-progress" aria-label={t("Analysefremdrift", "Analysis progress")}>
                {analysisSteps.map((label, i) => {
                  const state = i < progress ? "done" : i === progress ? "active" : "";
                  return (
                    <li key={label} className={state}>
                      <span>
                        {i < progress ? <Check size={14} /> : <i aria-hidden="true" />}
                      </span>
                      {label}
                      <small>{i < progress ? t("Simulert", "Simulated") : i === progress ? "…" : ""}</small>
                    </li>
                  );
                })}
              </ol>
              <div className="journey-input-summary">
                <div>
                  <small>{t("Dine dokumenter", "Your documents")}</small>
                  {files.length ? (
                    <ul>
                      {files.map(({ id, file }) => (
                        <li key={id}>
                          <FileText size={14} />
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{t("Ingen dokumenter lagt til", "No documents added")}</p>
                  )}
                </div>
                <div>
                  <small>{t("Din beskrivelse", "Your description")}</small>
                  <p>{description.trim() || t("Ingen beskrivelse lagt til", "No description added")}</p>
                </div>
              </div>
            </div>
          )}

          {stage === "results" && (
            <ResultsView
              t={t}
              category={category ?? 0}
              categoryName={names[category ?? 0]}
              files={files.map((f) => f.file.name)}
              description={description.trim()}
              onDraft={() => setStage("draft")}
              onSave={() => saveCase()}
            />
          )}

          {stage === "draft" && (
            <ComplaintEditor t={t} onSave={(draft) => saveCase(draft)} />
          )}

          {notice && (
            <div className="notice journey-notice" role="status">
              <Check size={16} />
              {notice}
              <button className="text-button purple-text" onClick={onOpenCases}>
                {t("Se mine saker", "View my cases")}
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function ResultsView({
  t,
  category,
  categoryName,
  files,
  description,
  onDraft,
  onSave,
}: {
  t: Translate;
  category: number;
  categoryName: string;
  files: string[];
  description: string;
  onDraft: () => void;
  onSave: () => void;
}) {
  const content = [
    {
      findings: [
        t(
          "Avslag må begrunnes konkret med henvisning til vilkårene.",
          "A denial should be specifically justified with reference to the terms.",
        ),
        t(
          "Uklare vilkår tolkes ofte i forbrukerens favør.",
          "Unclear terms are often interpreted in the consumer’s favor.",
        ),
      ],
      grounds: [
        t("Mangelfull begrunnelse for avslaget", "Insufficient justification for the denial"),
        t("Mulig feiltolkning av skadeårsaken", "Possible misinterpretation of the cause of damage"),
      ],
      missing: t(
        "Forsikringsvilkårene, avslagsbrevet og eventuell takstrapport.",
        "The policy terms, the denial letter and any assessment report.",
      ),
      next: t(
        "Be selskapet om skriftlig begrunnelse og vilkårspunktet de bygger på.",
        "Ask the company for a written justification and the clause they rely on.",
      ),
    },
    {
      findings: [
        t(
          "Gebyrer og prisendringer må være avtalt og varslet på forhånd.",
          "Fees and price changes must be agreed and notified in advance.",
        ),
        t(
          "Belastning etter oppsigelse kan være feil.",
          "A charge after cancellation may be incorrect.",
        ),
      ],
      grounds: [
        t("Manglende varsel om endring", "Missing notice of change"),
        t("Belastning uten avtalegrunnlag", "Charge without contractual basis"),
      ],
      missing: t(
        "Fakturaen, avtalevilkårene og bekreftelse på eventuell oppsigelse.",
        "The invoice, the terms and confirmation of any cancellation.",
      ),
      next: t(
        "Be om dokumentasjon på hva belastningen gjelder, og bestrid beløpet skriftlig.",
        "Request documentation of the charge and dispute the amount in writing.",
      ),
    },
    {
      findings: [
        t(
          "Feil som oppstår innen reklamasjonsfristen kan gi rett til retting eller ny vare.",
          "Faults within the complaint period may entitle you to repair or replacement.",
        ),
        t(
          "Selgeren er ansvarlig – ikke bare produsenten.",
          "The seller is responsible — not only the manufacturer.",
        ),
      ],
      grounds: [
        t("Varen har en mangel", "The product has a defect"),
        t("Reklamert innen rimelig tid", "Complaint made within reasonable time"),
      ],
      missing: t(
        "Kvittering, kjøpsdato og bilder av feilen.",
        "Receipt, purchase date and photos of the fault.",
      ),
      next: t(
        "Send en skriftlig reklamasjon til selgeren med beskrivelse og bilder.",
        "Send a written complaint to the seller with a description and photos.",
      ),
    },
  ][category];

  return (
    <div className="journey-results">
      <div className="journey-result-grid">
        <article className="journey-panel">
          <span className="demo-badge">{t("EKSEMPEL · IKKE DIN ANALYSE", "EXAMPLE · NOT YOUR ANALYSIS")}</span>
          <h3>{t("Sammendrag", "Case summary")}</h3>
          <p>
            {t("Saken gjelder", "Your case concerns")} <strong>{categoryName.toLowerCase()}</strong>.{" "}
            {description
              ? t("Du har beskrevet situasjonen med egne ord, og BillGuard vil bruke dette sammen med dokumentene.", "You described the situation in your own words; BillGuard will use this together with your documents.")
              : t("Du har lagt til dokumenter uten beskrivelse – det går helt fint.", "You added documents without a description — that’s perfectly fine.")}
          </p>
          {description && <blockquote>{`“${description}”`}</blockquote>}
          <h3>{t("Viktige funn", "Important findings")}</h3>
          <ul className="journey-list">
            {content.findings.map((f) => (
              <li key={f}>
                <Check size={15} />
                {f}
              </li>
            ))}
          </ul>
          <h3>{t("Mulige klagegrunnlag", "Possible complaint grounds")}</h3>
          <div className="journey-chips">
            {content.grounds.map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>
        </article>
        <aside className="journey-panel">
          <h3>{t("Dokumentreferanser", "Document references")}</h3>
          {files.length ? (
            <ul className="journey-refs">
              {files.map((name, i) => (
                <li key={`${name}-${i}`}>
                  <FileText size={15} />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t("Ingen dokumenter lagt til.", "No documents added.")}</p>
          )}
          <small className="muted">
            {t(
              "Referanser til sider og avsnitt vises når analysen er koblet til.",
              "Page and section references appear once analysis is connected.",
            )}
          </small>
          <h3>{t("Mangler", "Missing information")}</h3>
          <p className="journey-missing">
            <Info size={16} />
            {content.missing}
          </p>
          <h3>{t("Anbefalt neste steg", "Recommended next step")}</h3>
          <p>{content.next}</p>
        </aside>
      </div>

      <div className="journey-ask">
        <h3>{t("Er det noe du lurer på?", "Is there anything you’re wondering about?")}</h3>
        <AskBillGuard t={t} />
      </div>

      <div className="journey-actions">
        <button className="start-cta" onClick={onDraft}>
          {t("Lag klageutkast", "Create complaint draft")}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <Button variant="outline" size="lg" onClick={onSave}>
          <Save data-icon="inline-start" />
          {t("Lagre saken", "Save case")}
        </Button>
      </div>
    </div>
  );
}
