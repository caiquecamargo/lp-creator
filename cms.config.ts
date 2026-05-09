import {
  defineConfig,
  defineStringWidget,
  defineImageWidget,
  defineNumberWidget,
  defineListWidget,
  defineObjectWidget,
  defineFileCollectionEntry,
  defineFolderCollection,
  defineHiddenWidget,
  defineBooleanWidget,
  defineColorWidget,
  defineSelectWidget,
  defineTextWidget
} from "@caiquecamargo/vite-plugin-netlify-cms";

function createColorObject(name: string, label: string, required = true) {
  return defineObjectWidget({
    name,
    label,
    fields: [
      defineColorWidget({
        name: `default`,
        label: `${label} (Padrão)`,
        required
      }),
      defineColorWidget({
        name: `light`,
        label: `${label} (Light)`,
        required: false,
      }),
      defineColorWidget({
        name: `dark`,
        label: `${label} (Dark)`,
        required: false,
      }),
    ]
  })
};

const colorsConfig = defineFileCollectionEntry({
  name: "colors",
  label: "Cores",
  icon: "colors",
  file: "src/data/colors.json",
  summary: "{{title}}",
  thumbnail: false,
  editor: {
    preview: false
  },
  fields: [
    defineHiddenWidget({
      name: "title",
      label: "Título",
      default: "Cores"
    }),
    createColorObject('primary', 'Primária'),
    createColorObject('secondary', 'Secundária'),
    createColorObject('highlight', 'Realce', false),
  ]
});

const menuItemFields = [
  defineStringWidget({
    name: "label",
    label: "Label"
  }),
  defineImageWidget({
    name: "icon",
    label: "Ícone ou imagem (opcional)",
    required: false,
  }),
  defineBooleanWidget({
    name: "icon-only",
    label: "Exibir apenas o ícone (sem label)",
    default: false,
  }),
  defineStringWidget({
    name: "id",
    label: "ID do componente",
    required: false,
    hint: "Exemplo: #contato. Se preenchido, o link irá rolar a página até o componente com esse ID"
  }),
  defineStringWidget({
    name: "url",
    label: "URL",
    comment: "Apenas para link externo. Se o campo ID for preenchido, esse campo será ignorado",
    hint: "Exemplo: https://exemplo.com",
    required: false
  })
]

const headerConfig = defineFileCollectionEntry({
  name: "header",
  label: "Header",
  icon: "page_header",
  file: "src/data/header.json",
  summary: "{{title}}",
  thumbnail: false,
  editor: {
    preview: false
  },
  fields: [
    defineHiddenWidget({
      name: "title",
      label: "Título",
      default: "Header to"
    }),
    defineBooleanWidget({
      name: "show",
      label: "Exibir Header",
      default: true
    }),
    defineObjectWidget({
      name: "logo",
      label: "Configurações do Logo",
      fields: [
        defineImageWidget({
          name: "image",
          label: "Imagem do Logo",
        }),
        defineSelectWidget({
          name: "position",
          label: "Posição do Logo",
          options: [
            { label: "Esquerda", value: "left" },
            { label: "Centro", value: "center" },
            { label: "Direita", value: "right" },
          ],
          default: "center"
        })
      ]
    }),
    defineListWidget({
      name: "left-menu",
      label: "Menu Esquerdo",
      comment: "Menu mais a esquerda, fica centralizado se o logo estiver alinhado à esquerda",
      default: [],
      required: false,
      fields: menuItemFields
    }),
    defineListWidget({
      name: "right-menu",
      label: "Menu Direito",
      comment: "Menu mais a direita, fica centralizado se o logo estiver alinhado à direita",
      default: [],
      required: false,
      fields: menuItemFields
    })
  ]
});

const sectionsConfig = defineFolderCollection({
  name: "sections",
  label: "Seções",
  icon: "home",
  folder: "src/content/sections",
  fields: [
    defineNumberWidget({
      name: "order",
      label: "Ordem",
      default: 0
    })
  ]
});

const pageConfig = defineFileCollectionEntry({
  name: "page",
  label: "Configurações da Página",
  icon: "page_info",
  file: "src/data/page.json",
  summary: "{{title}}",
  thumbnail: false,
  editor: {
    preview: false
  },
  fields: [
    defineHiddenWidget({
      name: "slug",
      label: "slug",
      default: "page-config"
    }),
    defineHiddenWidget({
      name: "title",
      label: "Título",
      default: "Configurações da Página"
    }),
    defineObjectWidget({
      name: "header",
      label: "Header e topo",
      fields: [
        defineImageWidget({
          name: "logo",
          label: 'Logo da Página',
          required: true,
        }),
        defineImageWidget({
          name: "marker",
          label: 'Marcação',
          required: true,
        }),
        defineImageWidget({
          name: "banner",
          label: 'Banner (1440x780)',
          required: true,
        }),
      ]
    }),
    defineListWidget({
      name: "chars",
      label: "Características",
      default: [],
      required: false,
      fields: [
        defineStringWidget({
          name: "label",
          label: "Label da Característica"
        })
      ]
    }),
    defineObjectWidget({
      name: "form",
      label: "Configurações do Formulário",
      fields: [
        defineImageWidget({
          name: "bannerForm",
          label: 'Banner do Formulário (190x550)',
          required: true,
        }),
        defineStringWidget({
          name: "formTitle",
          label: "Título do Formulário",
          required: true,
        }),
        defineListWidget({
          name: "formFields",
          label: "Campos do Formulário",
          default: [],
          required: false,
          types: [
            defineObjectWidget({
              name: "text",
              label: "Campo de Texto",
              fields: [
                defineStringWidget({
                  name: "name",
                  label: "Nome do campo"
                }),
                defineStringWidget({
                  name: "label",
                  label: "Label do Campo"
                }),
                defineBooleanWidget({
                  name: "required",
                  label: "Campo Obrigatório",
                  default: false,
                })
              ]
            }),
            defineObjectWidget({
              name: "select",
              label: "Campo de Seleção",
              fields: [
                defineStringWidget({
                  name: "name",
                  label: "Nome do campo"
                }),
                defineStringWidget({
                  name: "label",
                  label: "Label do Campo"
                }),
                defineListWidget({
                  name: "options",
                  label: "Opções de Seleção",
                  default: [],
                  required: false,
                  fields: [
                    defineStringWidget({
                      name: "label",
                      label: "Label da Opção"
                    }),
                    defineStringWidget({
                      name: "value",
                      label: "Valor da Opção"
                    })
                  ]
                }),
                defineBooleanWidget({
                  name: "required",
                  label: "Campo Obrigatório",
                  default: false,
                })
              ]
            }),
            defineObjectWidget({
              name: "textarea",
              label: "Campo de Texto Longo",
              fields: [
                defineStringWidget({
                  name: "name",
                  label: "Nome do campo"
                }),
                defineStringWidget({
                  name: "label",
                  label: "Label do Campo"
                }),
                defineBooleanWidget({
                  name: "required",
                  label: "Campo Obrigatório",
                  default: false,
                })
              ]
            })
          ]
        }),
        defineTextWidget({
          name: "formSuccessMessage",
          label: "Mensagem de Sucesso do Formulário",
          required: true,
        }),
        defineTextWidget({
          name: "button",
          label: "Label do Botão",
          required: true,
        }),
      ]
    }),
    defineObjectWidget({
      name: "footer",
      label: "Configurações do Footer",
      fields: [
        defineImageWidget({
          name: "logo",
          label: 'Logo do Footer',
          required: true,
        }),
        defineListWidget({
          name: "phones",
          label: "Telefones",
          default: [],
          required: false,
          fields: [
            defineStringWidget({
              name: "label",
              label: "Label do Telefone"
            }),
          ]
        }),
        defineListWidget({
          name: "addresses",
          label: "Endereços",
          default: [],
          required: false,
          fields: [
            defineStringWidget({
              name: "label",
              label: "Label do Endereço"
            }),
          ]
        }),
      ]
    })
  ]
});

export default defineConfig({
  backend: {
    name: "github",
    repo: "caiquecamargo/lp-creator",
    branch: "main",
    auth_endpoint: "oauth",
    site_domain: "",
    base_url: "https://lp.interone.com.br",
  },

  locale: "pt",
  logo_url: "/logo.svg",

  site_url: 'https://lp.interone.com.br',
  display_url: 'https://lp.interone.com.br',

  media_folder: 'src/assets/images',
  public_folder: '/assets/images',

  media_libraries: {
    default: {
      config: {
        max_file_size: 25_000_000,
        slugify_filename: true,
        transformations: {
          raster_image: {
            format: "webp",
            quality: 85,
            width: 2048,
            height: 2048
          }
        }
      }
    }
  },

  collections: [
    // sectionsConfig
  ],

  singletons: [
    pageConfig,
    // colorsConfig,
    // { divider: true },
    // headerConfig
  ],
})
