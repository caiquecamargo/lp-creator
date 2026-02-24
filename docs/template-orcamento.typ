#let project_quote(
  client: "Nome do Cliente",
  project_name: "Nome do Projeto",
  date: datetime.today().display(),
  validity: "15 dias",
  tech_stack: (
    frontend: "AstroJS & VueJS (Cloudflare Pages)",
    backend: "NestJS / GraphQL (AWS Lambda)",
    cms: "Sveltia-CMS",
  ),
  items: (),
  total_value: "R$ 0,00",
  payment_terms: "50% na aprovação e 50% na entrega.",
  deadline: "30 dias úteis",
) = {
  // Configurações de Página e Fonte
  set page(
    paper: "a4",
    margin: (x: 2.5cm, y: 2.5cm),
    header: align(right, text(gray, size: 9pt)[Proposta Comercial | #project_name]),
    footer: [
      #line(length: 100%, stroke: 0.5pt + gray)
      #grid(
        columns: (1fr, 1fr),
        text(gray, size: 8pt)[#client],
        align(right, context text(gray, size: 8pt)[Página #counter(page).display()])
      )
    ]
  )
  set text(font: "DejaVu Sans", size: 11pt, lang: "pt")

  // Cabeçalho / Identidade
  align(center)[
    #block(inset: 10pt, fill: rgb("#0051cc"), radius: 5pt)[
      #text(white, size: 20pt, weight: "bold")[ORÇAMENTO DE PROJETO]
    ]
    #v(1em)
    #text(size: 14pt, weight: "medium")[#project_name]
    #v(0.5em)
    #text(gray)[Data: #date | Validade: #validity]
  ]

  v(2em)

  // Seção: Informações do Cliente
  text(weight: "bold", size: 13pt, fill: rgb("#0051cc"))[1. Identificação]
  grid(
    columns: (1fr, 1fr),
    gutter: 1em,
    [**Cliente:** #client],
    [**Responsável Técnico:** Caique]
  )

  v(1.5em)

  // Seção: Arquitetura Proposta (Híbrida)
  text(weight: "bold", size: 13pt, fill: rgb("#0051cc"))[2. Arquitetura Técnica]
  rect(fill: rgb("#f0f4ff"), width: 100%, inset: 10pt, radius: 4pt)[
    - *Frontend:* #tech_stack.frontend
    - *Backend:* #tech_stack.backend
    - *Gestão de Conteúdo:* #tech_stack.cms
    - *Infraestrutura:* Cloudflare Pages (Edge)
  ]

  v(1.5em)

  // Seção: Escopo e Itens
  text(weight: "bold", size: 13pt, fill: rgb("#0051cc"))[3. Detalhamento do Escopo]
  table(
    columns: (3fr, 1fr),
    inset: 10pt,
    fill: (x, y) => if y == 0 { rgb("#e0e0e0") } else { white },
    [*Descrição da Task/Funcionalidade*], [*Investimento*],
    ..items.flatten()
  )

  v(1em)
  align(right)[
    #block(inset: 8pt, fill: rgb("#eef6ff"), radius: 3pt)[
      #text(size: 14pt, weight: "bold")[Total: #total_value]
    ]
  ]

  v(1.5em)

  // Seção: Prazos e Condições
  text(weight: "bold", size: 13pt, fill: rgb("#0051cc"))[4. Condições Comerciais]
  list(
    [**Prazo de Entrega:** #deadline],
    [**Forma de Pagamento:** #payment_terms],
    [Desenvolvimento em conformidade com as melhores práticas de SEO e segurança.],
    [Hospedagem Frontend em Cloudflare Pages inclusa (dentro do free tier ou plano do cliente).]
  )

  v(3em)
  
  // Assinaturas
  grid(
    columns: (1fr, 1fr),
    gutter: 2cm,
    align(center)[
      #line(length: 80%, stroke: 0.5pt)
      #text(size: 9pt)[Caique \ Desenvolvedor Responsável]
    ],
    align(center)[
      #line(length: 80%, stroke: 0.5pt)
      #text(size: 9pt)[#client \ Aprovação do Cliente]
    ]
  )
}