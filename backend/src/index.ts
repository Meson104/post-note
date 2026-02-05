import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'


const app = new Hono<{
  Bindings : {
    DATABASE_URL :string
    JWT_SECRET : string
  }
}>()

app.use('/*', cors())
app.route('/api/v1/user',userRouter)
app.route('/api/v1/blog',blogRouter)



export default app
//psql 'postgresql://neondb_owner:npg_adFMOX5D8BJg@ep-old-lake-a1v4dy0x-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

//DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19hR3VVU2dXVVBFbHZXX0Z2WFhtUTQiLCJhcGlfa2V5IjoiMDFLRzJNNEFETk01VlZWME4zUEZXQjVXSFAiLCJ0ZW5hbnRfaWQiOiIwNWNlODZjZWUxZmMxZDdkZjgwMGY3NTA4YjAyMjA3ZWZkOWNhOGU0NmVmNjQ0NzE2NmE2NmFiYzk1OThkNzM5IiwiaW50ZXJuYWxfc2VjcmV0IjoiYjJlMzIzMWMtYTYyMC00MTIxLWIwMTAtODhhYTk1N2Y2MmFhIn0._JbkAI6whF7GdyG2S3sCFVxE6tazbxWyYQrLC7dkADw"