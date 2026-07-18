import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Heart, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Padrões de Segurança Infantil | Lovin Brasil",
  description:
    "Conheça os padrões e as medidas do Lovin Brasil contra abuso e exploração sexual infantil.",
};

const lastUpdated = "18 de julho de 2026";

const summaryItems = [
  "O Lovin Brasil é destinado somente a pessoas maiores de 18 anos.",
  "Não permitimos qualquer conteúdo ou comportamento de abuso e exploração sexual infantil.",
  "Denúncias podem ser feitas dentro do app e são analisadas com prioridade.",
];

const sections = [
  {
    title: "1. Tolerância zero",
    body: [
      "O Lovin Brasil proíbe qualquer forma de abuso e exploração sexual infantil, incluindo aliciamento, sexualização de menores, pedidos ou trocas de imagens, ameaças, chantagens e qualquer conteúdo que coloque crianças ou adolescentes em risco.",
      "Também não permitimos tentativas de facilitar, promover, normalizar ou encobrir esse tipo de comportamento.",
    ],
  },
  {
    title: "2. Idade mínima",
    body: [
      "O Lovin Brasil é destinado somente a pessoas maiores de 18 anos. Contas que pertençam a menores de idade ou que apresentem informações falsas sobre a idade podem ser removidas.",
    ],
  },
  {
    title: "3. Como denunciar",
    body: [
      "Qualquer pessoa pode denunciar um perfil, uma mensagem ou outro conteúdo diretamente dentro do app. Também é possível bloquear imediatamente outro usuário.",
      "Situações relacionadas à segurança infantil recebem tratamento prioritário. Se houver risco imediato, procure as autoridades locais ou os canais oficiais de proteção à criança e ao adolescente.",
    ],
  },
  {
    title: "4. Como agimos",
    body: [
      "Podemos remover conteúdos, restringir recursos, suspender ou encerrar contas e preservar as informações necessárias para uma investigação.",
      "Quando houver obrigação legal ou risco à segurança, encaminharemos a denúncia e as informações pertinentes às autoridades competentes.",
    ],
  },
  {
    title: "5. Prevenção e revisão",
    body: [
      "Mantemos recursos de denúncia e bloqueio, revisão de perfis e análise de comportamentos que possam colocar pessoas em risco.",
      "Revisamos nossas práticas regularmente e orientamos a equipe responsável para responder a denúncias de segurança infantil com cuidado e prioridade.",
    ],
  },
  {
    title: "6. Cooperação com autoridades",
    body: [
      "O Lovin Brasil cumpre as leis aplicáveis de segurança infantil e coopera com autoridades regionais e nacionais quando necessário.",
      "Não conduzimos investigações particulares no lugar das autoridades. Nosso papel é proteger a comunidade, preservar informações relevantes e encaminhar os casos pelos canais adequados.",
    ],
  },
];

export default function ChildSafetyPage() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <Link className="policy-back" href="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar ao início
        </Link>
        <div className="policy-hero-grid">
          <div>
            <p className="section-kicker">Segurança</p>
            <h1>Padrões de Segurança Infantil</h1>
            <p>
              Nosso compromisso é prevenir, identificar e responder com
              prioridade a qualquer situação que coloque crianças ou
              adolescentes em risco.
            </p>
            <span className="policy-date">Última atualização: {lastUpdated}</span>
          </div>
          <div className="policy-card policy-card-highlight">
            <ShieldCheck size={34} aria-hidden="true" />
            <h2>Resumo rápido</h2>
            <ul>
              {summaryItems.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="policy-content" aria-label="Padrões de segurança infantil">
        {sections.map((section) => (
          <article className="policy-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}

        <article className="policy-contact">
          <div>
            <Heart size={28} aria-hidden="true" />
            <h2>7. Contato responsável</h2>
            <p>
              Para comunicar uma preocupação ou falar sobre nossas práticas de
              segurança infantil, entre em contato pelo e-mail abaixo.
            </p>
          </div>
          <a href="mailto:contato@lovinbrasil.com.br?subject=Seguran%C3%A7a%20infantil">
            <Mail size={18} aria-hidden="true" />
            contato@lovinbrasil.com.br
          </a>
        </article>
      </section>
    </main>
  );
}
