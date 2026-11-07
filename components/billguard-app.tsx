"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, ArrowUpRight, Menu, X, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { Button } from "@/components/ui/button";
import { BillGuardLanding } from "./billguard-landing";
import { LanguageSelector, type Translate } from "./language-selector";
import { ComplaintFlow, type DemoCase } from "./complaint-flow";
import { CaseDashboard } from "./case-dashboard";
import { translate } from "@/lib/translations";
import { demoScenarios } from "@/lib/demo-scenarios";
import { DemoCaseDetail } from "./demo-case-detail";
type View = "home" | "complaint" | "cases" | "account" | "demo";
export function BillGuardApp() {
  const [view, setView] = useState<View>("home");
  const [locale, setLocale] = useState("nb");
  const [mobile, setMobile] = useState(false);
  const [category, setCategory] = useState<number | undefined>();
  const [selectedCase, setSelectedCase] = useState<DemoCase | undefined>();
  const [flowKey, setFlowKey] = useState(0);
  const [cases, setCases] = useState<DemoCase[]>(() =>
    demoScenarios.map((s) => ({
      id: `scenario-${s.id}`,
      scenarioId: s.id,
      title: s.title,
      category: s.category,
      status: 2,
      deadline: "",
      documents: s.documents.map((d) => d.name),
      draft: s.draft,
      submissionConfirmed: false,
    })),
  );
  const t: Translate = (nb, en) => translate(locale, nb, en);
  useEffect(() => {
    const value = document.cookie
      .split("; ")
      .find((c) => c.startsWith("billguard-language="))
      ?.split("=")[1];
    if (value) setLocale(decodeURIComponent(value));
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale === "nb" ? "nb" : "en";
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);
  function changeLanguage(value: string) {
    setLocale(value);
    document.cookie = `billguard-language=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }
  function navigate(next: View) {
    setView(next);
    setMobile(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function start(value?: number) {
    setCategory(value);
    setSelectedCase(undefined);
    setFlowKey((k) => k + 1);
    navigate("complaint");
  }
  function save(c: DemoCase) {
    setCases((prev) =>
      prev.some((x) => x.id === c.id)
        ? prev.map((x) => (x.id === c.id ? c : x))
        : [c, ...prev],
    );
    setSelectedCase(c);
  }
  function section(id: string) {
    navigate("home");
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
    );
  }
  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <header className="site-header">
          <button
            className="brand"
            onClick={() => navigate("home")}
            aria-label="BillGuard home"
          >
            <span className="brand-symbol">
              <ShieldCheck size={25} strokeWidth={1.6} />
            </span>
            BillGuard<span className="brand-dot">.</span>
          </button>
          <nav
            className={mobile ? "nav-links mobile-open" : "nav-links"}
            aria-label={t("Hovedmeny", "Main navigation")}
          >
            <button onClick={() => section("how-it-works")}>
              {t("Hvordan det fungerer", "How it works")}
            </button>
            <button onClick={() => start()}>
              {t("Start en klage", "Start a complaint")}
            </button>
            <button onClick={() => navigate("cases")}>
              {t("Mine saker", "My cases")}
            </button>
            <button onClick={() => navigate("cases")}>
              {t("Prøv demosakene", "Try demo cases")}
            </button>
            <button onClick={() => section("about")}>
              {t("Om BillGuard", "About BillGuard")}
            </button>
          </nav>
          <div className="header-actions">
            <LanguageSelector locale={locale} onChange={changeLanguage} t={t} />
            <span className="header-divider" />
            <button
              className="login-button"
              onClick={() => navigate("account")}
            >
              {t("Logg inn", "Log in")}
              <ArrowUpRight size={15} />
            </button>
            <button
              className="mobile-menu"
              aria-label={t("Åpne meny", "Open menu")}
              aria-expanded={mobile}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X /> : <Menu />}
            </button>
          </div>
        </header>
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {view === "home" ? (
                <BillGuardLanding t={t} start={start} />
              ) : view === "complaint" ? (
                <ComplaintFlow
                  key={flowKey}
                  t={t}
                  initialCategory={category}
                  existing={selectedCase}
                  onSave={save}
                  onBack={() => navigate("home")}
                />
              ) : view === "demo" && selectedCase ? (
                <DemoCaseDetail
                  key={selectedCase.id}
                  caseData={selectedCase}
                  t={t}
                  onUpdate={save}
                  onBack={() => navigate("cases")}
                />
              ) : view === "cases" ? (
                <CaseDashboard
                  t={t}
                  cases={cases}
                  onNew={() => start()}
                  onUpdate={save}
                  onOpen={(c) => {
                    setSelectedCase(c);
                    setCategory(c.category);
                    setFlowKey((k) => k + 1);
                    navigate(c.scenarioId ? "demo" : "complaint");
                  }}
                />
              ) : (
                <section className="account-view flow-panel">
                  <ShieldCheck size={36} />
                  <span className="demo-badge">FRONTEND PREVIEW</span>
                  <h1>
                    {t(
                      "Et trygt sted for sakene dine.",
                      "A safe place for your cases.",
                    )}
                  </h1>
                  <p>
                    {t(
                      "Innlogging og sikker lagring kobles til av backend-teamet. Du kan utforske hele opplevelsen uten å opprette en konto i denne demoen.",
                      "Sign-in and secure storage will be connected by the backend team. You can explore the experience without creating an account in this demo.",
                    )}
                  </p>
                  <Button size="lg" onClick={() => navigate("cases")}>
                    {t("Utforsk demosakene", "Explore demo cases")}
                    <ArrowUpRight data-icon="inline-end" />
                  </Button>
                  <button
                    className="text-button"
                    onClick={() => navigate("home")}
                  >
                    <ArrowLeft size={16} />
                    {t("Tilbake til forsiden", "Back to home")}
                  </button>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="site-footer">
          <div>
            <span className="footer-brand">
              <ShieldCheck size={18} />
              BillGuard.
            </span>
            <span>
              {t("På din side. Hele veien.", "On your side. Every step.")}
            </span>
          </div>
          <p>
            {t(
              "Frontend-demo · Ikke juridisk rådgivning",
              "Frontend demo · Not legal advice",
            )}
          </p>
          <span>© 2026 BillGuard</span>
        </footer>
      </div>
    </MotionConfig>
  );
}
