 export default  interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  leaveCount:number,
  activeTasks?:number,
  completedTasks?:number,
  // Add any other fields returned by your `/users/general/user` API
}