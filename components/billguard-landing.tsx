"use client";
import {
  ArrowRight,
  ShieldCheck,
  ReceiptText,
  PackageCheck,
  LockKeyhole,
  Sparkles,
  Check,
  FileText,
  Upload,
  ScanText,
  MessageSquareText,
  Send,
  Route,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BillGuardOrb } from "./billguard-orb";
import type { Translate } from "./language-selector";
export const categoryIcons = [ShieldCheck, ReceiptText, PackageCheck];
export function categoryNames(t: Translate) {
  return [
    t("Forsikring", "Insurance"),
    t("Faktura og abonnement", "Bills & subscriptions"),
    t("Reklamasjon", "Product complaints"),
  ];
}
export function BillGuardLanding({
  t,
  start,
}: {
  t: Translate;
  start: (category?: number) => void;
}) {
  const names = categoryNames(t);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            {t(
              "DIN PERSONLIGE AI-FORBRUKERASSISTENT",
              "YOUR PERSONAL AI CONSUMER ASSISTANT",
            )}
          </div>
          <h1>
            Your smartest
            <br />
            support agent.
            <span>
              On your side,
              <br />
              every step.
            </span>
          </h1>
          <p className="hero-description">
            {t(
              "Fra kompliserte dokumenter til en enklere klageprosess. BillGuard hjelper deg å forstå rettighetene dine, lage klager og følge opp saken – fra start til slutt.",
              "From complicated documents to a simpler complaint process. BillGuard helps you understand your rights, prepare complaints, and follow your case — from start to finish.",
            )}
          </p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => start()}>
              {t("Start en klagesak", "Start a complaint")}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <a className="secondary-link" href="#how-it-works">
              {t("Se hvordan det fungerer", "See how it works")}
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="trust-line">
            <span>
              <ShieldCheck />
              {t("På din side", "On your side")}
            </span>
            <span>
              <LockKeyhole />
              {t("Dine data, ditt valg", "Your data, your choice")}
            </span>
            <span>
              <Check />
              {t("Du har kontrollen", "You stay in control")}
            </span>
          </div>
        </div>
        <div className="hero-art">
          <div className="orb-halo" />
          <BillGuardOrb />
          <div className="float-card document-float">
            <span className="mini-icon lilac">
              <FileText size={21} />
            </span>
            <div>
              <strong>{t("Fra små skrift ...", "From fine print ...")}</strong>
              <span>{t("til klare svar", "to clear answers")}</span>
            </div>
            <span className="file-tick">
              <Check size={12} />
            </span>
          </div>
          <div className="float-card insight-float">
            <span className="mini-icon pink">
              <Sparkles size={20} />
            </span>
            <div>
              <strong>
                {t("Litt mer oversikt.", "A little more clarity.")}
              </strong>
              <span>{t("Mye mindre bekymring.", "A lot less worry.")}</span>
            </div>
          </div>
          <div className="orb-message">
            <span className="message-spark">
              <Sparkles size={14} />
            </span>
            {t(
              "Hei! Jeg er BillGuard. Hva trenger du hjelp med?",
              "Hi! I’m BillGuard. What can I help you with?",
            )}
            <span className="message-dot" />
          </div>
          <div className="assistant-label">
            {t(
              "TEKNOLOGI MED DEG I SENTRUM",
              "TECHNOLOGY WITH YOU AT THE CENTER",
            )}
          </div>
        </div>
      </section>
      <section className="categories" id="categories">
        <div className="section-intro">
          <div>
            <span className="overline">
              {t("ET GODT STED Å BEGYNNE", "A GOOD PLACE TO START")}
            </span>
            <h2>
              {t("Hva trenger du hjelp med?", "What can we help you with?")}
            </h2>
          </div>
          <p>
            {t(
              "Store eller små saker. Vi tar dem på alvor.",
              "Big or small. Your concerns matter.",
            )}
          </p>
        </div>
        <div className="category-grid">
          {names.map((name, i) => {
            const Icon = categoryIcons[i];
            return (
              <button
                className={`category-card category-${i}`}
                key={name}
                onClick={() => start(i)}
              >
                <span className="category-icon">
                  <Icon size={25} strokeWidth={1.5} />
                </span>
                <h3>{name}</h3>
                <p>
                  {
                    [
                      t(
                        "Avslag på forsikring, uklare vilkår eller erstatning som ikke stemmer.",
                        "Denied claims, unclear terms, or compensation that doesn’t add up.",
                      ),
                      t(
                        "Feil på fakturaen, uventede gebyrer eller abonnementer som er vanskelige å avslutte.",
                        "Incorrect invoices, unexpected charges, or subscriptions that are hard to cancel.",
                      ),
                      t(
                        "Et produkt som ikke fungerer? Få hjelp med mangler, retur og refusjon.",
                        "A product not working? Get help with defects, returns, and refunds.",
                      ),
                    ][i]
                  }
                </p>
                <span className="category-bottom">
                  {t("La oss se på saken", "Let’s look into it")}
                  <ArrowRight size={17} />
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="how-section" id="how-it-works">
        <div className="section-intro">
          <div>
            <span className="overline">
              {t(
                "FRA FRUSTRASJON TIL FREMDRIFT",
                "FROM FRUSTRATION TO PROGRESS",
              )}
            </span>
            <h2>{t("En enklere vei videre.", "A simpler way forward.")}</h2>
          </div>
          <p>
            {t(
              "Ett steg av gangen. Sammen med deg.",
              "One step at a time. Right beside you.",
            )}
          </p>
        </div>
        <div className="steps-row">
          {[Upload, ScanText, MessageSquareText, Send, Route].map((Icon, i) => (
            <div className="process-step" key={i}>
              <div>
                <Icon size={21} />
                <span>0{i + 1}</span>
              </div>
              <h3>
                {
                  [
                    t("Last opp", "Upload"),
                    t("Analyser", "Analyze"),
                    t("Forstå", "Understand"),
                    t("Lag klage", "Draft a complaint"),
                    t("Følg opp", "Follow up"),
                  ][i]
                }
              </h3>
              <p>
                {
                  [
                    t("Samle dokumentene dine", "Bring your documents"),
                    t("Få oversikt over saken", "Get a clear overview"),
                    t(
                      "Bli trygg på neste steg",
                      "Feel confident moving forward",
                    ),
                    t("Sett ord på saken din", "Put your case into words"),
                    t("Hold oversikt hele veien", "Keep track along the way"),
                  ][i]
                }
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="about-section" id="about">
        <ShieldCheck size={30} />
        <h2>
          {t("Du trenger ikke kunne alt.", "You don’t need all the answers.")}
          <br />
          <span>
            {t(
              "Du trenger noen på din side.",
              "You need someone on your side.",
            )}
          </span>
        </h2>
        <p>
          {t(
            "BillGuard gjør det enklere å bli hørt. Vi hjelper deg å finne oversikten og formulere saken din. Du bestemmer alltid hva som skjer videre.",
            "BillGuard makes it easier to be heard. We help you find clarity and put your case into words. You always decide what happens next.",
          )}
        </p>
        <Button size="lg" onClick={() => start()}>
          {t("La oss ta det første steget", "Let’s take the first step")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </section>
    </>
  );
}
