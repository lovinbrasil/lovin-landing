import { deleteResourceRecordAction, upsertEventAction } from "@/lib/admin/actions";
import { formatDate } from "@/lib/admin/data";
import { createAdminDataClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function dateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function relationName(value: unknown) {
  if (Array.isArray(value)) return relationName(value[0]);
  if (value && typeof value === "object" && "name" in value) {
    const name = (value as { name?: unknown }).name;
    return typeof name === "string" ? name : null;
  }
  return null;
}

export default async function AdminEventsPage() {
  const client = await createAdminDataClient();
  const [{ data: events, error }, { data: communities }] = await Promise.all([
    client
      .from("events")
      .select("id, community_id, title, description, location_name, city, state, event_date, created_at, communities(name)")
      .order("event_date", { ascending: false })
      .limit(80),
    client.from("communities").select("id, name").order("name", { ascending: true }).limit(200),
  ]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="section-kicker">Eventos</p>
          <h1>CRUD de eventos</h1>
          <p>Gerencie encontros, estudos, cultos jovens, voluntariado e agenda premium.</p>
        </div>
      </div>

      {error ? <div className="form-error">{error.message}</div> : null}

      <section className="admin-panel">
        <div className="panel-heading">
          <h2>Novo evento</h2>
        </div>
        <form action={upsertEventAction} className="admin-form-grid">
          <select name="community_id" required defaultValue="">
            <option value="" disabled>
              Comunidade
            </option>
            {(communities ?? []).map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
          <input name="title" placeholder="Título" required />
          <input name="location_name" placeholder="Local" />
          <input name="city" placeholder="Cidade" />
          <input name="state" placeholder="UF" />
          <input name="event_date" type="datetime-local" required />
          <textarea name="description" placeholder="Descrição" />
          <button className="admin-primary-button" type="submit">
            Criar evento
          </button>
        </form>
      </section>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Comunidade</th>
                <th>Local</th>
                <th>Data</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {(events ?? []).map((event) => (
                <tr key={event.id}>
                  <td>
                    <strong>{event.title}</strong>
                    <small>{event.description ?? event.id}</small>
                  </td>
                  <td>{relationName(event.communities) ?? event.community_id}</td>
                  <td>
                    {event.location_name ?? "-"}
                    <small>
                      {event.city ?? "-"}
                      {event.state ? `, ${event.state}` : ""}
                    </small>
                  </td>
                  <td>{formatDate(event.event_date)}</td>
                  <td>{formatDate(event.created_at)}</td>
                  <td>
                    <details className="row-details">
                      <summary>Editar</summary>
                      <form action={upsertEventAction} className="row-edit-form">
                        <input type="hidden" name="id" value={event.id} />
                        <select name="community_id" defaultValue={event.community_id} required>
                          {(communities ?? []).map((community) => (
                            <option key={community.id} value={community.id}>
                              {community.name}
                            </option>
                          ))}
                        </select>
                        <input name="title" defaultValue={event.title} required />
                        <input name="location_name" defaultValue={event.location_name ?? ""} />
                        <input name="city" defaultValue={event.city ?? ""} />
                        <input name="state" defaultValue={event.state ?? ""} />
                        <input
                          name="event_date"
                          type="datetime-local"
                          defaultValue={dateTimeLocal(event.event_date)}
                          required
                        />
                        <textarea name="description" defaultValue={event.description ?? ""} />
                        <button type="submit">Salvar</button>
                      </form>
                    </details>
                    <form action={deleteResourceRecordAction} className="row-danger-form">
                      <input type="hidden" name="resource" value="events" />
                      <input type="hidden" name="id" value={event.id} />
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
