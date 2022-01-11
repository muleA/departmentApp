
 import Department from "../model/department";
 import axios from "axios";
 const Department_API_BASE_URL="https://localhost:5001/api/departments"; 
const endPoints = {
 createDepartment: Department_API_BASE_URL+"/create-department",
 updateDepartment: Department_API_BASE_URL+"/update-department",
 deleteDepartment: Department_API_BASE_URL+"/delete-department/",
 getDepartment: Department_API_BASE_URL+"/get-department/",
 getDepartments: Department_API_BASE_URL+"/get-departments/",
};

export default class DepartmentApi{
      

    static createDepartment:(department:{name:string;description:string;parentDepartmentId?:string})=>any = 
    (department)=>{
        return axios.post(endPoints.createDepartment,department);
    }

    static getDepartment:()=>any = ()=>{
        return axios.get(endPoints.getDepartments);
    }

    static deleteDepartment:(id:string)=>any = (id)=>{
        return axios.delete(endPoints.deleteDepartment + id);
    }

    static updateDepartment:(department:Department)=>any = (department)=>{
        return axios.post(endPoints.updateDepartment,department);
    }
}