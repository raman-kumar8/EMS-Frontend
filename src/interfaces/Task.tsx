export default interface Task{
    createdAt:string,
    description:string,
    endTime:string,
    id:string,
    priority:string,
    tag:{
        id:number,
        tag:'string',
    },
    startTime:string,
    taskName:string,
    taskStatus:string,
    title:string,
    updatedAt:string,
    userId:string,
    duration:string,
    assignedBy:string

}