export type AdminResource = {
  key: string;
  label: string;
  description: string;
  idField: string;
  orderBy?: string;
  readOnly?: boolean;
  columns: string[];
};

export const adminResources: AdminResource[] = [
  {
    key: "profiles",
    label: "Usuários",
    description: "Perfis, status, premium, verificação e dados centrais.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "full_name", "city", "state", "purpose", "is_active", "is_verified", "is_premium", "created_at"],
  },
  {
    key: "identity_verifications",
    label: "Aprovações",
    description: "Submissões de documento e selfie para revisão.",
    idField: "id",
    orderBy: "submitted_at",
    columns: ["id", "user_id", "status", "document_type", "legal_full_name", "submitted_at", "reviewed_at"],
  },
  {
    key: "profile_photos",
    label: "Fotos",
    description: "Mídias públicas dos perfis.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "user_id", "position", "is_main", "public_url", "created_at"],
  },
  {
    key: "profile_videos",
    label: "Vídeos",
    description: "Vídeos curtos de perfil.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "user_id", "position", "duration_seconds", "public_url", "created_at"],
  },
  {
    key: "profile_details",
    label: "Detalhes",
    description: "Prompt, altura, idiomas, estilo de vida e preferências de exibição.",
    idField: "user_id",
    orderBy: "updated_at",
    columns: ["user_id", "prompt_question", "height_cm", "relationship_type", "education", "updated_at"],
  },
  {
    key: "user_preferences",
    label: "Preferências",
    description: "Filtros de descoberta e distância.",
    idField: "id",
    orderBy: "updated_at",
    columns: ["id", "user_id", "min_age", "max_age", "max_distance_km", "updated_at"],
  },
  {
    key: "likes",
    label: "Likes",
    description: "Curtidas e super likes enviados.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "from_user_id", "to_user_id", "type", "created_at"],
  },
  {
    key: "dislikes",
    label: "Dislikes",
    description: "Perfis descartados na descoberta.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "from_user_id", "to_user_id", "created_at"],
  },
  {
    key: "matches",
    label: "Matches",
    description: "Pares conectados e status do relacionamento.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "user_1_id", "user_2_id", "status", "created_at", "unmatched_at"],
  },
  {
    key: "conversations",
    label: "Conversas",
    description: "Conversas criadas a partir de matches.",
    idField: "id",
    orderBy: "last_message_at",
    columns: ["id", "match_id", "last_message_at", "updated_at", "created_at"],
  },
  {
    key: "messages",
    label: "Mensagens",
    description: "Mensagens de chat e mídias associadas.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "conversation_id", "sender_id", "message_type", "content", "created_at"],
  },
  {
    key: "communities",
    label: "Comunidades",
    description: "Grupos, células, estudos e comunidades premium.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "name", "category", "city", "state", "is_premium", "created_at"],
  },
  {
    key: "community_members",
    label: "Membros",
    description: "Participantes e papéis dentro das comunidades.",
    idField: "id",
    orderBy: "joined_at",
    columns: ["id", "community_id", "user_id", "role", "joined_at"],
  },
  {
    key: "events",
    label: "Eventos",
    description: "Encontros presenciais, cultos, estudos e voluntariado.",
    idField: "id",
    orderBy: "event_date",
    columns: ["id", "community_id", "title", "city", "state", "event_date", "created_at"],
  },
  {
    key: "event_participants",
    label: "RSVPs",
    description: "Confirmações e interesse em eventos.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "event_id", "user_id", "status", "created_at"],
  },
  {
    key: "reports",
    label: "Denúncias",
    description: "Fila de reports e status de moderação.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "reporter_id", "reported_user_id", "reason", "status", "created_at"],
  },
  {
    key: "blocks",
    label: "Bloqueios",
    description: "Bloqueios entre usuários.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "blocker_id", "blocked_user_id", "created_at"],
  },
  {
    key: "notifications",
    label: "Notificações",
    description: "Notificações in-app e payloads.",
    idField: "id",
    orderBy: "created_at",
    columns: ["id", "user_id", "type", "title", "read_at", "created_at"],
  },
];

export const adminResourceMap = new Map(adminResources.map((resource) => [resource.key, resource]));

export function getAdminResource(key: string) {
  return adminResourceMap.get(key);
}

export function assertAdminResource(key: string) {
  const resource = getAdminResource(key);
  if (!resource) {
    throw new Error("Recurso administrativo inválido.");
  }
  return resource;
}
