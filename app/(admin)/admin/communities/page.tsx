import { deleteResourceRecordAction, upsertCommunityAction } from "@/lib/admin/actions";
import { formatDate } from "@/lib/admin/data";
import { createAdminDataClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCommunitiesPage() {
  const client = await createAdminDataClient();
  const { data: communities, error } = await client
    .from("communities")
    .select("id, name, description, city, state, denomination, category, is_premium, created_at")
    .order("created_at", { ascending: false })
    .limit(80);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="section-kicker">Comunidades</p>
          <h1>CRUD de comunidades</h1>
          <p>Crie e ajuste grupos, células, estudos, categorias e acesso premium.</p>
        </div>
      </div>

      {error ? <div className="form-error">{error.message}</div> : null}

      <section className="admin-panel">
        <div className="panel-heading">
          <h2>Nova comunidade</h2>
        </div>
        <form action={upsertCommunityAction} className="admin-form-grid">
          <input name="name" placeholder="Nome" required />
          <input name="category" placeholder="Categoria" required />
          <input name="city" placeholder="Cidade" />
          <input name="state" placeholder="UF" />
          <input name="denomination" placeholder="Denominação" />
          <label className="admin-checkbox">
            <input type="checkbox" name="is_premium" />
            Premium
          </label>
          <textarea name="description" placeholder="Descrição" />
          <button className="admin-primary-button" type="submit">
            Criar comunidade
          </button>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Comunidade</th>
                <th>Categoria</th>
                <th>Local</th>
                <th>Premium</th>
                <th>Criada em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {(communities ?? []).map((community) => (
                <tr key={community.id}>
                  <td>
                    <strong>{community.name}</strong>
                    <small>{community.description ?? community.id}</small>
                  </td>
                  <td>{community.category}</td>
                  <td>
                    {community.city ?? "-"}
                    {community.state ? `, ${community.state}` : ""}
                    <small>{community.denomination ?? "-"}</small>
                  </td>
                  <td>
                    <span className={community.is_premium ? "status-premium" : "status-muted"}>
                      {community.is_premium ? "premium" : "aberta"}
                    </span>
                  </td>
                  <td>{formatDate(community.created_at)}</td>
                  <td>
                    <details className="row-details">
                      <summary>Editar</summary>
                      <form action={upsertCommunityAction} className="row-edit-form">
                        <input type="hidden" name="id" value={community.id} />
                        <input name="name" defaultValue={community.name} required />
                        <input name="category" defaultValue={community.category} required />
                        <input name="city" defaultValue={community.city ?? ""} />
                        <input name="state" defaultValue={community.state ?? ""} />
                        <input name="denomination" defaultValue={community.denomination ?? ""} />
                        <label className="admin-checkbox">
                          <input
                            type="checkbox"
                            name="is_premium"
                            defaultChecked={community.is_premium}
                          />
                          Premium
                        </label>
                        <textarea name="description" defaultValue={community.description ?? ""} />
                        <button type="submit">Salvar</button>
                      </form>
                    </details>
                    <form action={deleteResourceRecordAction} className="row-danger-form">
                      <input type="hidden" name="resource" value="communities" />
                      <input type="hidden" name="id" value={community.id} />
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
  );
}
