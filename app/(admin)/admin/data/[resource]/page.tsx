import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deleteResourceRecordAction,
  upsertJsonResourceAction,
} from "@/lib/admin/actions";
import {
  formatValue,
  getOperationalResources,
  getResourcePayloadTemplate,
  listResourceRows,
} from "@/lib/admin/data";
import { getAdminResource } from "@/lib/admin/resources";

type DataPageProps = {
  params: Promise<{ resource: string }>;
  searchParams?: Promise<{ error?: string; saved?: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminDataResourcePage({
  params,
  searchParams,
}: DataPageProps) {
  const { resource: resourceKey } = await params;
  const query = await searchParams;
  const resource = getAdminResource(resourceKey);

  if (!resource) notFound();

  const rows = await listResourceRows(resource.key);
  const resources = getOperationalResources();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="section-kicker">Dados</p>
          <h1>{resource.label}</h1>
          <p>{resource.description}</p>
        </div>
      </div>

      <div className="data-layout">
        <aside className="data-nav">
          {resources.map((item) => (
            <Link
              className={item.key === resource.key ? "active" : ""}
              href={`/admin/data/${item.key}`}
              key={item.key}
            >
              <strong>{item.label}</strong>
              <span>{item.key}</span>
            </Link>
          ))}
        </aside>

        <div className="data-main">
          {query?.error ? <div className="form-error">{query.error}</div> : null}
          {query?.saved ? <div className="form-success">Registro salvo.</div> : null}

          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Criar ou atualizar por JSON</h2>
            </div>
            <form action={upsertJsonResourceAction} className="json-editor-form">
              <input type="hidden" name="resource" value={resource.key} />
              <textarea
                name="payload"
                defaultValue={getResourcePayloadTemplate(resource.key)}
                spellCheck={false}
              />
              <button className="admin-primary-button" type="submit">
                Salvar JSON
              </button>
            </form>
          </section>

          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Registros recentes</h2>
              <span>{rows.length} registros carregados</span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    {resource.columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={String(row[resource.idField])}>
                      {resource.columns.map((column) => (
                        <td key={column}>
                          <span className="cell-truncate">{formatValue(row[column])}</span>
                        </td>
                      ))}
                      <td>
                        <details className="row-details">
                          <summary>JSON</summary>
                          <pre>{JSON.stringify(row, null, 2)}</pre>
                        </details>
                        <form action={deleteResourceRecordAction} className="row-danger-form">
                          <input type="hidden" name="resource" value={resource.key} />
                          <input
                            type="hidden"
                            name="id"
                            value={String(row[resource.idField] ?? "")}
                          />
                          <button type="submit">Excluir</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
