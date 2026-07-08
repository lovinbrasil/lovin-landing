import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Filter,
  Heart,
  HeartHandshake,
  MapPin,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";

const leadHref =
  "mailto:contato@lovinbrasil.com?subject=Quero%20acesso%20antecipado%20ao%20Lovin%20Brasil";

const proofPoints = [
  { value: "Verificado", label: "perfis passam por revisão antes da descoberta" },
  { value: "Brasil", label: "preferências por cidade, estado e distância" },
  { value: "Premium", label: "comunidades, eventos e filtros avançados" },
];

const features: Array<{
  title: string;
  copy: string;
  Icon: LucideIcon;
  tone: "rose" | "blue" | "mint";
}> = [
  {
    title: "Intenção antes do match",
    copy: "Propósito, fé, bio, interesses e preferências entram no perfil antes de começar a descoberta.",
    Icon: HeartHandshake,
    tone: "rose",
  },
  {
    title: "Sugestões com contexto",
    copy: "Cidade, estado, distância e filtros ajudam a mostrar pessoas mais alinhadas ao seu momento.",
    Icon: MapPin,
    tone: "blue",
  },
  {
    title: "Ambiente mais cuidado",
    copy: "Verificação, denúncias e perfis completos reduzem ruído e aumentam confiança nas conversas.",
    Icon: ShieldCheck,
    tone: "mint",
  },
];

const flow = [
  {
    title: "Monte um perfil completo",
    copy: "Fotos, bio, denominação, verso favorito, interesses e o que você procura.",
  },
  {
    title: "Descubra pessoas alinhadas",
    copy: "Swipes, likes, super likes e filtros para tornar as sugestões menos aleatórias.",
  },
  {
    title: "Converse com segurança",
    copy: "Match, chat e sinais de confiança para levar a conexão com calma para a vida real.",
  },
];

const premium = [
  { label: "Veja quem curtiu você", Icon: Heart },
  { label: "Use Super Likes", Icon: Sparkles },
  { label: "Filtros avançados", Icon: Filter },
  { label: "Comunidades e eventos", Icon: UsersRound },
  { label: "Volte o último swipe", Icon: RotateCcw },
];

const values = [
  "Perfis com propósito claro",
  "Preferências de fé e estilo de vida",
  "Eventos e comunidades locais",
  "Privacidade e segurança desde o início",
];

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" id="inicio">
        <Image
          src="/lovin-hero.png"
          alt="Casal conversando em um café ao ar livre"
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="hero-image"
        />
        <div className="hero-overlay" />

        <header className="site-nav" aria-label="Navegação principal">
          <a className="brand" href="#inicio" aria-label="Lovin Brasil">
            <span className="brand-mark" aria-hidden="true">
              L
              <span className="brand-heart">♥</span>
            </span>
            <span className="brand-name">Lovin Brasil</span>
          </a>

          <nav className="nav-links" aria-label="Seções da landing">
            <a href="#proposta">Proposta</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#premium">Premium</a>
          </nav>

          <a className="nav-cta" href={leadHref}>
            Entrar na lista
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </header>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Conexões cristãs com intenção</p>
            <h1>Lovin Brasil</h1>
            <p className="hero-text">
              Um app para encontrar alguém para viver amor, fé e leveza, com
              perfis completos, descoberta por contexto e uma experiência feita
              para conexões mais seguras.
            </p>
            <div className="hero-actions" aria-label="Ações principais">
              <a className="button button-primary" href={leadHref}>
                Quero acesso antecipado
                <ArrowRight size={19} aria-hidden="true" />
              </a>
              <a className="button button-ghost" href="#como-funciona">
                Ver proposta
                <SlidersHorizontal size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Destaques do Lovin">
        {proofPoints.map((item) => (
          <div className="proof-item" key={item.value}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section" id="proposta">
        <div className="section-heading">
          <p className="section-kicker">Por que Lovin</p>
          <h2>Menos acaso, mais contexto para começar uma boa conversa.</h2>
          <p>
            O Lovin nasce com a linguagem do app: simples, bonito e direto, mas
            com cuidado real em quem entra, no que busca e em como se conecta.
          </p>
        </div>

        <div className="feature-grid">
          {features.map(({ title, copy, Icon, tone }) => (
            <article className={`feature-card tone-${tone}`} key={title}>
              <div className="feature-icon">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="product-band" id="como-funciona">
        <div className="product-layout">
          <div className="product-copy">
            <p className="section-kicker">Experiência do app</p>
            <h2>Do perfil ao encontro, cada etapa pede intenção.</h2>
            <div className="flow-list">
              {flow.map((item, index) => (
                <article className="flow-item" key={item.title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="phone-stage" aria-label="Prévia visual do app Lovin">
            <div className="phone">
              <div className="phone-top">
                <span />
                <strong>Pra você</strong>
                <Zap size={18} aria-hidden="true" />
              </div>
              <div className="profile-preview">
                <Image
                  src="/lovin-profile-preview.png"
                  alt="Prévia de foto de perfil no Lovin"
                  fill
                  sizes="280px"
                  className="profile-image"
                />
                <div className="profile-shade" />
                <div className="profile-info">
                  <p>Ana, 27</p>
                  <span>São Paulo • fé, família, café</span>
                </div>
              </div>
              <div className="match-panel">
                <div>
                  <span className="mini-label">Compatibilidade</span>
                  <strong>Propósito alinhado</strong>
                </div>
                <CheckCircle2 size={22} aria-hidden="true" />
              </div>
              <div className="action-row" aria-hidden="true">
                <button type="button">×</button>
                <button type="button">
                  <Sparkles size={19} />
                </button>
                <button type="button">
                  <Heart size={22} fill="currentColor" />
                </button>
              </div>
              <div className="chat-bubble">
                <MessageCircle size={19} aria-hidden="true" />
                <span>Comece com uma pergunta boa.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="safety-section">
        <div className="safety-copy">
          <p className="section-kicker">Confiança</p>
          <h2>Uma comunidade precisa de beleza, mas também de limites.</h2>
          <p>
            O app já nasce com revisão de identidade, denúncias, preferências de
            privacidade e regras pensadas para manter o ambiente leve.
          </p>
        </div>
        <div className="value-grid">
          {values.map((item) => (
            <div className="value-item" key={item}>
              <CheckCircle2 size={20} aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-section" id="premium">
        <div className="premium-header">
          <div>
            <p className="section-kicker">Lovin Premium</p>
            <h2>Mais alcance para quem quer levar a busca a sério.</h2>
          </div>
          <a className="button button-secondary" href={leadHref}>
            Saber do lançamento
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>

        <div className="premium-grid">
          {premium.map(({ label, Icon }) => (
            <article className="premium-card" key={label}>
              <Icon size={23} aria-hidden="true" />
              <h3>{label}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <Image
          src="/lovin-icon.png"
          alt=""
          width={78}
          height={78}
          className="cta-logo"
        />
        <p className="section-kicker">Acesso antecipado</p>
        <h2>Prepare a chegada do Lovin Brasil.</h2>
        <p>
          Entre na lista para receber novidades do lançamento, convites de teste
          e os próximos passos do app.
        </p>
        <a className="button button-primary" href={leadHref}>
          Entrar na lista do Lovin
          <ArrowRight size={19} aria-hidden="true" />
        </a>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio" aria-label="Voltar ao início">
          <span className="brand-mark" aria-hidden="true">
            L
            <span className="brand-heart">♥</span>
          </span>
          <span className="brand-name">Lovin Brasil</span>
        </a>
        <div className="footer-links">
          <a href="#proposta">Proposta</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#premium">Premium</a>
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>
        </div>
      </footer>
    </main>
  );
}
