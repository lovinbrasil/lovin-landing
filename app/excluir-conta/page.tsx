import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Heart, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Excluir conta | Lovin Brasil",
  description: "Saiba como solicitar a exclusão da sua conta e das suas informações no Lovin Brasil.",
};

const removedItems = [
  "Seu perfil, suas fotos e suas preferências.",
  "Curtidas, conexões, mensagens e participações em comunidades.",
  "Informações enviadas para análise e segurança da comunidade.",
];

export default function DeleteAccountPage() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <Link className="policy-back" href="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar ao início
        </Link>

        <div className="policy-hero-grid">
          <div>
            <p className="section-kicker">Sua conta</p>
            <h1>Excluir conta</h1>
            <p>
              Você pode encerrar sua conta do Lovin Brasil e solicitar a exclusão das suas informações a qualquer momento.
            </p>
          </div>

          <div className="policy-card policy-card-highlight">
            <ShieldCheck size={34} aria-hidden="true" />
            <h2>O que será excluído</h2>
            <ul>
              {removedItems.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="policy-content" aria-label="Como excluir sua conta">
        <article className="policy-section">
          <h2>Excluir pelo aplicativo</h2>
          <p>Abra o Lovin Brasil e entre na sua conta.</p>
          <p>Acesse Perfil, abra Configurações e toque em “Excluir minha conta”.</p>
          <p>Leia o aviso e confirme a exclusão. Depois de concluída, não será possível recuperar a conta.</p>
        </article>

        <article className="policy-section">
          <h2>Solicitar por e-mail</h2>
          <p>
            Se você não conseguir entrar no app, envie uma mensagem usando o mesmo e-mail cadastrado na conta. Informe no assunto “Exclusão de conta”.
          </p>
          <p>Responderemos com as orientações necessárias para confirmar a solicitação com segurança.</p>
        </article>

        <article className="policy-section">
          <h2>Prazo e informações mantidas</h2>
          <p>
            A solicitação será concluída em até 30 dias. Algumas informações poderão ser mantidas somente pelo período necessário para cumprir obrigações legais, prevenir fraudes, resolver disputas e proteger a comunidade.
          </p>
          <p>Essas informações deixam de ser usadas para oferecer o serviço e são eliminadas quando o prazo obrigatório termina.</p>
        </article>

        <article className="policy-contact">
          <div>
            <Heart size={28} aria-hidden="true" />
            <h2>Solicitar exclusão</h2>
            <p>Envie a solicitação pelo mesmo endereço de e-mail usado na sua conta.</p>
          </div>
          <a href="mailto:contato@lovinbrasil.com?subject=Exclus%C3%A3o%20de%20conta">
            <Mail size={18} aria-hidden="true" />
            contato@lovinbrasil.com
          </a>
        </article>
      </section>
    </main>
  );
}
