/* eslint-disable no-loop-func */
import { Form, Button, notification, Modal } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import Department from '../model/department'
import { deleteDepartment } from '../Redux/reducer/department.reducer'
import { useState } from 'react'

export default function DeleteDepartment(props: {
  modalVisibility: boolean
  selectedDepartment?: Department
  visibilityToggler: (visible: boolean) => void
}) {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const departments: Department[] = useSelector((state: RootState) => state.departments)
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  /*  */

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

  /*  */

  const handleCancel = () => {
    props.visibilityToggler(false)
  }
  /*   const handleOk = () => {
        props.visibilityToggler(false);
      }; */

  const ConfirmDelete: (department: Department) => void = (department) => {
    setDeleteLoading(true)
    const asyncDispatcher = async () => {
      await dispatch(deleteDepartment(department, getDescendents(department.id)))
    }

    asyncDispatcher()
      .then(() => {
        notification.success({
          message: `Department removed successfully`,
          description: 'Department has been removed successfully.',
          placement: 'bottomRight',
        })
        props.visibilityToggler(false)
        setDeleteLoading(false)
        form.resetFields()
      })
      .catch((err) => {
        notification.error({
          message: `Failed to delete department`,
          description: err + '.',
          placement: 'bottomRight',
        })
        setDeleteLoading(false)
      })
  }
  return (
    <Modal
      className="text-center mx-auto "
      title="Delete Modal"
      onCancel={handleCancel}
      closeIcon="X"
      visible={props.modalVisibility}
      footer={[
        <Button
          className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
          key="back"
          onClick={handleCancel}
        >
          Cancel
        </Button>,
        <Button
          className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 
  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          key="submit"
          type="primary"
          loading={deleteLoading}
          onClick={() => ConfirmDelete(props.selectedDepartment!)}
        >
          Ok
        </Button>,
      ]}
    >
      <h1 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
        <QuestionCircleOutlined style={{ fontSize: '60px', color: 'red' }} /> Are You Sure to Delete
        Department name=<span style={{ color: 'red' }}> {props.selectedDepartment?.name} </span>{' '}
      </h1>
    </Modal>
  )
}
