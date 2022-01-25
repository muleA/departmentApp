/* eslint-disable no-loop-func */
import { Button, notification, Spin, Table, Space, Card, Modal, Form } from 'antd'
import { PlusCircleFilled, DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import Department from '../../../model/department'
import { deleteDepartment, getDepartment } from '../State/reducer/department.reducer'
import { useEffect, useState } from 'react'
import { RootState } from '../../../store'
import DepartmentModal from '../Components/department_Modal'
import { QuestionCircleOutlined } from '@ant-design/icons'
import DepartmentUnderManagement from '../Components/department_Under_management'
export default function Departments() {
  const departments: Department[] = useSelector((state: RootState) => state.departments)  // extract data from the Redux store state,
  const dispatch = useDispatch()    // used to dispatch action
  const [form] = Form.useForm() 
  const [formType, setFormType] = useState<'new' | 'update' | null>(null)
  const data: Department[] = departments
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(undefined)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isCreate_UpdateModalVisible, setIsCreate_UpdateModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsdeleteModalVisible] = useState(false)
  const [isDepartment_Under_ManagementModalVisble,setisDepartment_Under_ManagementModalVisble] = useState(false)

  const getDescendents = (ancestorId: string): Department[] => {
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

  /* event handlers */
  const showDepartmentFormModal = () => {
    setIsCreate_UpdateModalVisible(!isCreate_UpdateModalVisible)
  }
  const showDepartmentUnderManagementModal = () => {
    setisDepartment_Under_ManagementModalVisble(!isDepartment_Under_ManagementModalVisble)
  }
  const handleDeleteOk = () => {
    setIsdeleteModalVisible(false)
  }

  const handleDeleteCancel = () => {
    setIsdeleteModalVisible(false)
  }

  const onNewDepartment = () => {
    setFormType('new')
    setIsCreate_UpdateModalVisible(!isCreate_UpdateModalVisible)
  }
  const onUpdateDepartment = (id: string) => {
    setFormType('update')
    setSelectedDepartment(
      departments.find((department) => {
        return department.id === id
      })
    )
    showDepartmentFormModal()
  }
  const showDeleteModal = (id: string) => {
    setIsdeleteModalVisible(true)
    setSelectedDepartment(
      departments.find((department) => {
        return department.id === id
      })
    )
    setIsdeleteModalVisible(!isDeleteModalVisible)
  }
  const onDepartmentUnderManagement = (id: string) => {
    setSelectedDepartment(
      departments.find((department) => {
        return department.id === id
      })
    )
    showDepartmentUnderManagementModal()
  }

  const ConfirmDelete = (department: Department): void => {
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

        setDeleteLoading(false)
        form.resetFields()
        setIsdeleteModalVisible(false)
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
  /* //// */
  //data fetching
  useEffect(() => {
    const asyncDispatcher = async () => {
      return await dispatch(getDepartment)
    }
    asyncDispatcher()
      .then(() => setFetchDataLoading(false))
      .catch((err) => {
        notification.error({
          message: `Failed to retrieve departments`,
          description: err + '.',
          placement: 'bottomRight',
        })
        setFetchDataLoading(false)
      })
  }, [dispatch])

  /* ant design table  */
  const columns = [
    {
      title: 'Department Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Department Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Managing Department',
      key: 'parentDepartmentId',
      dataIndex: 'parentDepartmentId',
      render: (parentDepartmentId: string) => {
        const parent: Department | undefined = data.find((item: Department) => {
          return item.id === parentDepartmentId
        })
        return <>{parent ? parent.name : 'None'}</>
      },
    },

    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle" className="mx-auto">
          <Button
            name="details"
            type="primary"
            className=" bg-blue-800 hover:bg-blue-900 text-white font-bold   rounded-full 
            flex items-center"
            onClick={() => {
              onDepartmentUnderManagement(record.id)
            }}
            icon={<EyeFilled />}
          >
            View
          </Button>
          <Button
          type="primary"
            name="update"
            className="bg-blue-600 hover:bg-blue-400 text-whiteSmoke font-bold  rounded-full flex items-center"
            onClick={() => {
              onUpdateDepartment(record.id)
            }}
            icon={<EditFilled />}
          >
            Update
          </Button>
          <Button
            type="primary"
            className="text-white font-bold  bg-red-600 hover:bg-red-800 rounded-full flex items-center"
            name="delete"
            /*
             */
            onClick={() => showDeleteModal(record.id)}
            danger
            icon={<DeleteFilled />}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Modal
        className="text-center mx-auto "
        title="Delete department"
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        footer={[
          <Button
            className=" text-white bg-red-600 hover:bg-gray-100 focus:ring-4
             focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium  hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
            key="back"
            onClick={handleDeleteCancel}
          >
            Cancel
          </Button>,
          <Button
            className="text-white bg-green-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 
font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            key="submit"
            type="primary"
            loading={deleteLoading}
            onClick={() => ConfirmDelete(selectedDepartment!)}
          >
            Ok
          </Button>,
        ]}
      >
        <h1 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          <QuestionCircleOutlined style={{ fontSize: '60px', color: 'red' }} /> Are You Sure to
          Delete Department name=<span style={{ color: 'red' }}> {selectedDepartment?.name} </span>{' '}
        </h1>
      </Modal>

      <Card className="mt-6 text-center" title="List of Departments">
        <div className="text-left">
          <Button
            type="primary"
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold rounded-full flex items-center"
            onClick={onNewDepartment}
            icon={<PlusCircleFilled />}
          >
            New department
          </Button>
        </div>
        <Spin tip="Loading..." size="large" spinning={fetchDataLoading} style={{ color: 'red' }}>
          <div>
            <Table
              className="mt-12"
              style={{ overflow: 'auto' }}
              columns={columns}
              dataSource={data}
              rowKey={(record: Department) => record.id}
            />
          </div>
        </Spin>
      </Card>
      {formType != null && (
        <DepartmentModal
          formType={formType}
          visibility={isCreate_UpdateModalVisible}
          visibilityToggler={() => {
            showDepartmentFormModal()
            setFormType(null)
          }}
          selectedDepartment={selectedDepartment}
        />
      )}

      {isDepartment_Under_ManagementModalVisble && (
        <DepartmentUnderManagement
          visibility={isDepartment_Under_ManagementModalVisble}
          selectedDepartment={selectedDepartment}
          visibilityToggler={(visible: boolean) => {
            setisDepartment_Under_ManagementModalVisble(visible)
          }}
        />
      )}
    </>
  )
}
