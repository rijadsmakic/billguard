export type DemoDocument = {
  name: string;
  issuer: string;
  date: string;
  sections: { heading: string; text: string }[];
};
export type DemoScenario = {
  id: string;
  title: string;
  category: number;
  amount: number;
  summary: string;
  assistant: string;
  caution: string;
  action: string;
  documents: DemoDocument[];
  findings: { text: string; document: number; section: number }[];
  draft: string;
  englishDraft: string;
};
export const demoScenarios: DemoScenario[] = [
  {
    id: "water-damage",
    title: "Forsikringsselskapet avslo vannskaden min",
    category: 0,
    amount: 25000,
    summary:
      "En forbruker oppdaget vannskade i leiligheten 15. oktober 2026 og meldte et krav på 25 000 kr. Forsikringsselskapet avslo kravet med henvisning til gradvis skade. Forbrukeren mener skaden skyldes en plutselig rørlekkasje og viser til fotografier og en rørleggerrapport. Alle personer, selskaper og dokumenter i saken er oppdiktet.",
    assistant:
      "Jeg har gått gjennom avslaget og forsikringsvilkårene. Det kan være grunn til å be forsikringsselskapet vurdere saken på nytt.",
    caution:
      "Dekning er ikke avklart. Rapporten beskriver en mulig årsak, ikke en sikker konklusjon. Fotografiene er omtalt i rapporten, men er ikke vedlagt denne demoen. Be om selskapets tekniske vurdering og kontroller de faktiske vilkårene.",
    action:
      "Be om en ny vurdering av skadeårsaken. Vis til rørleggerrapporten, legg ved originale fotografier og be selskapet forklare hvorfor unntaket gjelder i akkurat denne saken.",
    documents: [
      {
        name: "Forsikringsavslag.pdf",
        issuer: "Eksempel Trygg Forsikring AS · fiktivt selskap",
        date: "22.10.2026",
        sections: [
          {
            heading: "1. Vedtak – skadesak DEMO-2026-1042",
            text: "Vi viser til meldt vannskade 15.10.2026 og krav om erstatning på 25 000 kr. Kravet avslås. Vår foreløpige vurdering er at fuktskadene har utviklet seg gradvis over tid.",
          },
          {
            heading: "2. Begrunnelse og ny vurdering",
            text: "Vi viser til punkt 4.2 i eksempelvilkårene. Vurderingen bygger på skademeldingen. Rørleggerrapporten datert 17.10.2026 er ikke omtalt i vedtaket. Kunden kan sende ytterligere dokumentasjon og be om ny vurdering. Dette brevet er kun en fiktiv demonstrasjon.",
          },
        ],
      },
      {
        name: "Forsikringsvilkar.pdf",
        issuer: "Eksempel Trygg · Boligvilkår DEMO",
        date: "01.01.2026",
        sections: [
          {
            heading: "4.1 Plutselig vannskade",
            text: "Disse oppdiktede eksempelvilkårene omfatter fysisk skade som følge av plutselig og uforutsett utstrømming av vann fra bygningens røranlegg, med forbehold om øvrige vilkår og begrensninger.",
          },
          {
            heading: "4.2 Gradvis skade",
            text: "Skade som skyldes gradvis inntrenging av fukt eller lekkasje over tid, omfattes ikke av disse eksempelvilkårene. Unntakets anvendelse må vurderes opp mot dokumentert skadeårsak. Dette er ikke vilkår fra et virkelig forsikringsselskap.",
          },
        ],
      },
      {
        name: "Rorleggerrapport.pdf",
        issuer: "Eksempel Rørservice AS · fiktiv fagrapport",
        date: "17.10.2026",
        sections: [
          {
            heading: "1. Befaring og observasjoner",
            text: "Ved befaring ble det observert en løs kobling på tilførselsrøret under kjøkkenbenken og vann på gulvet. Vannforsyningen ble stengt og koblingen skiftet. Kunden opplyser at gulvet var tørt dagen før og viser til fotografier tatt 15.10.2026.",
          },
          {
            heading: "2. Mulig årsak og begrensninger",
            text: "Observasjonene er forenlige med en mulig plutselig lekkasje fra rørkoblingen. Det er ikke mulig å fastslå nøyaktig starttidspunkt eller utelukke tidligere fuktpåvirkning ved denne befaringen alene. Ytterligere fuktundersøkelse kan være nødvendig.",
          },
        ],
      },
    ],
    findings: [
      {
        text: "Avslaget viser til vannskade som har utviklet seg gradvis over tid.",
        document: 0,
        section: 0,
      },
      {
        text: "Rørleggerrapporten beskriver en mulig plutselig rørlekkasje, med forbehold om usikkerhet.",
        document: 2,
        section: 1,
      },
      {
        text: "Det kan være uenighet om de faktiske forholdene rundt skadeårsaken. Rapporten er ikke omtalt i avslaget.",
        document: 0,
        section: 1,
      },
      {
        text: "Unntaket for gradvis skade må kontrolleres mot de faktiske omstendighetene.",
        document: 1,
        section: 1,
      },
    ],
    draft:
      "Til Eksempel Trygg Forsikring AS\n\nEmne: Anmodning om ny vurdering – skadesak DEMO-2026-1042\n\nJeg viser til avslaget datert 22.10.2026 på mitt krav om erstatning på 25 000 kr for vannskaden som ble oppdaget 15.10.2026.\n\nAvslaget viser til unntaket for gradvis skade i vilkårenes punkt 4.2. Jeg ber om en ny vurdering fordi skaden etter min oppfatning skyldes en plutselig rørlekkasje. Rørleggerrapporten datert 17.10.2026 beskriver en løs rørkobling og observasjoner som er forenlige med en mulig plutselig lekkasje. Jeg er samtidig kjent med rapportens forbehold om skadeforløpet.\n\nVennligst vurder rapporten og fotografiene sammen med vilkårenes punkt 4.1 og 4.2. Jeg ber også om innsyn i den tekniske vurderingen som ligger til grunn for konklusjonen om gradvis skade, og en konkret forklaring på hvorfor unntaket eventuelt gjelder.\n\nJeg ber om en skriftlig og begrunnet ny vurdering. Dersom avslaget opprettholdes, ber jeg om informasjon om videre klagemuligheter og relevante frister. Denne henvendelsen forutsetter ikke at skaden er dekket.\n\nVedlegg som må kontrolleres før innsending: avslagsbrev, forsikringsvilkår, rørleggerrapport og originale fotografier.\n\nMed vennlig hilsen\n[Navn og kontaktinformasjon]",
    englishDraft:
      "To Eksempel Trygg Forsikring AS\n\nSubject: Request for reassessment – claim DEMO-2026-1042\n\nPlease reassess the rejection dated 22 October 2026 of my NOK 25,000 water-damage claim. The plumber’s report dated 17 October describes a loose pipe connection and a possible sudden leak, while acknowledging uncertainty about when the damage began.\n\nPlease consider the report and photographs alongside sections 4.1 and 4.2 of the policy. Please provide the technical basis for classifying the damage as gradual and explain why the exclusion applies.\n\nI request a reasoned written response and information about further complaint options and deadlines if the rejection stands. I do not assume that coverage is established.\n\nAttachments to verify: rejection letter, policy, plumber’s report and original photographs.\n\nKind regards,\n[Name and contact details]",
  },
  {
    id: "subscription",
    title: "Jeg ble belastet etter at abonnementet var sagt opp",
    category: 1,
    amount: 499,
    summary:
      "En forbruker sa opp et strømmeabonnement 20. september 2026 og fikk bekreftet at det ville avsluttes 30. september. Likevel ble 499 kr trukket for oktober. Selskapet har ennå ikke forklart belastningen. Saken og selskapet er fiktive.",
    assistant:
      "Oppsigelsesbekreftelsen og fakturaen ser ut til å gjelde ulike avslutningsdatoer. Det kan være grunn til å be selskapet forklare belastningen og vurdere tilbakebetaling.",
    caution:
      "Kontroller at fakturaen gjelder samme konto og periode, og at beløpet faktisk er betalt. Demoen gir ingen garanti for refusjon.",
    action:
      "Send en skriftlig klage med oppsigelsesbekreftelsen og fakturaen. Be om betalingsgrunnlaget og tilbakebetaling dersom belastningen er feil.",
    documents: [
      {
        name: "Oppsigelsesbekreftelse.pdf",
        issuer: "Eksempel Strømmetjeneste AS · fiktivt selskap",
        date: "20.09.2026",
        sections: [
          {
            heading: "1. Bekreftelse på oppsigelse",
            text: "Vi bekrefter at abonnement DEMO-318 avsluttes 30.09.2026. Tilgang beholdes ut september. Det skal ikke påløpe ordinær abonnementsbetaling for senere perioder.",
          },
        ],
      },
      {
        name: "Faktura-oktober.pdf",
        issuer: "Eksempel Strømmetjeneste AS · fiktiv faktura",
        date: "01.10.2026",
        sections: [
          {
            heading: "1. Fakturalinjer",
            text: "Kundenummer DEMO-318. Periode: 01.10–31.10.2026. Abonnement: 499 kr inklusive mva. Betalt med kort 01.10.2026. Dokumentet er kun en oppdiktet forhåndsvisning.",
          },
        ],
      },
      {
        name: "Abonnementsvilkar.pdf",
        issuer: "Eksempel Strømmetjeneste AS · eksempelvilkår",
        date: "01.01.2026",
        sections: [
          {
            heading: "4.2 Oppsigelse",
            text: "Oppsigelse får virkning ved utløpet av inneværende betalte måned. Selskapet sender en bekreftelse med sluttdato. Allerede påløpte krav kan fortsatt kreves betalt. Dette er fiktive vilkår.",
          },
        ],
      },
    ],
    findings: [
      {
        text: "Oppsigelsen er bekreftet med sluttdato 30. september.",
        document: 0,
        section: 0,
      },
      {
        text: "Fakturaen viser en belastning på 499 kr for oktober på samme kundenummer.",
        document: 1,
        section: 0,
      },
      {
        text: "Eksempelvilkårene sier at oppsigelsen gjelder ved utløpet av den betalte måneden.",
        document: 2,
        section: 0,
      },
    ],
    draft:
      "Til Eksempel Strømmetjeneste AS\n\nEmne: Klage på belastning etter oppsigelse – DEMO-318\n\nJeg viser til oppsigelsesbekreftelsen datert 20.09.2026, som oppgir at abonnementet mitt skulle avsluttes 30.09.2026. Likevel er jeg belastet 499 kr for perioden 01.10–31.10.2026.\n\nJeg ber dere undersøke belastningen og forklare avtalegrunnlaget for den. Dersom belastningen er feil, ber jeg om tilbakebetaling av 499 kr og bekreftelse på at abonnementet er avsluttet uten nye trekk.\n\nOppsigelsesbekreftelsen og fakturaen følger som vedlegg. Vennligst gi et skriftlig svar, gjerne innen 14 dager.\n\nMed vennlig hilsen\n[Navn og kontaktinformasjon]",
    englishDraft:
      "To Eksempel Strømmetjeneste AS\n\nSubject: Charge after cancellation – DEMO-318\n\nYour confirmation dated 20 September 2026 states that my subscription ended on 30 September. However, I was charged NOK 499 for October.\n\nPlease explain the contractual basis for this charge. If incorrect, please refund NOK 499 and confirm that no further subscription charges will be made.\n\nI attach the cancellation confirmation and invoice. Please respond in writing, preferably within 14 days.\n\nKind regards,\n[Name and contact details]",
  },
  {
    id: "headphones",
    title: "Hodetelefonene sluttet å virke etter fire måneder",
    category: 2,
    amount: 2490,
    summary:
      "En forbruker kjøpte hodetelefoner for 2 490 kr i juni 2026. I oktober sluttet venstre side å fungere ved vanlig bruk. Butikken avviste reklamasjonen med en generell henvisning til slitasje, uten en teknisk undersøkelse. Dette er et oppdiktet eksempel.",
    assistant:
      "Butikken har ikke dokumentert hvorfor feilen skyldes slitasje. Det kan være grunn til å be om en konkret undersøkelse og en ny vurdering av reklamasjonen.",
    caution:
      "Feilårsaken er ikke fastslått. Kjøpsdato, bruk, skadehistorikk og butikkens undersøkelse må vurderes før det tas stilling til løsning. Reparasjon, omlevering eller refusjon er ikke garantert.",
    action:
      "Be butikken undersøke produktet og begrunne vurderingen skriftlig. Be om kostnadsfri reparasjon eller omlevering dersom feilen omfattes av selgerens ansvar.",
    documents: [
      {
        name: "Kvittering.pdf",
        issuer: "Eksempel Lyd AS · fiktiv butikk",
        date: "12.06.2026",
        sections: [
          {
            heading: "1. Kjøpsopplysninger",
            text: "Ordre DEMO-724. Trådløse hodetelefoner, modell Eksempel Sound 2. Pris: 2 490 kr inklusive mva. Kjøpt av privat forbruker. Dette er ikke en gyldig kvittering.",
          },
        ],
      },
      {
        name: "Feilbeskrivelse.pdf",
        issuer: "Kundens fiktive feilbeskrivelse",
        date: "18.10.2026",
        sections: [
          {
            heading: "1. Symptomer og bruk",
            text: "Venstre øretelefon gir ikke lyd. Feilen oppsto 16.10.2026. Tilbakestilling og testing med to telefoner løste ikke problemet. Kunden opplyser om vanlig bruk og ingen kjente fall- eller væskeskader. Opplysningene er ikke teknisk verifisert.",
          },
        ],
      },
      {
        name: "Butikkens-svar.pdf",
        issuer: "Eksempel Lyd AS · fiktiv e-post",
        date: "21.10.2026",
        sections: [
          {
            heading: "1. Avslag på reklamasjon",
            text: "Vi vurderer dette som slitasje og avslår reklamasjonen. Produktet er ikke undersøkt av verksted. Vi kan tilby en betalt undersøkelse etter nærmere avtale.",
          },
        ],
      },
    ],
    findings: [
      {
        text: "Kvitteringen viser et kjøp omtrent fire måneder før feilen oppsto.",
        document: 0,
        section: 0,
      },
      {
        text: "Kunden beskriver svikt ved vanlig bruk, men feilårsaken er ikke bekreftet.",
        document: 1,
        section: 0,
      },
      {
        text: "Butikkens avslag viser til slitasje uten en teknisk undersøkelse.",
        document: 2,
        section: 0,
      },
    ],
    draft:
      "Til Eksempel Lyd AS\n\nEmne: Anmodning om ny vurdering av reklamasjon – ordre DEMO-724\n\nJeg kjøpte hodetelefonene Eksempel Sound 2 hos dere 12.06.2026 for 2 490 kr. Venstre side sluttet å fungere 16.10.2026 ved vanlig bruk. Tilbakestilling og testing med flere enheter løste ikke problemet.\n\nJeg viser til avslaget datert 21.10.2026. Jeg ber om at dere undersøker produktet og gir en konkret, skriftlig begrunnelse dersom dere mener feilen skyldes slitasje eller forhold jeg er ansvarlig for.\n\nDersom feilen omfattes av deres ansvar, ber jeg om kostnadsfri reparasjon eller omlevering. Avklar eventuelle undersøkelseskostnader skriftlig med meg før de påløper.\n\nJeg legger ved kvittering og feilbeskrivelse og ber om informasjon om videre håndtering.\n\nMed vennlig hilsen\n[Navn og kontaktinformasjon]",
    englishDraft:
      "To Eksempel Lyd AS\n\nSubject: Request to review product complaint – order DEMO-724\n\nI purchased Eksempel Sound 2 headphones on 12 June 2026 for NOK 2,490. The left side stopped working on 16 October during normal use. Resetting and testing with other devices did not resolve the fault.\n\nPlease inspect the product and provide a specific written explanation if you believe the fault is due to wear or customer-caused damage. If the fault is your responsibility, I request repair or replacement free of charge. Please agree any inspection costs with me in advance.\n\nI attach the receipt and fault description and ask for instructions on next steps.\n\nKind regards,\n[Name and contact details]",
  },
];
