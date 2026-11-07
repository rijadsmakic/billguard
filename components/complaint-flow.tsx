"use client";
import { useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  X,
  Check,
  Sparkles,
  Info,
  Copy,
  Download,
  Save,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BillGuardOrb } from "./billguard-orb";
import { categoryIcons, categoryNames } from "./billguard-landing";
import { languages, type Translate } from "./language-selector";
export type DemoCase = {
  id: string;
  title: string;
  category: number;
  status: number;
  deadline: string;
  documents: string[];
  draft?: string;
  scenarioId?: string;
  submissionConfirmed?: boolean;
};
export type UploadHandler = (files: File[]) => void;
export function DocumentUploader({
  files,
  onFilesChange,
  t,
}: {
  files: File[];
  onFilesChange: UploadHandler;
  t: Translate;
}) {
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  function add(incoming: File[]) {
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const valid = incoming.filter(
      (f) => allowed.includes(f.type) && f.size <= 20 * 1024 * 1024,
    );
    setError(
      valid.length !== incoming.length
        ? t(
            "Bruk PDF, JPG, PNG, WebP eller Word-filer, maks. 20 MB per fil.",
            "Use PDF, JPG, PNG, WebP or Word files, max. 20 MB each.",
          )
        : "",
    );
    onFilesChange([...files, ...valid].slice(0, 10));
  }
  return (
    <>
      <label
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(Array.from(e.dataTransfer.files));
        }}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            add(Array.from(e.target.files || []));
            e.target.value = "";
          }}
        />
        <span className="upload-symbol">
          <Upload size={30} />
        </span>
        <strong>
          {t("Slipp dokumentene dine her", "Drop your documents here")}
        </strong>
        <span>
          {t("eller", "or")} <u>{t("velg filer", "choose files")}</u>
        </span>
        <small>
          PDF, JPG, PNG, WebP, Word ·{" "}
          {t("Maks. 20 MB per fil · 10 filer", "Max. 20 MB each · 10 files")}
        </small>
      </label>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
      <div className="file-list">
        {files.map((file, i) => (
          <div className="file-row" key={`${file.name}-${i}`}>
            <FileText size={21} />
            <div>
              <strong>{file.name}</strong>
              <small>
                {(file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                {t(
                  "Valgt lokalt – ikke lastet opp",
                  "Selected locally — not uploaded",
                )}
              </small>
            </div>
            <button
              aria-label={`${t("Fjern", "Remove")} ${file.name}`}
              onClick={() => onFilesChange(files.filter((_, j) => j !== i))}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
export function ComplaintFlow({
  t,
  initialCategory,
  onSave,
  existing,
  onBack,
}: {
  t: Translate;
  initialCategory?: number;
  onSave: (c: DemoCase) => void;
  existing?: DemoCase;
  onBack: () => void;
}) {
  const [category, setCategory] = useState(initialCategory ?? 0);
  const [step, setStep] = useState(
    existing ? 3 : initialCategory === undefined ? 0 : 1,
  );
  const [files, setFiles] = useState<File[]>([]);
  const [example, setExample] = useState(!!existing);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState("");
  const [title, setTitle] = useState(existing?.title ?? "");
  const names = categoryNames(t);
  const docNames = example
    ? (existing?.documents ?? ["Faktura-november.pdf", "Avtalevilkår.pdf"])
    : files.map((f) => f.name);
  const stages = [
    t("Velg kategori", "Choose category"),
    t("Last opp", "Upload"),
    t("Analyse", "Analysis"),
    t("Din oversikt", "Your overview"),
    t("Klageutkast", "Complaint draft"),
  ];
  const save = (draft?: string) => {
    onSave({
      id: existing?.id ?? `demo-${Date.now()}`,
      title: title || names[category],
      category,
      status: draft ? 2 : (existing?.status ?? 1),
      deadline: existing?.deadline ?? "2026-11-21",
      documents: docNames,
      draft: draft ?? existing?.draft,
    });
    setNotice(
      t(
        "Saken er lagret i denne demoøkten. Den forsvinner når siden lastes på nytt.",
        "Case saved for this demo session. It resets when the page is reloaded.",
      ),
    );
  };
  return (
    <section className="workspace-view">
      <div className="workspace-top">
        <button
          className="text-button"
          onClick={() => (step > 0 ? setStep(step - 1) : onBack())}
        >
          <ArrowLeft size={16} />
          {t("Tilbake", "Back")}
        </button>
        <span className="demo-badge">
          {t("INTERAKTIV DEMO", "INTERACTIVE DEMO")}
        </span>
      </div>
      <ol className="journey-steps">
        {stages.map((s, i) => (
          <li
            className={i === step ? "current" : i < step ? "complete" : ""}
            key={s}
          >
            <span>{i < step ? <Check size={14} /> : i + 1}</span>
            <b>{s}</b>
          </li>
        ))}
      </ol>
      <div className="flow-heading">
        <BillGuardOrb small active={step === 2} />
        <span className="overline">
          BILLGUARD {t("ER PÅ DIN SIDE", "IS ON YOUR SIDE")}
        </span>
        <h1>
          {
            [
              t(
                "Hei! Hva trenger du hjelp med?",
                "Hi! What can I help you with?",
              ),
              t("La oss få oversikt sammen.", "Let’s find clarity together."),
              t("Fra dokumenter til innsikt.", "From documents to insights."),
              t(
                "Her er et eksempel på en analyse.",
                "Here’s an example analysis.",
              ),
              t("Din sak. Med dine ord.", "Your case. In your words."),
            ][step]
          }
        </h1>
        <p>
          {
            [
              t(
                "Velg det som passer best. Vi tar resten steg for steg.",
                "Choose the best fit. We’ll take the rest step by step.",
              ),
              t(
                "Legg til dokumentene du ønsker å bruke. Filer blir ikke sendt i denne demoen.",
                "Add the documents you want to use. Files are not sent in this demo.",
              ),
              t(
                "Dette viser hvordan analysehendelser vil se ut. Ingen dokumenter analyseres.",
                "This previews analysis events. No documents are analyzed.",
              ),
              t(
                "Illustrative funn – ikke basert på dine opplastede dokumenter eller juridisk rådgivning.",
                "Illustrative findings — not based on your uploaded documents or legal advice.",
              ),
              t(
                "Les gjennom, tilpass og godkjenn før du sender klagen selv.",
                "Review, personalize and approve before sending the complaint yourself.",
              ),
            ][step]
          }
        </p>
      </div>
      {step === 0 && (
        <>
          <div className="category-grid selection-grid">
            {names.map((name, i) => {
              const Icon = categoryIcons[i];
              return (
                <button
                  key={name}
                  aria-pressed={category === i}
                  className={`category-card ${category === i ? "selected" : ""}`}
                  onClick={() => setCategory(i)}
                >
                  <Icon size={28} />
                  <h3>{name}</h3>
                  <p>
                    {
                      [
                        t(
                          "Forsikringsavslag, vilkår og erstatning",
                          "Denied claims, policies and compensation",
                        ),
                        t(
                          "Fakturaer, gebyrer og abonnementer",
                          "Invoices, fees and subscriptions",
                        ),
                        t(
                          "Mangler, retur og refusjon",
                          "Defects, returns and refunds",
                        ),
                      ][i]
                    }
                  </p>
                  {category === i && <Check size={18} />}
                </button>
              );
            })}
          </div>
          <div className="flow-actions">
            <Button size="lg" onClick={() => setStep(1)}>
              {t("Fortsett", "Continue")}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </>
      )}
      {step === 1 && (
        <div className="flow-panel">
          <label className="field-label">
            {t("Gi saken et navn", "Name your case")}
            <input
              value={title}
              placeholder={names[category]}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <DocumentUploader
            files={files}
            onFilesChange={(f) => {
              setFiles(f);
              setExample(false);
            }}
            t={t}
          />
          <div className="privacy-note">
            <ShieldCheck size={17} />
            {t(
              "Filer beholdes kun i minnet i denne nettleserøkten.",
              "Files stay only in memory during this browser session.",
            )}
          </div>
          <div className="panel-actions">
            <button
              className="text-button purple-text"
              onClick={() => {
                setExample(true);
                setStep(2);
              }}
            >
              {t("Bruk eksempeldokumenter", "Use example documents")}
            </button>
            <Button
              disabled={!files.length}
              size="lg"
              onClick={() => {
                setProgress(0);
                setStep(2);
              }}
            >
              {t("Start analyse", "Start analysis")}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="flow-panel">
          <div className="info-note">
            <Info size={17} />
            {t(
              "Demonstrasjon: klikk for å forhåndsvise hvert steg. Backend kobles til senere.",
              "Demo: click to preview each stage. Backend will be connected later.",
            )}
          </div>
          <div className="analysis-list">
            {[
              t("Dokument mottatt", "Document received"),
              t("Leser dokumentet", "Reading document"),
              t(
                "Identifiserer relevante opplysninger",
                "Identifying relevant information",
              ),
              t(
                "Undersøker mulige klagegrunnlag",
                "Reviewing potential complaint grounds",
              ),
              t("Forbereder resultat", "Preparing results"),
            ].map((s, i) => (
              <div className={i <= progress ? "reached" : ""} key={s}>
                <span>{i < progress ? <Check size={16} /> : i + 1}</span>
                <strong>{s}</strong>
                <small>
                  {i < progress
                    ? "DEMO / OK"
                    : i === progress
                      ? "DEMO / PREVIEW"
                      : "—"}
                </small>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            onClick={() =>
              progress < 4 ? setProgress(progress + 1) : setStep(3)
            }
          >
            {progress < 4
              ? t("Vis neste demosteg", "Preview next demo step")
              : t("Vis eksempelresultat", "View example results")}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      )}
      {step === 3 && (
        <div className="results-grid">
          <div className="result-main">
            <div className="flow-panel">
              <span className="demo-badge">
                {t(
                  "EKSEMPEL • IKKE DIN ANALYSE",
                  "EXAMPLE • NOT YOUR ANALYSIS",
                )}
              </span>
              <h2>
                {t("Et godt grunnlag for neste steg", "A good starting point")}
              </h2>
              <p>
                {t(
                  "I dette fiktive eksempelet har kunden blitt belastet 499 kr etter at et abonnement ble sagt opp. Selskapet har ikke bekreftet hvilken oppsigelsesdato de har lagt til grunn.",
                  "In this fictional example, a customer was charged NOK 499 after cancelling a subscription. The company has not confirmed which cancellation date it used.",
                )}
              </p>
              <div className="result-facts">
                <div>
                  <small>{t("Valgt kategori", "Selected category")}</small>
                  <strong>{names[category]}</strong>
                </div>
                <div>
                  <small>{t("Eksempelbeløp", "Example amount")}</small>
                  <strong>499 NOK</strong>
                </div>
              </div>
              <h3>
                {t("Mulige klagegrunnlag", "Potential complaint grounds")}
              </h3>
              <ul className="findings">
                <li>
                  <Check />
                  {t(
                    "Belastning etter oppsigelse kan være feil.",
                    "A charge after cancellation may be incorrect.",
                  )}
                </li>
                <li>
                  <Check />
                  {t(
                    "Be om dokumentasjon på betalingsgrunnlaget.",
                    "Request evidence supporting the charge.",
                  )}
                </li>
              </ul>
              <p className="reference">
                {t(
                  "Eksempelreferanse: Avtalevilkår.pdf, punkt 4.2 (fiktiv).",
                  "Example reference: Avtalevilkår.pdf, section 4.2 (fictional).",
                )}
              </p>
              <div className="info-note">
                <Info size={19} />
                <span>
                  <strong>
                    {t("Dette trenger vi å vite", "What’s still missing")}
                  </strong>
                  <br />
                  {t(
                    "Dato for oppsigelse og bekreftelse fra selskapet. Eksempelet gir ingen garanti for refusjon.",
                    "Cancellation date and confirmation from the company. This example does not guarantee a refund.",
                  )}
                </span>
              </div>
              <div className="panel-actions">
                <Button size="lg" onClick={() => setStep(4)}>
                  {t("Lag klageutkast", "Prepare a draft")}
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => save()}>
                  <Save data-icon="inline-start" />
                  {t("Lagre saken", "Save case")}
                </Button>
              </div>
            </div>
            <AskBillGuard t={t} />
          </div>
          <aside className="flow-panel result-aside">
            <h3>{t("Dine dokumenter", "Your documents")}</h3>
            {docNames.map((name, i) => (
              <div className="reference-file" key={i}>
                <FileText size={19} />
                <span>{name}</span>
              </div>
            ))}
            <small>
              {t(
                "Valgte filer er ikke analysert.",
                "Selected files have not been analyzed.",
              )}
            </small>
            <h3>{t("Anbefalt neste steg", "Recommended next step")}</h3>
            <p>
              {t(
                "Finn frem oppsigelsesbekreftelsen, og be selskapet forklare belastningen skriftlig.",
                "Find your cancellation confirmation and ask the company to explain the charge in writing.",
              )}
            </p>
          </aside>
        </div>
      )}
      {step === 4 && (
        <ComplaintEditor t={t} initialDraft={existing?.draft} onSave={save} />
      )}
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
    </section>
  );
}
export function AskBillGuard({ t }: { t: Translate }) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);
  function ask(q: string) {
    if (!q.trim()) return;
    setHistory([
      ...history,
      {
        q,
        a: t(
          "Dette er en forhåndsvisning av samtalen. Når backend er koblet til, vil BillGuard svare med utgangspunkt i saken din og vise dokumentreferanser. Ingen AI-svar er generert her.",
          "This is a conversation preview. Once the backend is connected, BillGuard will answer using your case and cite document references. No AI answer has been generated here.",
        ),
      },
    ]);
    setQuestion("");
  }
  return (
    <div className="flow-panel chat-panel">
      <div className="chat-heading">
        <Sparkles />
        <h2>{t("Spør BillGuard", "Ask BillGuard")}</h2>
        <span className="demo-badge">DEMO</span>
      </div>
      <p>
        {t(
          "Er det noe du lurer på? Her kan du utforske samtalegrensesnittet.",
          "Anything on your mind? Explore the conversation interface here.",
        )}
      </p>
      <div className="suggestions">
        {[
          t("Hvorfor kan jeg klage?", "Why could I complain?"),
          t("Hva betyr dette vilkåret?", "What does this term mean?"),
          t("Kan du forklare det enklere?", "Can you simplify this?"),
          t("Hva bør jeg gjøre nå?", "What should I do next?"),
          t("Hva hvis jeg får avslag igjen?", "What if I’m rejected again?"),
        ].map((q) => (
          <button key={q} onClick={() => ask(q)}>
            {q}
          </button>
        ))}
      </div>
      <div className="conversation" aria-live="polite">
        {history.map((item, i) => (
          <article key={i}>
            <p className="question">{item.q}</p>
            <p className="answer">
              <Sparkles size={16} />
              {item.a}
            </p>
          </article>
        ))}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
      >
        <input
          aria-label={t("Spørsmål om saken", "Question about your case")}
          placeholder={t(
            "Still et spørsmål om saken din ...",
            "Ask a question about your case ...",
          )}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.nativeEvent.isComposing || e.keyCode === 229)
            )
              e.preventDefault();
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!question.trim()}
          aria-label={t("Send spørsmål", "Send question")}
        >
          <Send />
        </Button>
      </form>
    </div>
  );
}
export function ComplaintEditor({
  t,
  onSave,
  initialDraft,
  scenarioTemplates,
}: {
  t: Translate;
  onSave: (draft: string) => void;
  initialDraft?: string;
  scenarioTemplates?: { nb: string; en: string };
}) {
  const [lang, setLang] = useState("nb");
  const templates = scenarioTemplates ?? {
    nb: "Til kundeservice\n\nEmne: Klage på belastning etter oppsigelse\n\nJeg viser til en belastning på 499 kr etter at abonnementet mitt ble sagt opp.\n\nJeg ber dere undersøke belastningen og opplyse om hvilket avtalegrunnlag dere har benyttet. Jeg viser til oppsigelsesbekreftelsen og fakturaen, som jeg vil legge ved før innsending.\n\nDersom belastningen er feil, ber jeg om tilbakebetaling av 499 kr. Vennligst gi et skriftlig svar innen 14 dager.\n\nMed vennlig hilsen\n[Navnet ditt]",
    en: "To Customer Service\n\nSubject: Complaint regarding a charge after cancellation\n\nI am writing about a charge of NOK 499 made after I cancelled my subscription.\n\nPlease review the charge and explain the contractual basis for it. I refer to the cancellation confirmation and invoice, which I will attach before sending.\n\nIf the charge is incorrect, I request a refund of NOK 499. Please respond in writing within 14 days.\n\nKind regards,\n[Your name]",
  };
  const [draft, setDraft] = useState(initialDraft ?? templates.nb);
  const [approved, setApproved] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="flow-panel editor-panel">
      <div className="editor-toolbar">
        <span>
          <FileText size={18} />
          {t("Redigerbart eksempelutkast", "Editable example draft")}
        </span>
        <label>
          {t("Utkastspråk", "Draft language")}
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              setDraft(templates[e.target.value as "nb" | "en"]);
              setApproved(false);
            }}
          >
            {languages
              .filter(([c]) => c === "nb" || c === "en")
              .map(([c, n]) => (
                <option key={c} value={c}>
                  {n}
                </option>
              ))}
          </select>
        </label>
      </div>
      <p className="reference">
        {t(
          "Språkbytte erstatter teksten med en eksempelmal. Tilpass alle fakta og vedlegg.",
          "Changing language replaces the text with an example template. Personalize all facts and attachments.",
        )}
      </p>
      <textarea
        aria-label={t("Klageutkast", "Complaint draft")}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          setApproved(false);
        }}
      />
      <button
        className="text-button purple-text"
        onClick={() =>
          setMessage(
            t(
              "AI-forbedring blir tilgjengelig når backend kobles til. Du kan redigere teksten direkte nå.",
              "AI rewriting will be available when the backend is connected. You can edit the text directly now.",
            ),
          )
        }
      >
        <Sparkles size={16} />
        {t("Forbedre formuleringen", "Improve wording")}
      </button>
      <label className="approval">
        <input
          type="checkbox"
          checked={approved}
          onChange={(e) => setApproved(e.target.checked)}
        />
        {t(
          "Jeg har kontrollert fakta og tilpasset eksempelteksten.",
          "I have checked the facts and personalized the example text.",
        )}
      </label>
      <div className="editor-actions">
        <Button size="lg" onClick={() => onSave(draft)}>
          <Save data-icon="inline-start" />
          {t("Lagre utkast", "Save draft")}
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={!approved}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(draft);
              setMessage(t("Klagen er kopiert.", "Complaint copied."));
            } catch {
              setMessage(
                t(
                  "Kunne ikke kopiere. Marker teksten og kopier manuelt.",
                  "Could not copy. Select and copy the text manually.",
                ),
              );
            }
          }}
        >
          <Copy data-icon="inline-start" />
          {t("Kopier", "Copy")}
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={!approved}
          onClick={() => {
            const url = URL.createObjectURL(
              new Blob([draft], { type: "text/plain;charset=utf-8" }),
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = "BillGuard-complaint.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download data-icon="inline-start" />
          {t("Last ned .txt", "Download .txt")}
        </Button>
      </div>
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
    </div>
  );
}
