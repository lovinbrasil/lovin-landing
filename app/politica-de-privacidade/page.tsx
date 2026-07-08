import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Heart, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade | Lovin Brasil",
  description:
    "Entenda, em linguagem simples, como o Lovin Brasil cuida das informações usadas no app.",
};

const lastUpdated = "8 de julho de 2026";

const summaryItems = [
  "Usamos suas informações para criar sua conta, montar seu perfil e melhorar suas sugestões.",
  "Informações de fé são voluntárias e ajudam a conectar pessoas com mais contexto.",
  "Você pode pedir acesso, correção ou exclusão das suas informações pelo nosso contato.",
];

const sections = [
  {
    title: "1. Quem somos",
    body: [
      "O Lovin Brasil é um app de conexões cristãs feito para aproximar pessoas com intenção, respeito e segurança.",
      "Esta política explica como cuidamos das informações que você compartilha ao usar o app, o site e nossos canais de atendimento.",
    ],
  },
  {
    title: "2. Informações que podemos usar",
    body: [
      "Podemos usar informações de cadastro, como nome, e-mail, data de nascimento e cidade.",
      "Também podemos usar informações do seu perfil, como fotos, bio, interesses, propósito, preferências, denominação, igreja, frequência aos cultos e verso favorito, quando você decidir informar.",
      "Mensagens, curtidas, denúncias, bloqueios e interações dentro do app também podem ser usados para manter a experiência funcionando e mais segura.",
      "Quando você assina o Lovin Gold, recebemos apenas as informações necessárias para liberar e acompanhar sua assinatura. Os detalhes de pagamento são tratados pela loja do seu celular.",
    ],
  },
  {
    title: "3. Por que usamos essas informações",
    body: [
      "Usamos suas informações para criar e proteger sua conta, mostrar seu perfil para outras pessoas, sugerir conexões, liberar recursos, enviar avisos importantes e responder pedidos de suporte.",
      "Também usamos informações para revisar perfis, investigar denúncias, evitar uso indevido e cumprir obrigações legais quando necessário.",
    ],
  },
  {
    title: "4. Informações de fé",
    body: [
      "Algumas informações de fé podem ser sensíveis. Por isso, elas são voluntárias e devem ser compartilhadas apenas se você se sentir confortável.",
      "Essas informações ajudam a enriquecer seu perfil e suas sugestões, mas você pode editar ou remover esses campos quando quiser dentro do app.",
    ],
  },
  {
    title: "5. O que outras pessoas veem",
    body: [
      "Outras pessoas podem ver informações do seu perfil, como nome, idade, fotos, cidade aproximada, bio, interesses, propósito e campos de fé que você decidiu preencher.",
      "Mensagens aparecem apenas nas conversas em que você participa. Denúncias e bloqueios não são exibidos para outros usuários.",
    ],
  },
  {
    title: "6. Com quem podemos compartilhar",
    body: [
      "Podemos compartilhar informações com parceiros que nos ajudam a operar o app, processar assinaturas, enviar comunicações, proteger contas e prestar atendimento.",
      "Também podemos compartilhar informações quando isso for necessário para cumprir a lei, proteger direitos, investigar comportamento abusivo ou responder a autoridades competentes.",
      "Não vendemos suas informações pessoais.",
    ],
  },
  {
    title: "7. Segurança e cuidado",
    body: [
      "Adotamos medidas de proteção para reduzir acessos indevidos, perda ou uso não autorizado das informações.",
      "Mesmo assim, nenhum app é totalmente imune a riscos. Por isso, recomendamos que você use uma senha forte, mantenha seu e-mail seguro e avise nosso time se notar algo estranho.",
    ],
  },
  {
    title: "8. Seus direitos e escolhas",
    body: [
      "Você pode pedir confirmação de uso, acesso, correção, exclusão, revisão de escolhas e informações sobre compartilhamento das suas informações pessoais.",
      "Você também pode editar boa parte do seu perfil diretamente no app e pedir a exclusão da conta pelo nosso contato.",
    ],
  },
  {
    title: "9. Tempo de guarda",
    body: [
      "Mantemos suas informações enquanto sua conta estiver ativa ou enquanto forem necessárias para oferecer o serviço, cumprir obrigações legais, resolver disputas e proteger a comunidade.",
      "Quando a exclusão for solicitada, removeremos ou deixaremos de identificar as informações que não precisarem mais ser mantidas.",
    ],
  },
  {
    title: "10. Idade mínima",
    body: [
      "O Lovin Brasil é destinado apenas a pessoas maiores de 18 anos. Se identificarmos uma conta de menor de idade, poderemos remover a conta e as informações relacionadas.",
    ],
  },
  {
    title: "11. Mudanças nesta política",
    body: [
      "Podemos atualizar esta política para refletir melhorias no app, mudanças legais ou novos recursos. Quando a alteração for importante, vamos avisar por um canal adequado.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <Link className="policy-back" href="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar ao início
        </Link>
        <div className="policy-hero-grid">
          <div>
            <p className="section-kicker">Privacidade</p>
            <h1>Política de Privacidade</h1>
            <p>
              Nosso compromisso é explicar, de forma clara, como cuidamos das
              informações usadas para tornar o Lovin Brasil mais seguro,
              respeitoso e útil para conexões reais.
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

      <section className="policy-content" aria-label="Texto da política">
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
            <h2>12. Fale com o Lovin</h2>
            <p>
              Para pedidos sobre privacidade, conta ou informações pessoais,
              fale com a gente pelo e-mail abaixo.
            </p>
          </div>
          <a href="mailto:contato@lovinbrasil.com">
            <Mail size={18} aria-hidden="true" />
            contato@lovinbrasil.com
          </a>
        </article>
      </section>
    </main>
  );
}
