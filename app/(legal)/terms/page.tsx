import type { Metadata } from "next";
import { LegalShell, type LegalSection } from "@/components/legal/legal-shell";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Callflow — accounts, subscriptions, acceptable use, and call recording responsibilities.",
};

const updated = "25 November 2026";

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    content: (
      <>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) form an agreement between you and
          Callflow (&ldquo;Callflow&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) covering your
          access to and use of the Callflow CRM, including its websites, applications, voice
          features, and related services (together, the &ldquo;Service&rdquo;).
        </p>
        <p>
          By creating an account, starting a trial, or using the Service, you confirm that you
          have read and agree to these Terms and to our{" "}
          <a href="/privacy">Privacy Policy</a>. If you use the Service on behalf of a company
          or other organisation, you confirm that you are authorised to bind that organisation,
          and &ldquo;you&rdquo; refers to both you and that organisation.
        </p>
      </>
    ),
  },
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          Callflow is a customer conversation platform built for support and sales teams. The
          Service is operated by the Callflow team. Our company registration details, registered
          address, and formal notices will be published here before the Service is generally
          available.
        </p>
        <p>
          Until then, all questions, notices, and legal correspondence should be sent through
          the contact channel on our{" "}
          <a href="/landing#contact">marketing site</a>. We will respond to formal notices
          within a reasonable period.
        </p>
        <div className="legal-callout">
          <Icon name="shield" size={17} />
          <p>
            <strong>Pre-launch draft.</strong> These Terms are being finalised ahead of launch.
            We will publish the final version, with full company details, before anyone is
            charged for the Service.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "the-service",
    title: "The Service",
    content: (
      <>
        <p>
          Callflow brings calls, contacts, conversation history, tasks, and follow-ups into a
          shared workspace for your team. Features vary by plan and may include call handling,
          contact management, activity timelines, reporting, integrations, and workspace
          administration.
        </p>
        <p>
          Telephony features depend on third-party carriers and network operators. Call quality,
          number availability, and coverage can be affected by factors outside our control,
          including your internet connection, your device, and local regulations.
        </p>
        <p>
          We may improve, change, or retire features over time. Where a change materially
          reduces the core functionality of a paid plan, we will give reasonable notice.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and workspaces",
    content: (
      <>
        <p>
          You must provide accurate information when creating an account and keep it up to date.
          You are responsible for the activity that happens under your account and for keeping
          your sign-in credentials confidential.
        </p>
        <p>
          A workspace is the shared environment where your team&rsquo;s data lives. The person who
          creates a workspace is its owner and is responsible for:
        </p>
        <ul>
          <li>inviting members and assigning appropriate roles and permissions;</li>
          <li>ensuring every member complies with these Terms;</li>
          <li>configuring call handling, recording, and retention settings for the workspace.</li>
        </ul>
        <p>
          You must tell us promptly if you believe your account or workspace has been accessed
          without authorisation. You must be at least 18 years old to create a workspace.
        </p>
      </>
    ),
  },
  {
    id: "trial",
    title: "Free trial",
    content: (
      <>
        <p>
          New workspaces may start with a 14-day free trial. No payment card is required to begin
          the trial, and the trial does not convert into a paid subscription automatically.
        </p>
        <p>
          When the trial ends, access to paid features stops unless you choose a plan. We may
          change or withdraw trial offers at any time. Trials are intended for evaluation, and we
          may limit them where we believe they are being used to avoid payment.
        </p>
      </>
    ),
  },
  {
    id: "subscriptions",
    title: "Subscriptions and billing",
    content: (
      <>
        <p>
          Paid plans are billed in advance, in US dollars, on a monthly or annual basis as
          selected at checkout. Prices shown on our plans page are draft pre-launch prices and
          may change before general availability; the price displayed when you subscribe is the
          price that applies to your subscription.
        </p>
        <p>
          Subscriptions renew automatically at the end of each billing period unless cancelled
          before renewal. You authorise us and our payment partner to charge your chosen payment
          method for each renewal, plus any applicable taxes.
        </p>
        <p>
          If a payment fails, we may retry the charge and may suspend paid features until the
          balance is settled. You are responsible for keeping your billing details current.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    title: "Cancellation and refunds",
    content: (
      <>
        <p>
          You can cancel your subscription at any time from your workspace settings. Cancellation
          takes effect at the end of the current billing period, and you keep access to paid
          features until then. We do not provide partial-period refunds or credits for unused
          time, except where required by law.
        </p>
        <p>
          If you believe you were charged in error, contact us through the{" "}
          <a href="/landing#contact">marketing site</a> within 30 days of the charge so we can
          review it.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>make unlawful, harassing, fraudulent, or unsolicited bulk calls or messages;</li>
          <li>call or message people who have not consented where consent is required;</li>
          <li>impersonate another person or misrepresent your affiliation;</li>
          <li>collect or process data in breach of applicable privacy or communications law;</li>
          <li>upload malicious code, attempt to gain unauthorised access, or disrupt the Service;</li>
          <li>resell, sublicense, or provide the Service to third parties except as permitted by us;</li>
          <li>use the Service to build a competing product or to scrape its data.</li>
        </ul>
        <p>
          You are responsible for the content of your calls and messages, your contact lists, and
          the way your team uses the Service. We may investigate suspected abuse and may suspend
          access where we reasonably believe these rules are being broken.
        </p>
      </>
    ),
  },
  {
    id: "recording",
    title: "Call recording and communications",
    content: (
      <>
        <p>
          Callflow may offer call recording, monitoring, and transcription features. Laws about
          recording conversations differ between countries and, in some places, between regions.
          In many jurisdictions, all parties must be informed that a call is being recorded, and
          some require their consent.
        </p>
        <p>
          As the workspace owner, you are responsible for enabling recording only where you may
          lawfully do so, for providing any required notices or obtaining any required consents,
          and for setting appropriate retention periods. You must not use recording features to
          capture communications you are not entitled to record.
        </p>
        <div className="legal-callout">
          <Icon name="phone" size={17} />
          <p>
            <strong>Your responsibility.</strong> Callflow provides the recording tools, but
            compliance with local call-recording and marketing rules rests with your workspace.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "customer-data",
    title: "Your data",
    content: (
      <>
        <p>
          You retain ownership of the contacts, call records, notes, and other content your team
          submits to the Service (&ldquo;Customer Data&rdquo;). You grant us a limited licence to
          host, copy, transmit, and display Customer Data only as needed to provide and support
          the Service, to prevent abuse, and to comply with law.
        </p>
        <p>
          You are responsible for having a lawful basis to store Customer Data in Callflow,
          including any personal data about your own customers. Our handling of personal data is
          described in the <a href="/privacy">Privacy Policy</a>.
        </p>
        <p>
          On termination, you may export Customer Data using the tools we provide. After a
          reasonable retention period, we may delete it, except where we must keep it to comply
          with law.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    content: (
      <>
        <p>
          The Service integrates with third-party providers such as telephony carriers, payment
          processors, and calendar or CRM tools. Those providers have their own terms and privacy
          practices, and we are not responsible for their services.
        </p>
        <p>
          If you connect a third-party account, you authorise us to exchange information with
          that provider as needed for the integration to work.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    title: "Availability and support",
    content: (
      <>
        <p>
          We work to keep the Service available and reliable, but we do not guarantee uninterrupted
          access. The Service may be unavailable during maintenance, upgrades, or events outside
          our control, including carrier outages and internet disruptions.
        </p>
        <p>
          Support is available to customers through the contact channel on our{" "}
          <a href="/landing#contact">marketing site</a>. Response times depend on your plan and
          the severity of the issue.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <>
        <p>
          The Service, including its software, design, branding, and documentation, is owned by
          Callflow and its licensors and is protected by intellectual property law. We grant you a
          limited, non-exclusive, non-transferable right to use the Service during your
          subscription, subject to these Terms.
        </p>
        <p>
          You may not copy, modify, distribute, reverse engineer, or create derivative works from
          the Service except as allowed by law or with our written permission. The Callflow name
          and logo are our trademarks.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Suspension and termination",
    content: (
      <>
        <p>
          You may stop using the Service at any time. We may suspend or terminate your access if
          you materially breach these Terms, if required by law, or if your use poses a risk to
          the Service, our customers, or other people. Where practical, we will give you notice
          and an opportunity to remedy the issue first.
        </p>
        <p>
          If we terminate your subscription for convenience and you have prepaid for time you
          will not receive, we will refund the unused portion. Sections that by their nature
          should survive termination &mdash; including ownership, disclaimers, and liability
          limits &mdash; will continue to apply.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: (
      <>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the
          fullest extent permitted by law, we disclaim all warranties, whether express or implied,
          including implied warranties of merchantability, fitness for a particular purpose, and
          non-infringement.
        </p>
        <p>
          We do not warrant that the Service will be error-free, that calls will always connect,
          or that data will never be lost. You are responsible for maintaining your own backups of
          information that is critical to your business.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by law, Callflow will not be liable for indirect,
          incidental, special, consequential, or punitive damages, or for lost profits, revenue,
          data, or goodwill, arising from your use of the Service.
        </p>
        <p>
          Our total liability for any claim relating to the Service will not exceed the amount
          you paid us for the Service in the 12 months before the event giving rise to the claim.
          Nothing in these Terms limits liability that cannot be limited by law.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    content: (
      <p>
        You agree to indemnify and hold Callflow harmless from claims, damages, and costs
        (including reasonable legal fees) arising from your Customer Data, your calls and
        messages, your breach of these Terms, or your violation of another person&rsquo;s rights
        or applicable law.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    content: (
      <>
        <p>
          These Terms are governed by the laws of the Republic of Malawi, without regard to
          conflict-of-law rules. Before starting formal proceedings, we ask that you contact us so
          we can try to resolve the issue informally.
        </p>
        <p>
          If a dispute cannot be resolved informally, it will be subject to the exclusive
          jurisdiction of the courts of Malawi. Nothing in this section prevents either party from
          seeking urgent relief where necessary.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    content: (
      <p>
        We may update these Terms as the Service evolves or as the law changes. When we make a
        material change, we will post the updated Terms on this page, update the date above, and
        notify workspace owners by email or in-app before the change takes effect. Continuing to
        use the Service after the effective date means you accept the updated Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>
          Questions about these Terms, billing, or anything else? Reach us through the contact
          channel on our <a href="/landing#contact">marketing site</a> and we will get back to
          you.
        </p>
        <p>
          For privacy-specific requests, see the &ldquo;Your rights&rdquo; section of our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      description="The rules for using Callflow: your account and workspace, plans and billing, acceptable use, call recording responsibilities, and how we handle changes."
      updated={updated}
      sections={sections}
    />
  );
}
