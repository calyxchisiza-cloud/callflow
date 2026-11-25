import type { Metadata } from "next";
import { LegalShell, type LegalSection } from "@/components/legal/legal-shell";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Callflow collects, uses, and protects personal data across accounts, workspaces, calls, and our websites.",
};

const updated = "25 November 2026";

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Scope of this policy",
    content: (
      <>
        <p>
          This Privacy Policy explains how Callflow (&ldquo;Callflow&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;) handles personal data when you visit our websites, create an account,
          or use the Callflow CRM and its voice features (the &ldquo;Service&rdquo;).
        </p>
        <p>
          This policy does not cover how your organisation handles the personal data of its own
          customers. When your team stores contacts, call records, or notes in a workspace, your
          organisation is the controller of that data and Callflow acts as its processor.
        </p>
      </>
    ),
  },
  {
    id: "roles",
    title: "Our two roles",
    content: (
      <>
        <h3>As a controller</h3>
        <p>
          We decide how to handle account and website data &mdash; for example, the details you
          give us when you sign up, billing information, and security logs. This policy describes
          that handling.
        </p>
        <h3>As a processor</h3>
        <p>
          For Customer Data inside a workspace, we act on the instructions of the workspace owner.
          The owner decides what is collected, why, and how long it is kept. If you are a customer
          of a business that uses Callflow and want to exercise your rights, please contact that
          business first; we will support them in responding.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    content: (
      <>
        <p>We collect the following categories of information:</p>
        <ul>
          <li>
            <strong>Account details.</strong> Your name, email address, password (stored as a
            secure hash), company name, country, team size, and optional phone number.
          </li>
          <li>
            <strong>Billing details.</strong> Your plan, billing cycle, and payment status.
            Card details are handled by our payment partner and are not stored on our servers.
          </li>
          <li>
            <strong>Workspace data.</strong> Contacts, call logs, notes, tasks, and messages your
            team adds to the Service, including call recordings and transcripts where enabled.
          </li>
          <li>
            <strong>Usage and technical data.</strong> IP address, browser and device type, pages
            viewed, actions taken in the app, and diagnostic logs.
          </li>
          <li>
            <strong>Communications.</strong> Messages you send to support or through our contact
            forms.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "uses",
    title: "How we use data",
    content: (
      <>
        <p>We use personal data to:</p>
        <ul>
          <li>create and secure your account and workspace;</li>
          <li>provide, maintain, and improve the Service, including calls and integrations;</li>
          <li>process subscriptions, payments, and taxes;</li>
          <li>respond to support requests and contact enquiries;</li>
          <li>send service messages such as security alerts, billing notices, and trial reminders;</li>
          <li>detect, prevent, and investigate abuse, fraud, and security incidents;</li>
          <li>comply with legal obligations and enforce our Terms of Service.</li>
        </ul>
        <p>
          We do not sell personal data, and we do not use workspace content to train advertising
          profiles.
        </p>
      </>
    ),
  },
  {
    id: "bases",
    title: "Legal bases",
    content: (
      <>
        <p>
          Where data protection law requires a legal basis, we rely on one or more of the
          following:
        </p>
        <ul>
          <li>
            <strong>Contract.</strong> To provide the Service you have signed up for, including
            billing and support.
          </li>
          <li>
            <strong>Legitimate interests.</strong> To keep the Service secure, prevent abuse, and
            improve our product, balanced against your rights.
          </li>
          <li>
            <strong>Legal obligation.</strong> To keep records and respond to lawful requests.
          </li>
          <li>
            <strong>Consent.</strong> Where we ask for it, such as optional product updates. You
            can withdraw consent at any time.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "calls",
    title: "Calls and recordings",
    content: (
      <>
        <p>
          When your workspace enables recording or transcription, call audio and related metadata
          are stored in the Service so your team can review conversations. The workspace owner is
          responsible for notifying participants and obtaining any consent required by local law
          before recording.
        </p>
        <p>
          Call metadata such as the number dialled, time, duration, and outcome is processed to
          deliver the Service and to show activity in your workspace. We do not listen to call
          content except where necessary for support you have requested, to investigate abuse, or
          where required by law.
        </p>
        <div className="legal-callout">
          <Icon name="headset" size={17} />
          <p>
            <strong>Recording settings belong to your workspace.</strong> Owners and admins choose
            whether recording is on, who can access recordings, and how long they are kept.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How we share data",
    content: (
      <>
        <p>We share personal data only as needed to run the Service:</p>
        <ul>
          <li>
            <strong>Service providers.</strong> Hosting, telephony carriers, payment processing,
            email delivery, and analytics providers who process data on our instructions.
          </li>
          <li>
            <strong>Your workspace.</strong> Members of your workspace can see the data their role
            permits, as configured by your admins.
          </li>
          <li>
            <strong>Legal and safety.</strong> Where we believe disclosure is required by law, or
            necessary to protect the rights, safety, or property of Callflow, our customers, or
            others.
          </li>
          <li>
            <strong>Business transfers.</strong> If Callflow is involved in a merger, acquisition,
            or sale of assets, data may be transferred as part of that transaction, subject to
            this policy.
          </li>
        </ul>
        <p>We never sell personal data.</p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    content: (
      <p>
        Callflow and its providers may process data in countries other than the one where you
        are located. Where data is transferred across borders, we use appropriate safeguards
        required by applicable law, such as contractual protections, and require providers to
        protect data to the standards described in this policy.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep data",
    content: (
      <>
        <p>
          We keep account and billing records for as long as your account is active and for a
          reasonable period afterwards to meet legal, tax, and accounting requirements.
        </p>
        <p>
          Workspace data is kept according to the retention settings chosen by the workspace
          owner, or until the workspace is deleted. When a workspace is deleted, we remove its
          data from active systems within a reasonable period and from backups on our normal
          backup cycle, unless we must retain it by law.
        </p>
        <p>
          Security and diagnostic logs are kept for a limited period, typically no longer than 12
          months.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    content: (
      <>
        <p>
          We use administrative, technical, and organisational measures designed to protect
          personal data, including encryption in transit, access controls, and monitoring. No
          system is perfectly secure, so we cannot guarantee absolute security.
        </p>
        <p>
          You play an important part too: use a strong, unique password, enable any additional
          security we offer, and manage workspace roles carefully. If we become aware of a breach
          affecting your personal data, we will notify you and the relevant authorities as
          required by law.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    content: (
      <>
        <p>
          Depending on where you live, you may have the right to access, correct, delete, or
          restrict the processing of your personal data, to object to certain processing, to
          receive a portable copy of your data, and to withdraw consent.
        </p>
        <p>
          To make a request about your account data, contact us through the{" "}
          <a href="/landing#contact">marketing site</a>. We may need to verify your identity
          before responding. If your request concerns data inside a customer workspace, we will
          direct you to the workspace owner, who controls that data.
        </p>
        <p>
          You also have the right to complain to your local data protection authority. We would
          appreciate the chance to address your concern first.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    content: (
      <>
        <p>
          We use strictly necessary cookies and similar storage to keep you signed in, protect
          forms against abuse, and remember your preferences. During the pre-launch flow, details
          you enter while setting up a workspace may be kept in your browser&rsquo;s session
          storage so you can move between steps without re-entering them; that draft is cleared
          when you close the tab.
        </p>
        <p>
          We do not use advertising cookies or cross-site trackers. If we introduce optional
          analytics cookies in future, we will ask for consent where required and update this
          section.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        The Service is intended for businesses and is not directed at children. We do not
        knowingly collect personal data from anyone under 18. If you believe a child has provided
        us with personal data, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy as the Service or the law changes. We will post the new version
        on this page and update the date above. If a change materially affects how we use
        personal data, we will notify workspace owners by email or in-app before it takes effect.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>
          For privacy questions or requests, contact us through the{" "}
          <a href="/landing#contact">marketing site</a>. Our formal privacy contact and company
          details will be published here before general availability.
        </p>
        <p>
          For the rules that govern your use of Callflow, see our{" "}
          <a href="/terms">Terms of Service</a>.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      description="What Callflow collects, why we collect it, how calls and recordings are handled, and the choices you have over your data."
      updated={updated}
      sections={sections}
    />
  );
}
