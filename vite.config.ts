import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-workspace-assets',
      configureServer(server) {
        server.middlewares.use('/assets', (req, res, next) => {
          try {
            const cleanUrl = (req.url || '').split('?')[0].replace(/^\//, '')
            const publicPath = path.join(__dirname, 'public', 'assets', decodeURIComponent(cleanUrl))
            const rootPath = path.join(__dirname, 'assets', decodeURIComponent(cleanUrl))
            const filePath = fs.existsSync(publicPath) ? publicPath : rootPath
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase()
              const stat = fs.statSync(filePath)
              const totalSize = stat.size

              const mimeTypes: Record<string, string> = {
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.jpeg': 'image/jpeg',
                '.jpg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml'
              }

              const contentType = mimeTypes[ext] || 'application/octet-stream'

              // Range header support for audio/video seeking
              const range = req.headers.range
              if (range) {
                const parts = range.replace(/bytes=/, '').split('-')
                const start = parseInt(parts[0], 10)
                const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1
                const chunksize = end - start + 1

                res.writeHead(206, {
                  'Content-Range': `bytes ${start}-${end}/${totalSize}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': chunksize,
                  'Content-Type': contentType
                })
                fs.createReadStream(filePath, { start, end }).pipe(res)
                return
              }

              res.writeHead(200, {
                'Content-Length': totalSize,
                'Accept-Ranges': 'bytes',
                'Content-Type': contentType
              })
              fs.createReadStream(filePath).pipe(res)
              return
            }
          } catch (e) {
            console.error('Error serving asset:', e)
          }
          next()
        })
      }
    }
  ],
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/assets/**']
    }
  }
})
