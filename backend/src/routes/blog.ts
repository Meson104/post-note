import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@kar104/postnote-common";


export const blogRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string;
        JWT_SECRET : string;
    },
    Variables : {
        userId : string;
    }
}>();

blogRouter.use('/*', async (c,next)=>{
    const authHeader = c.req.header("Authorization" ) || "";
    try{
        const user = await verify(authHeader, c.env.JWT_SECRET,'HS256') as {id : string}
    if(user) {
        c.set("userId",user.id);
        await next();
    }else {
        c.status(403);
        return c.json({
            message : "you are not logged in!"
        });
    }
    }catch(e){
        c.status(403);
        return c.text(`You are not logged in`);
    }
    
})


blogRouter.post('/', async (c) => {
  const userId = c.get("userId");
  const authorId = Number(userId);

  if (!Number.isInteger(authorId)) {
    c.status(400);
    return c.json({
      message: "Invalid userId from auth middleware",
      userId
    });
  }

  const body = await c.req.json();
  const {success} = createBlogInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
        message : "Incorrect inputs!"
    })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId
    }
  });

  return c.json({ id: blog.id });
});


blogRouter.put('/', async (c) => {
    const body  = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
        message : "Incorrect inputs!"
    })
  }
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

blogRouter.get('/:id', async(c) => {
    const id =  c.req.param("id");
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL}).$extends(withAccelerate());

    try{
        const blog = await prisma.blog.findFirst({
            where: {
                id : Number(id)
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


