import axios from 'axios'
const Department_API_BASE_URL = 'https://localhost:5001/api/departments'

const endPoints = {
  createDepartment: Department_API_BASE_URL + '/create-department',
  updateDepartment: Department_API_BASE_URL + '/update-department',
  deleteDepartment: Department_API_BASE_URL + '/delete-department/',
  getDepartment: Department_API_BASE_URL + '/get-department/',
  getDepartments: Department_API_BASE_URL + '/get-departments/',
}

export const api = {
  createDepartment: (department: {
    name: string
    description: string
    parentDepartmentId?: string
  }) => {
    return axios.post(endPoints.createDepartment, department)
  },
  getDepartment: () => {
    return axios.get(endPoints.getDepartments)
  },
  deleteDepartment: (id: string) => {
    return axios.delete(endPoints.deleteDepartment + id)
  },
  updateDepartment: (department: {
    name: string
    description: string
    parentDepartmentId?: string
  }) => {
    return axios.post(endPoints.updateDepartment, department)
  },
}
