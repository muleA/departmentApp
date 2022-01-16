/* eslint-disable no-loop-func */
import { Button, Modal, TreeSelect } from 'antd'
import { useSelector } from 'react-redux'
import Department from '../model/department'
import { RootState } from '../store'

export default function DepartmentDetails(props: {
  visibility: boolean
  visibilityToggler: (visible: boolean) => void
  selectedDepartment?: Department
}) {
  const departments = useSelector((state: RootState) => state.departments)
  /* event handler */
  const handleOk = () => {
    props.visibilityToggler(false)
  }
  const handleCancel = () => {
    props.visibilityToggler(false)
  }
  /* event handler finished */

  const getDescendents: (ancestorId: string) => Department[] = (ancestorId) => {
    let descendents = departments.filter((item) => {
      let parent: Department | undefined = departments.find((department: Department) => {
        return department.id === item.parentDepartmentId
      })

      while (parent != null) {
        if (parent.id === ancestorId) {
          return true
        }

        parent = departments.find((department: Department) => {
          return department.id === parent!.parentDepartmentId
        })
      }

      return false
    })

    return descendents
  }

  const managedDepartments: Department[] | undefined = getDescendents(props.selectedDepartment!.id)
  const managedDepartmentsTreeData = managedDepartments
    ? managedDepartments.map((department: Department) => {
        return {
          id: department.id,
          pId: department.parentDepartmentId,
          title: department.name,
          value: department.id,
          selectable: false,
        }
      })
    : []
  return (
    <Modal
      title={'Department Under Your  Department'}
      width={500}
      visible={props.visibility}
      closable={false}
      footer={[
        <Button
          type="primary"
          className="text-white bg-red-600 hover:bg-blue-200  
  font-medium rounded-lg text-sm  "
          onClick={handleCancel}
        >
          Cancel
        </Button>,
        <Button
          className="text-white bg-green-600 hover:bg-blue-200  
  font-medium rounded-lg text-sm "
          onClick={handleOk}
        >
          Ok
        </Button>,
      ]}
    >
      <>
        {managedDepartmentsTreeData.length === 0 ? (
          ' none'
        ) : (
          <TreeSelect
            className="w"
            treeData={managedDepartmentsTreeData}
            placeholder="Click to view departments"
            treeDataSimpleMode
          />
        )}
      </>
    </Modal>
  )
}
