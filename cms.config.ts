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
  defineSelectWidget
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
})

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
    sectionsConfig
  ],

  singletons: [
    colorsConfig,
    { divider: true },
    headerConfig
  ],
})
