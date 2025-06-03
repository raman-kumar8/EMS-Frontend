export default interface Task{
    created_at:string,
    description:string,
    end_time:string,
    id:string,
    priority:string,
    tag:{
        id:number,
        tag:'string',
    },
    start_time:string,
    taskName:string,
    taskStatus:string,
    title:string,
    updated_at:string,
    user_id:string,

}