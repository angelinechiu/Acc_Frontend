"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  Sparkles,
  ScanLine,
  ShieldCheck,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { Brand } from "@/components/common/layout/app-shell";
import { PublicHeader } from "@/components/common/layout/public-header";
import { Badge, Field, ErrorState } from "@/components/common/ui";
import { HelpCenter } from "@/features/common/help/help-center";
import {
  activateAccount,
  getAccounts,
  login,
  passwordChecks,
  requestPasswordReset,
  resetPassword,
} from "@/lib/api/auth.service";
import { requestEnterpriseAccess } from "@/lib/api/tenant.service";
import { roleHome } from "@/lib/permissions";
import { useResource } from "@/features/common/hooks/use-resource";
export function PublicPage({ page }: { page: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const { data: accounts } = useResource(getAccounts, "public");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activation, setActivation] = useState(params.get("user") ?? "");
  const titles: Record<string, string> = {
    login: "Welcome back",
    welcome: "Welcome!",
    "request-access": "Register your enterprise",
    activate: "Activate your account",
    "forgot-password": "Forgot your password?",
    "reset-password": "Create a new password",
    help: "Help & support",
  };
  const selected = accounts?.find((a) => a.id === activation);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(event.currentTarget);
    try {
      if (page === "login") {
        const user = await login(email, password);
        router.push(
          `/welcome?name=${encodeURIComponent(user.name)}&home=${encodeURIComponent(roleHome(user.role))}`,
        );
      } else if (page === "request-access") {
        await requestEnterpriseAccess({
          company: String(f.get("company")),
          registration: String(f.get("registration")),
          contact: String(f.get("contact")),
          email: String(f.get("email")),
          phone: String(f.get("phone")),
          accounts: Number(f.get("accounts")),
          employees: [],
          notes: String(f.get("notes")),
        });
        setSuccess(
          "Enterprise access request submitted. Your request is awaiting SAIC approval.",
        );
      } else if (page === "activate") {
        await activateAccount(
          activation,
          password,
          String(f.get("confirm")),
        );
        setSuccess(
          "Account activated successfully. You can now sign in using your company email.",
        );
      } else if (page === "forgot-password") {
        await requestPasswordReset(String(f.get("email")));
        setSuccess(
          "Reset request recorded. Continue below to set a new password.",
        );
      } else {
        await resetPassword(
          password,
          String(f.get("confirm")),
        );
        setSuccess(
          "Password reset completed successfully. You can now sign in with your new password.",
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (page === "help")
    return (
      <div className="landing help-page">
        <PublicHeader active="help" />
        <main className="help-page-main">
          <div className="section-heading help-page-heading">
            <span>SUPPORT CENTRE</span>
            <h1>Tutorial and enterprise helpline</h1>
            <p>
              Learn the Accounting Intelligence workflow, or request assistance
              from the SAIC support team when you need a human response.
            </p>
          </div>
          <div className="help-page-panel">
            <HelpCenter />
          </div>
        </main>
        <footer className="public-footer">
          <span>ACCOUNTING INTELLIGENCE · SAIC</span>
        </footer>
      </div>
    );

  if (!page)
    return (
      <div className="landing">
        <PublicHeader />
        <main className="landing-main">
          <div className="landing-copy">
            <div className="eyebrow">
              <span className="pulse-dot" /> ENTERPRISE ACCOUNTING INTELLIGENCE
            </div>
            <div className="hero-rating">
              <span>SAIC</span> secure · auditable · built for finance teams
            </div>
            <h1>
              From invoice to
              <br />
              trusted <em>record.</em>
            </h1>
            <p className="landing-subtitle">
              AI-driven invoice processing with
              <br />
              automated record standardisation
            </p>
            <p className="landing-description">
              One professional workspace for extraction, exception handling,
              validation, and standardised accounting records — with clear
              ownership at every step.
            </p>
            <div className="actions">
              <Link href="/login" className="btn primary">
                Enter your workspace <ArrowRight size={17} />
              </Link>
              <Link href="/request-access" className="btn">
                Register enterprise
              </Link>
            </div>
            <form
              className="landing-email-cta"
              onSubmit={(event) => {
                event.preventDefault();
                const value = new FormData(event.currentTarget).get("work-email");
                router.push(`/request-access?email=${encodeURIComponent(String(value ?? ""))}`);
              }}
            >
              <input
                name="work-email"
                type="email"
                aria-label="Work email"
                placeholder="Enter your work email"
                required
              />
              <button className="btn primary">Get started</button>
            </form>
            <div className="landing-trust">
              <ShieldCheck size={17} /> Built for teams. Designed for
              accountability.
            </div>
          </div>
          <div className="landing-visual">
            <div className="floating-label">
              <CheckCircle2 size={16} /> From document to decision
            </div>
            <div className="invoice-mock">
              <div className="invoice-mock-header">
                <div className="brand-symbol">
                  <FileCheck2 size={26} />
                </div>
                <Badge>VALIDATED</Badge>
              </div>
              <small>STANDARDISED ACCOUNTING RECORD</small>
              <h2>Everything in its right place.</h2>
              <div className="invoice-grid">
                <div>
                  <small>SUPPLIER</small>
                  <strong>Atlas Office Supplies</strong>
                </div>
                <div>
                  <small>INVOICE</small>
                  <strong>INV-2026-00821</strong>
                </div>
              </div>
              <div className="invoice-lines">
                <span>Office supplies</span>
                <strong>RM 800.00</strong>
              </div>
              <div className="invoice-lines">
                <span>Tax · 6%</span>
                <strong>RM 48.00</strong>
              </div>
              <div className="invoice-total">
                <span>Total amount</span>
                <strong>RM 848.00</strong>
              </div>
              <div className="verified">
                <CheckCircle2 size={16} /> Extracted. Validated. Ready for
                what’s next.
              </div>
            </div>
            <div className="floating-metric">
              <ScanLine size={22} />
              <div>
                <strong>96.4%</strong>
                <span>Illustrative extraction accuracy</span>
              </div>
            </div>
          </div>
        </main>
        <section className="product-showcase" aria-label="Platform preview">
          <div className="showcase-glow" />
          <div className="product-window">
            <div className="product-window-bar">
              <span className="window-dots"><i /><i /><i /></span>
              <span>Accounting Intelligence workspace</span>
              <Badge>Ready</Badge>
            </div>
            <div className="product-window-body">
              <aside className="preview-nav">
                <strong>Workspace</strong>
                {["Overview", "Documents", "Exceptions", "Records"].map((item, index) => (
                  <span className={index === 0 ? "active" : ""} key={item}>
                    <i /> {item}
                  </span>
                ))}
              </aside>
              <div className="preview-content">
                <div className="preview-heading">
                  <div><small>GOOD MORNING</small><h2>Your financial workflow, at a glance.</h2></div>
                  <span className="preview-avatar">AT</span>
                </div>
                <div className="preview-stats">
                  {[["42", "Processed"], ["7", "Needs review"], ["98%", "Validated"]].map(([value, label]) => (
                    <div key={label}><span>{label}</span><strong>{value}</strong><small>Updated just now</small></div>
                  ))}
                </div>
                <div className="preview-grid">
                  <div className="preview-chart">
                    <div><strong>Processing volume</strong><span>Last 7 days</span></div>
                    <div className="preview-bars">
                      {[44, 68, 52, 84, 61, 92, 75].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
                    </div>
                  </div>
                  <div className="preview-activity">
                    <div><strong>Recent activity</strong><span>Live</span></div>
                    {["Invoice validated", "Record standardised", "Review assigned"].map((item, index) => (
                      <p key={item}><i className={`activity-dot dot-${index}`} /><span>{item}</span><small>{index + 1}m</small></p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="landing-features">
          <div className="section-heading">
            <span>ONE CONNECTED WORKSPACE</span>
            <h2>Designed to make complex accounting feel simple.</h2>
            <p>Give every role the clarity to move faster, without losing control or context.</p>
          </div>
          <div className="feature-cards">
            {[
              [Sparkles, "Intelligent extraction", "Turn invoices into structured, review-ready data with confidence signals."],
              [Zap, "Faster exception handling", "Route mismatches to the right person and keep every correction traceable."],
              [BarChart3, "Operational visibility", "See processing health, workload, and validation outcomes in one place."],
              [Users, "Built for every role", "Focused workspaces for platform administrators, company admins, and accountants."],
            ].map(([Icon, title, copy]) => (
              <article key={String(title)}>
                <span className="feature-icon"><Icon size={21} /></span>
                <h3>{String(title)}</h3>
                <p>{String(copy)}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="workflow-strip">
          {[
            "Upload",
            "Extract",
            "Validate",
            "Review",
            "Standardise",
            "Export",
          ].map((step, i) => (
            <div key={step}>
              <span>0{i + 1}</span>
              <strong>{step}</strong>
              {i < 5 && <ArrowRight size={16} />}
            </div>
          ))}
        </section>

        <section className="landing-final-cta">
          <div>
            <span>READY FOR A CLEARER CLOSE?</span>
            <h2>Clean data. Clear records. Confident accounting.</h2>
          </div>

          <div className="actions">
            <Link href="/request-access" className="btn primary">
              Register enterprise <ArrowRight size={16} />
            </Link>

            <Link href="/login" className="btn">
              Sign in
            </Link>

            <Link href="/help" className="btn">
              Help
            </Link>
          </div>
        </section>

        <footer className="public-footer">
          <span>ACCOUNTING INTELLIGENCE · SAIC</span>
        </footer>
      </div>
    );
  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Link href="/">
          <Brand />
        </Link>
        <div>
          <div className="eyebrow">ACCOUNTING INTELLIGENCE</div>
          <h1>
            Precision for every
            <br />
            financial document.
          </h1>
          <p>
            Enterprise-grade invoice intelligence, exception control, and
            standardised records in one workspace.
          </p>
          <div className="auth-features">
            {[
              [Upload, "Documents, organised"],
              [ScanLine, "Intelligence, applied"],
              [FileCheck2, "Records, standardised"],
            ].map(([Icon, text]) => {
              const I = Icon as typeof Upload;
              return (
                <div key={String(text)}>
                  <I size={19} />
                  <span>{String(text)}</span>
                  <Check size={15} />
                </div>
              );
            })}
          </div>
        </div>
        <small>SAIC · Enterprise Accounting Intelligence</small>
      </aside>
      <main className="auth-content">
        <div className="auth-top-links">
          <Link href="/" className="back-link">
            ← Back to home
          </Link>
          <Link href="/help" className="back-link auth-help-link">
            Help & tutorial
          </Link>
        </div>
        <div className={`auth-form ${page === "request-access" ? "wide" : ""}`}>
          <span className="auth-icon">
            <LockKeyhole size={23} />
          </span>
          <h1>{titles[page] ?? "Page not found"}</h1>
          <p>
            {page === "login"
              ? "Sign in to your Accounting Intelligence workspace."
              : page === "welcome"
                  ? "Your identity has been verified successfully."
              : page === "request-access"
                ? "Submit your company details to register for enterprise access. SAIC will review your request."
                  : page === "reset-password"
                    ? "Choose a strong password to keep your workspace secure."
                : "Secure access starts with your company email."}
          </p>
          {page === "welcome" ? (
            <div className="success-state">
              <CheckCircle2 size={40} />
              <h2>Successful and welcome!</h2>
              <p>
                Welcome{params.get("name") ? `, ${params.get("name")}` : ""}.
                Your secure workspace is ready.
              </p>
              <Link
                className="btn primary"
                href={params.get("home")?.startsWith("/") ? params.get("home")! : "/login"}
              >
                Continue to dashboard <ArrowRight size={16} />
              </Link>
            </div>
          ) : success ? (
            <div className="success-state">
              <CheckCircle2 size={40} />
              <h2>
                {page === "request-access"
                  ? "Request received"
                  : "You’re all set"}
              </h2>
              <p>{success}</p>
              {page === "request-access" && <Badge>PENDING</Badge>}
              <Link
                className="btn primary"
                href={page === "forgot-password" ? "/reset-password" : "/login"}
              >
                {page === "forgot-password"
                  ? "Continue password reset"
                  : "Continue to login"}
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              {error && <ErrorState message={error} />}
              {page === "login" && (
                <>
                  <Field label="Company email *">
                    <input
                      type="email"
                      autoComplete="username"
                      placeholder="you@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Password *"
                    hint="Enter your account password to continue."
                  >
                    <input
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>
                </>
              )}
              {page === "request-access" && (
                <>
                  <div className="form-grid">
                    <Field label="Company name *">
                      <input
                        name="company"
                        required
                        placeholder="Your company Sdn Bhd"
                      />
                    </Field>
                    <Field label="Registration number *">
                      <input
                        name="registration"
                        required
                        placeholder="202601234567"
                      />
                    </Field>
                    <Field label="Contact person / manager *">
                      <input name="contact" required />
                    </Field>
                    <Field label="Company email *">
                      <input
                        name="email"
                        type="email"
                        required
                        defaultValue={params.get("email") ?? ""}
                      />
                    </Field>
                    <Field label="Phone number">
                      <input name="phone" type="tel" />
                    </Field>
                    <Field label="Accounts required *">
                      <input
                        name="accounts"
                        type="number"
                        min="1"
                        max="1000"
                        defaultValue="10"
                        required
                      />
                    </Field>
                  </div>
                  <Field label="Reason / notes">
                    <textarea name="notes" rows={2} />
                  </Field>
                </>
              )}
              {page === "activate" && (
                <>
                  <Field label="Pending invitation">
                    <select
                      required
                      value={activation}
                      onChange={(e) => setActivation(e.target.value)}
                    >
                      <option value="">Select an invitation</option>
                      {accounts
                        ?.filter((a) =>
                          ["INVITED", "INVITATION_EXPIRED"].includes(a.status),
                        )
                        .map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} · {a.email}
                          </option>
                        ))}
                    </select>
                  </Field>
                  {selected && (
                    <div className="info-box">
                      <strong>{selected.email}</strong>
                      <span>Company: {selected.tenantId}</span>
                      <Badge>{selected.role}</Badge>
                    </div>
                  )}
                </>
              )}
              {page === "forgot-password" && (
                <Field label="Company email *">
                  <input name="email" type="email" required />
                </Field>
              )}
              {["activate", "reset-password"].includes(page) && (
                <div className="password-setup">
                  <div className="password-setup-heading">
                    <strong>Set your password</strong>
                    <span>Use a password only you can guess.</span>
                  </div>
                  <Field label="Create password *">
                    <input
                      required
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>
                  <Field label="Confirm password *">
                    <input
                      required
                      name="confirm"
                      type="password"
                      autoComplete="new-password"
                    />
                  </Field>
                  <div className="password-checks" aria-live="polite">
                    <span className="password-checks-title">
                      Password requirements
                    </span>
                    {[
                      "At least 8 characters",
                      "Uppercase letter",
                      "Lowercase letter",
                      "Number",
                      "Special character",
                    ].map((text, i) => (
                      <span
                        className={passwordChecks(password)[i] ? "passed" : ""}
                        key={text}
                      >
                        <Check size={13} />
                        {text}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button className="btn primary full" disabled={busy}>
                {busy
                  ? "Please wait…"
                  : page === "login"
                    ? "Continue with email"
                    : page === "request-access"
                      ? "Submit enterprise registration"
                      : page === "activate"
                        ? "Activate account"
                        : page === "forgot-password"
                          ? "Request reset"
                          : "Reset password"}
                <ArrowRight size={16} />
              </button>
              {page === "login" && (
                <>
                  <Link href="/forgot-password" className="form-link">
                    Forgot password?
                  </Link>
                  <p className="form-bottom">
                    New to Accounting Intelligence?{" "}
                    <Link href="/request-access">Register enterprise</Link>
                    {" · "}
                    <Link href="/help">Need help?</Link>
                  </p>
                </>
              )}
              {page === "request-access" && (
                <p className="form-bottom">
                  Already registered? <Link href="/login">Sign in</Link>
                  {" · "}
                  <Link href="/help">Help & tutorial</Link>
                </p>
              )}
            </form>
          )}
          <div className="secure-note">
            <ShieldCheck size={15} />
            <span>
              {page === "request-access"
                ? "Enterprise registration is reviewed by SAIC before workspace activation."
                : "Your account access is protected by your company credentials."}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
