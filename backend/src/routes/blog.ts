import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string;
    }
}>();

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL }).$extends(withAccelerate());

    try{
       const blog =  await prisma.blog.create({
            data: {
                title : body.title,
                content : body.content,
                authorId : 1
            }
        })
        return c.json({id : blog.id})
    }catch(e){
        c.status(500);
        return c.text("Something's not quite right")
    }
  
})

blogRouter.put('/', async (c) => {
    const body  = await c.req.json();
    const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
    try{
        const blog = await prisma.blog.update({
        where : {
            id : body.id
        },
        data : {
            title : body.title , 
            content : body.content
        }
    })
    return c.json({id : blog.id})
    }catch(e){
         c.status(500);
         return c.text("Error updating blog!");

    }
    
  
})

blogRouter.get('/', async(c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL}).$extends(withAccelerate());

    try{
        const blog = await prisma.blog.findFirst({
            where: {
                id : body.id
            }
        })
        if(!blog){
            c.status(404);
            return c.text("Unable to find the requested blog or it may not exist")
        }
        return c.json({blog});
    }catch(e){
        c.status(500);
        return c.text("Couldn't fetch the requested blog!");
    }
  
})


//todo pagination at some point
blogRouter.get('/bulk', async(c) => {
  const prisma  = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
  try{
    const blogs = await prisma.blog.findMany();
    return c.json({blogs});
  }catch(e){
    c.status(500);
    return c.text("Somehing is terribly wrong");
  }
})