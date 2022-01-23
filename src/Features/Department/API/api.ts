import Department from '../../../model/department'
import axios from 'axios'
const Department_API_BASE_URL = 'https://localhost:5001/api/departments'
//objects to initialize the api apiEndpoints
const apiEndPoints = {
  createDepartment: Department_API_BASE_URL + '/create-department',
  updateDepartment: Department_API_BASE_URL + '/update-department',
  deleteDepartment: Department_API_BASE_URL + '/delete-department/',
  getDepartments: Department_API_BASE_URL + '/get-departments/',
}

export const api = {
  createDepartment:(department:Department)=> {
    return axios.post(apiEndPoints.createDepartment, department)
  },
  getDepartment:() => {
    return axios.get(apiEndPoints.getDepartments)
  },
  deleteDepartment: (id: string) => {
    return axios.delete(apiEndPoints.deleteDepartment + id)
  },
  updateDepartment: (department:Department) => {
    return axios.post(apiEndPoints.updateDepartment, department)
  },
}
