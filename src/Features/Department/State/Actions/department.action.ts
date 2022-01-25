import Department from '../../../../model/department'
/* initialize action type */
export enum actionType {
  addDepartment = 'ADD_DEPARTMENT',
  deleteDepartment = 'DELETE_DEPARTMENT',
  updateDepartment = 'UPDATE_DEPARTMENT',
}


/* define action types */

interface actionAddDepartment {
  type: actionType.addDepartment
  payload: Department |Department[]
}

interface actionDeleteDepartment {
  type: actionType.deleteDepartment
  payload: Department[]
}

interface actionUpdateDepartment {
  type: actionType.updateDepartment
  payload: Department
}

export type Action = actionAddDepartment | actionUpdateDepartment | actionDeleteDepartment
/* //// */

/*  action  creator functions */
export function addDepartment(payload: Department ) {
  return { type: actionType.addDepartment, payload: payload }
 
}

export function removeDepartment(payload: Department[]) {
  return { type: actionType.deleteDepartment, payload: payload }
}

export function editDepartment(payload: Department) {
  return { type: actionType.updateDepartment, payload: payload }
}
