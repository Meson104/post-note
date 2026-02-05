
import { BiCommentDetail, BiDownvote, BiUpvote } from "react-icons/bi";

interface BlogCardProps {
    authorName : string,
    title : string ,
    content : string ,
    publishedDate : string ,
}

export const BlogCard = ({authorName , title , content,publishedDate} : BlogCardProps) => {
    return <div className="border border-slate-200 pb-2">
        <div className="flex">


            <div className=""> <Avatar name={authorName}/> </div>
               
            

            <div className="flex justify-center "> 
                <div className="font-extralight text-sm pl-2 text-slate-600 flex justify-center flex-col">  {authorName}</div>
             <div className="flex justify-center flex-col pl-2 "><Circle/></div>
            <div className="pl-2 font-thin text-sm text-slate-800 flex justify-center flex-col">{publishedDate}</div>
            </div>
            
            
            
        </div>
        <div>
             
        </div>
        <div className="text-xl font-semibold pt-2">
            {title}  
        </div>

        <div className="text-md font-light">
            {content.length>=100 ? content.slice(0,100) + "..." : content}
        </div>
        <div className="flex justify-between items-center pt-4">
            

             <div className="flex gap-3 ">
               
               <div> <BiUpvote  /> </div>
                <div>  <BiDownvote />  </div>
                <div><BiCommentDetail/></div>
                    
             
            </div>

             <div className="text-slate-700 font-thin text-sm flex justify-center items-center flex-col ">
            {`${Math.ceil(content.length/100)} min read`}
            </div>

           
        </div>

       
    </div>
}


function Circle(){
    return <div className="rounded-full w-1 h-1 bg-slate-500">

    </div>
}

function Avatar({name} : {name : string}) {

return (
<div className="relative inline-flex items-center justify-center w-6 h-6 overflow-hidden bg-slate-600 rounded-full">
    <span className="font-light text-sm text-white">{name[0].toLowerCase()}</span>
</div>
)

}