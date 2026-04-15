import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";
import { createT } from "@/lib/t";
import type { Locale } from "@/lib/constants";

type Props = { params: { locale: string } };

function metadataBaseUrl(): URL {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const messages = await getMessages(locale);
  const siteUrl = metadataBaseUrl();
  const title =
    locale === "fr"
      ? "Qui sommes-nous | Delice Douja a Fes"
      : locale === "ar"
        ? "من نحن | دليس دوجا في فاس"
        : "About Delice Douja in Fez";
  const description = messages.about.lead;
  const canonical = new URL(`/${locale}/about`, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

export default async function AboutPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const messages = await getMessages(locale);
  const t = createT(messages);
  const prefix = `/${locale}`;

  const knowHow = [
    t("about.knowHow1"),
    t("about.knowHow2"),
    t("about.knowHow3"),
    t("about.knowHow4"),
  ];

  const reasons = [
    t("about.reason1"),
    t("about.reason2"),
    t("about.reason3"),
    t("about.reason4"),
    t("about.reason5"),
  ];

  const commitments = [
    t("about.commitment1"),
    t("about.commitment2"),
    t("about.commitment3"),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="overflow-hidden rounded-[2rem] border border-chocolate/10 bg-[linear-gradient(135deg,rgba(255,244,238,0.94),rgba(255,250,247,0.98))] p-8 shadow-[0_24px_70px_rgba(88,45,32,0.08)] sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-gold-dark/80">
          D&eacute;lice Douja
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold text-chocolate sm:text-5xl">
          {t("about.title")}
        </h1>
        <p className="mt-4 max-w-4xl text-lg leading-relaxed text-chocolate/75">
          {t("about.lead")}
        </p>
        <p className="mt-4 max-w-4xl leading-relaxed text-chocolate/75">
          {t("about.storyBody")}
        </p>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-chocolate/10 bg-white/85 p-8 shadow-card">
          <h2 className="font-display text-2xl font-semibold text-chocolate">
            {t("about.missionTitle")}
          </h2>
          <p className="mt-4 leading-relaxed text-chocolate/75">
            {t("about.missionBody")}
          </p>
          <p className="mt-4 font-medium text-gold-dark">
            {t("about.missionHighlight")}
          </p>
        </article>
        <article className="rounded-[2rem] border border-chocolate/10 bg-white/85 p-8 shadow-card">
          <h2 className="font-display text-2xl font-semibold text-chocolate">
            {t("about.visionTitle")}
          </h2>
          <p className="mt-4 leading-relaxed text-chocolate/75">
            {t("about.visionBody")}
          </p>
          <p className="mt-4 font-medium text-gold-dark">
            {t("about.signature")}
          </p>
        </article>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-chocolate/10 bg-cream p-8 shadow-card">
          <h2 className="font-display text-2xl font-semibold text-chocolate">
            {t("about.knowHowTitle")}
          </h2>
          <p className="mt-4 leading-relaxed text-chocolate/75">
            {t("about.knowHowIntro")}
          </p>
          <ul className="mt-6 space-y-3 text-chocolate/80">
            {knowHow.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-gold-dark">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-medium text-chocolate">
            {t("about.knowHowHighlight")}
          </p>
        </article>

        <article className="rounded-[2rem] border border-rose-200/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(255,244,238,0.88))] p-8 shadow-[0_20px_60px_rgba(88,45,32,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
            {t("about.chefEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-chocolate">
            {t("about.chefName")}
          </h2>
          <p className="mt-4 leading-relaxed text-chocolate/75">
            {t("about.chefBody1")}
          </p>
          <p className="mt-4 leading-relaxed text-chocolate/75">
            {t("about.chefBody2")}
          </p>
        </article>
      </section>

      <section className="mt-12">
        <h2 className="text-center font-display text-3xl font-bold text-chocolate">
          {t("about.whyTitle")}
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reasons.map((reason) => (
            <article
              key={reason}
              className="rounded-[1.75rem] border border-chocolate/10 bg-white/80 p-6 shadow-card"
            >
              <p className="text-base font-medium text-chocolate">{reason}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center font-medium text-gold-dark">
          {t("about.whyHighlight")}
        </p>
      </section>

      <section className="mt-12 rounded-[2rem] border border-chocolate/10 bg-white/80 p-8 shadow-card">
        <h2 className="font-display text-2xl font-semibold text-chocolate">
          {t("about.commitmentTitle")}
        </h2>
        <p className="mt-4 leading-relaxed text-chocolate/75">
          {t("about.commitmentIntro")}
        </p>
        <ul className="mt-6 space-y-3 text-chocolate/80">
          {commitments.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-gold-dark">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 text-center">
        <h2 className="font-display text-3xl font-bold text-chocolate">
          {t("about.finalTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-chocolate/75">
          {t("about.finalLine1")}
        </p>
        <p className="mx-auto mt-2 max-w-3xl text-lg leading-relaxed text-chocolate/75">
          {t("about.finalLine2")}
        </p>
        <p className="mx-auto mt-2 max-w-3xl text-lg leading-relaxed text-chocolate/75">
          {t("about.finalLine3")}
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href={`${prefix}/store`}
            className="inline-flex items-center justify-center rounded-full bg-chocolate px-8 py-3.5 text-sm font-semibold text-cream shadow-card transition-all duration-300 hover:bg-chocolate/90 hover:shadow-lift"
          >
            {t("about.cta")}
          </Link>
        </div>
      </section>
    </div>
  );
}
