import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,verify,decode} from 'hono/jwt'


const app = new Hono<{
  Bindings : {
    DATABASE_URL :string
    JWT_SECRET : string
  }
}>()


app.post('/api/v1/user/signup', async(c) => {
  const body =  await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try{
   const user = await prisma.user.create({
      data : {
        username : body.username,
        password : body.password,
        name : body.name,
        
      }
    })
    const jwt = await sign({
      id : user.id,
      },c.env.JWT_SECRET)
    return c.text(jwt);

  }catch(e){
    console.log(e);
    c.status(411);
    return c.text('Invalid!')
  }

  
})

app.post('/api/v1/user/signin', async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL
  }).$extends(withAccelerate())

  try{
    const user = await prisma.user.findFirst(
      {
        where : {
          username : body.username,
          password : body.password
        }
      }
    )
    if(!user){
      c.status(403);
      return c.json({"message":"Invalid creds"});
    }
    const jwt = await sign({id : body.id}, c.env.JWT_SECRET);
    return c.text(jwt);

  }catch(e){
    console.log(e);
    c.status(501);
    return c.text("An error occured");
  }

  
})

app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/blog', (c) => {
  return c.text('Hello Hono!')
})

export default app
//psql 'postgresql://neondb_owner:npg_adFMOX5D8BJg@ep-old-lake-a1v4dy0x-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

//DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19hR3VVU2dXVVBFbHZXX0Z2WFhtUTQiLCJhcGlfa2V5IjoiMDFLRzJNNEFETk01VlZWME4zUEZXQjVXSFAiLCJ0ZW5hbnRfaWQiOiIwNWNlODZjZWUxZmMxZDdkZjgwMGY3NTA4YjAyMjA3ZWZkOWNhOGU0NmVmNjQ0NzE2NmE2NmFiYzk1OThkNzM5IiwiaW50ZXJuYWxfc2VjcmV0IjoiYjJlMzIzMWMtYTYyMC00MTIxLWIwMTAtODhhYTk1N2Y2MmFhIn0._JbkAI6whF7GdyG2S3sCFVxE6tazbxWyYQrLC7dkADw"