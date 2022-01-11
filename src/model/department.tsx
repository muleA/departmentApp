
/* holds data/informations about Department  */
export default interface Department {
    id:string;
    name:string;
    description: string;
    parentDepartmentId ?: string;
}