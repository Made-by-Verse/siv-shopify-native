import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'

// // Custom cleanup plugin to remove theme files
// const cleanupPlugin = {
//   name: 'cleanup-theme-assets',
//   buildStart() {
//     const assetsDir = path.resolve('assets')
//     if (fs.existsSync(assetsDir)) {
//       const files = fs.readdirSync(assetsDir)
//       files.forEach(file => {
//         // Add patterns for theme-related files you want to clean
//         if (file.match(/^theme\.|\.js$|\.css$/)) {
//           fs.unlinkSync(path.join(assetsDir, file))
//         }
//       })
//     }
//   }
// }

export default defineConfig({
  plugins: [
    shopify(),
  ],
  build: {
    emptyOutDir: false
  }
})
