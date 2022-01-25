import { Button, Modal, Tree } from 'antd'
import { useSelector } from 'react-redux'
import Department from '../../../model/department'
import { RootState } from '../../../store'
export default function DepartmentUnderManagement(props: {
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
  /*/////////*/

  const reformattedNodes: {
    id: string
    key: string
    title: string
    parent_id: string | undefined
  }[] = departments.map((element: Department) => {
    return {
      id: element.id,
      key: element.id,
      title: element.name,
      parent_id: element.parentDepartmentId,
    }
  })

  function makeTree(nodes: any, parentId: string) {
    return nodes
      .filter((node: any) => node.parent_id === parentId)
      .reduce(
        (tree: any, node: any) => [
         ...tree,
         
          { 
            ...node,
            children: makeTree(nodes, node.id),
          },
        ],
        []
      )
  }

  /*/////////*/
  const getDescendents = (ancestorId: string): Department[] => {
    let descendents = departments.filter((item) => {
      let parent: Department | undefined = departments.find((department: Department) => {
        return department.id === item.parentDepartmentId
      })
      while (parent != null) {
        if (parent.id === ancestorId) {
          return true
        }

        // eslint-disable-next-line no-loop-func
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
        }
      })
    : []
  /*  */
  return (
    <Modal
      title={'List of Departments Under  ' + props.selectedDepartment?.name}
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
          <Tree className="w" treeData={makeTree(reformattedNodes, props.selectedDepartment!.id)} />
        )}
      </>
    </Modal>
  )
}
