import { 
  defineConfig, 
  defineStringWidget, 
  defineDateTimeWidget, 
  defineImageWidget, 
  defineMarkdownWidget, 
  defineNumberWidget, 
  defineListWidget, 
  defineRelationWidget,
  defineObjectWidget,
  defineFileCollection,
  defineFileCollectionEntry,
  defineFolderCollection,
  defineHiddenWidget,
  defineBooleanWidget
} from "@caiquecamargo/vite-plugin-netlify-cms";

export default defineConfig({
  backend: {
    name: "github",
    repo: "caiquecamargo/template-astro",
    branch: "main",
    auth_endpoint: "oauth",
    site_domain: "",
    base_url: "https://",
  },
  
  locale: "pt",
  logo_url: "/logo.svg",

  site_url: 'https://',
  display_url: 'https://',

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
  ]
})