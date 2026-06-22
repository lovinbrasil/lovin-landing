import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  UserRound,
  XCircle,
} from "lucide-react";

import { reviewIdentityAction } from "@/lib/admin/actions";
import {
  formatDate,
  formatStatus,
  getStatusClassName,
} from "@/lib/admin/data";
import { createAdminDataClient, createSupabaseServiceClient } from "@/lib/supabase/server";

type ApprovalDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    review?: string;
  }>;
};

type DocumentPreviewProps = {
  title: string;
  path?: string | null;
  url?: string | null;
};

export const dynamic = "force-dynamic";

async function getSignedUrl(path?: string | null) {
  if (!path) return null;
  const client = await createAdminDataClient();
  const { data } = await client.storage.from("identity-documents").createSignedUrl(path, 900);
  return data?.signedUrl ?? null;
}

function relationField(value: unknown, field: string) {
  if (Array.isArray(value)) return relationField(value[0], field);
  if (value && typeof value === "object" && field in value) {
    const fieldValue = (value as Record<string, unknown>)[field];
    return typeof fieldValue === "string" || typeof fieldValue === "boolean" ? fieldValue : null;
  }
  return null;
}

function metadataText(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object") return null;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function getReviewerName(userId?: string | null) {
  if (!userId) return null;

  const serviceClient = createSupabaseServiceClient();

  if (serviceClient) {
    const { data } = await serviceClient.auth.admin.getUserById(userId);
    const user = data.user;
    const name =
      metadataText(user?.user_metadata, "full_name") ??
      metadataText(user?.user_metadata, "name") ??
      metadataText(user?.user_metadata, "display_name") ??
      user?.email;

    if (name) return name;
  }

  const client = await createAdminDataClient();
  const { data: profile } = await client
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  return profile?.full_name ?? null;
}

function DocumentPreview({ title, path, url }: DocumentPreviewProps) {
  return (
    <article className="document-preview-card">
      <header>
        <div>
          <FileText size={18} aria-hidden="true" />
          <strong>{title}</strong>
        </div>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer">
            Abrir
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        ) : null}
      </header>
      {url ? (
        <iframe
          className="document-frame"
          src={url}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="document-empty-state">Arquivo não enviado.</div>
      )}
      <small>{path ?? "Sem caminho no storage"}</small>
    </article>
  );
}

export default async function ApprovalDetailPage({
  params,
  searchParams,
}: ApprovalDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const client = await createAdminDataClient();
  const { data: approval, error } = await client
    .from("identity_verifications")
    .select(
      "id, user_id, status, document_type, document_last4, legal_full_name, birth_date, document_front_path, document_back_path, selfie_path, rejection_reason, submitted_at, reviewed_at, reviewed_by, profiles(full_name, city, state, is_verified)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!approval) notFound();

  const [frontUrl, backUrl, selfieUrl, reviewerName] = await Promise.all([
    getSignedUrl(approval.document_front_path),
    getSignedUrl(approval.document_back_path),
    getSignedUrl(approval.selfie_path),
    getReviewerName(approval.reviewed_by),
  ]);
  const profileName = relationField(approval.profiles, "full_name");
  const profileCity = relationField(approval.profiles, "city");
  const profileState = relationField(approval.profiles, "state");
  const returnTo = `/admin/approvals/${approval.id}`;
  const isPending = approval.status === "pending";
  const isRejected = approval.status === "rejected";
  const reviewToast =
    query?.review === "approved"
      ? {
          className: "success",
          title: "Verificação aprovada",
          copy: "A solicitação foi aprovada e o perfil foi atualizado.",
          Icon: CheckCircle2,
        }
      : query?.review === "rejected"
        ? {
            className: "danger",
            title: "Verificação rejeitada",
            copy: "A solicitação foi rejeitada com o motivo informado.",
            Icon: XCircle,
          }
        : null;

  return (
    <div className="admin-page">
      {reviewToast ? (
        <div className={`admin-toast ${reviewToast.className}`} role="status">
          <reviewToast.Icon size={20} aria-hidden="true" />
          <div>
            <strong>{reviewToast.title}</strong>
            <span>{reviewToast.copy}</span>
          </div>
        </div>
      ) : null}

      <div className="approval-detail-toolbar">
        <Link href="/admin/approvals">
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar para aprovações
        </Link>
        <span className={getStatusClassName(approval.status)}>
          {formatStatus(approval.status)}
        </span>
      </div>

      <div className="approval-detail-hero">
        <div>
          <p className="section-kicker">Revisão de identidade</p>
          <h1>{approval.legal_full_name}</h1>
          <p>
            {approval.document_type.toUpperCase()} final{" "}
            {approval.document_last4 ?? "----"} enviado em{" "}
            {formatDate(approval.submitted_at)}
          </p>
        </div>
        <div className="approval-detail-person">
          <UserRound size={18} aria-hidden="true" />
          <div>
            <small>Feito por</small>
            <strong>{profileName ?? approval.user_id}</strong>
            <span>
              {profileCity ?? "Cidade não informada"}
              {profileState ? `, ${profileState}` : ""}
            </span>
          </div>
        </div>
      </div>

      <section className="approval-detail-layout">
        <div className="approval-detail-main">
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Dados da solicitação</h2>
            </div>
            <dl className="admin-definition-grid approval-detail-grid">
              <div>
                <dt>Usuário</dt>
                <dd>{approval.user_id}</dd>
              </div>
              <div>
                <dt>Feito por</dt>
                <dd>{profileName ?? "Perfil sem nome"}</dd>
              </div>
              <div>
                <dt>Nascimento</dt>
                <dd>{approval.birth_date}</dd>
              </div>
              <div>
                <dt>Documento</dt>
                <dd>
                  {approval.document_type.toUpperCase()} final{" "}
                  {approval.document_last4 ?? "----"}
                </dd>
              </div>
              <div>
                <dt>Revisado em</dt>
                <dd>{approval.reviewed_at ? formatDate(approval.reviewed_at) : "-"}</dd>
              </div>
              <div>
                <dt>Revisado por</dt>
                <dd>{reviewerName ?? "Ainda não revisado"}</dd>
              </div>
              <div className="approval-detail-wide">
                <dt>Motivo da rejeição</dt>
                <dd>{approval.rejection_reason ?? "-"}</dd>
              </div>
            </dl>
          </section>

          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Documentos enviados</h2>
            </div>
            <div className="document-preview-grid">
              <DocumentPreview
                title="Frente do documento"
                path={approval.document_front_path}
                url={frontUrl}
              />
              <DocumentPreview
                title="Verso do documento"
                path={approval.document_back_path}
                url={backUrl}
              />
              <DocumentPreview title="Selfie" path={approval.selfie_path} url={selfieUrl} />
            </div>
          </section>
        </div>

        <aside className="approval-review-panel">
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Ações de revisão</h2>
            </div>
            {isPending ? (
              <>
                <form action={reviewIdentityAction} className="approval-approve-form">
                  <input type="hidden" name="verification_id" value={approval.id} />
                  <input type="hidden" name="intent" value="approve" />
                  <input type="hidden" name="return_to" value={returnTo} />
                  <button className="admin-primary-button" type="submit">
                    <CheckCircle2 size={17} aria-hidden="true" />
                    Aprovar verificação
                  </button>
                </form>

                <form action={reviewIdentityAction} className="approval-reject-form">
                  <input type="hidden" name="verification_id" value={approval.id} />
                  <input type="hidden" name="intent" value="reject" />
                  <input type="hidden" name="return_to" value={returnTo} />
                  <label>
                    <span>Motivo</span>
                    <textarea
                      name="reason"
                      placeholder="Explique o motivo da rejeição"
                      defaultValue={approval.rejection_reason ?? ""}
                      required
                    />
                  </label>
                  <button type="submit">
                    <XCircle size={17} aria-hidden="true" />
                    Rejeitar
                  </button>
                </form>
              </>
            ) : (
              <div className={isRejected ? "approval-reviewed-state danger" : "approval-reviewed-state success"}>
                {isRejected ? (
                  <XCircle size={22} aria-hidden="true" />
                ) : (
                  <CheckCircle2 size={22} aria-hidden="true" />
                )}
                <strong>
                  {isRejected ? "Verificação rejeitada" : "Verificação aprovada"}
                </strong>
                <p>
                  Esta solicitação já foi revisada
                  {approval.reviewed_at ? ` em ${formatDate(approval.reviewed_at)}` : ""}.
                </p>
              </div>
            )}
          </section>
        </aside>
      </section>
    </div>
  );
}
