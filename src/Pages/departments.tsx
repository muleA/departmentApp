import { Button, notification, Spin, Table, Space, Card } from 'antd'
import { PlusCircleFilled, DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import Department from '../model/department'
import { getDepartment } from '../Redux/reducer/department.reducer'
import { useEffect, useState } from 'react'
import AddDepartmentForm from '../Components/add_department' //components to create new department
import DeleteDepartment from '../Components/delete_department' //components to delete departments and there descendents
import UpdateDepartmentForm from '../Components/Update_department' //components to update department
import DepartmentDetails from '../Components/department_Under_your_management' //display lists of departments under the that department
import { RootState } from '../store'

export default function Departments() {
  const departments: Department[] = useSelector((state: RootState) => state.departments)
  const dispatch = useDispatch()
  const data: Department[] = departments
  const [loadingData, setLoadingData] = useState<boolean>(true)
  const [isCreateNewModalVisible, setIsCreateNewModalVisible] = useState<boolean>(false)

  const [isDeleteModalVisible, setIsdeleteModalVisible] = useState<boolean>(false)
  const [deleteItem, setDeleteItem] = useState<Department | null>(null)

  const [updateLoading, setUpdateLoading] = useState<boolean>(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false)
  const [ItemTobeUpdated, setItemTobeUpdated] = useState<Department | null>(null)

  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState<boolean>(false)
  const [ItemTobeViewed, setItemTobeViewed] = useState<Department | null>(null)

  /* event handlers */
  const onDeleteDepartment = (id: string) => {
    const department = data.find((item) => item.id === id)
    setDeleteItem(department!)
    setIsdeleteModalVisible(true)
  }
  const onUpdateDepartment = (id: string) => {
    setUpdateLoading(!updateLoading)
    setIsUpdateModalVisible(true)
    const department = data.find((item) => item.id === id)
    setItemTobeUpdated(department!)
  }

  const onDetailsDepartment = (id: string) => {
    const department = data.find((item) => item.id === id)
    setIsDetailsModalVisible(true)
    setItemTobeViewed(department!)
  }

  /*  */
  const onNewDepartment = () => {
    setIsCreateNewModalVisible(true)
  }
  // end of event handlers

  /* retrieve data from the api source using useEffect hooks */
  useEffect(() => {
    const asyncDispatcher = async () => {
      return await dispatch(getDepartment)
    }
    asyncDispatcher()
      .then(() => setLoadingData(false))
      .catch((err) => {
        notification.error({
          message: `Failed to retrieve departments`,
          description: err + '.',
          placement: 'bottomRight',
        })
        setLoadingData(false)
      })
  })

  /* //// */

  const columns = [
    {
      title: 'Department id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Department name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Department description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Managing department',
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
            type="primary"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded-full"
            onClick={() => {
              onDetailsDepartment(record.id)
            }}
            icon={<EyeFilled />}
          >
            View
          </Button>
          <Button
            type="primary"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded-full"
            onClick={() => {
              onUpdateDepartment(record.id)
            }}
            icon={<EditFilled />}
          >
            Update
          </Button>
          <Button
            type="primary"
            className="text-white font-bold px-4 rounded-full"
            onClick={() => onDeleteDepartment(record.id)}
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
      <Card className="mt-6 text-center" title="list of Departments">
        <div className="text-left">
          <Button
            type="primary"
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold rounded-full"
            onClick={onNewDepartment}
            icon={<PlusCircleFilled />}
          >
            New department
          </Button>
        </div>
        <Spin tip="Loading..." size="large" spinning={loadingData} style={{ color: 'green' }}>
          <div>
            <Table
              className="mt-12"
              style={{ overflow: 'auto' }}
              columns={columns}
              dataSource={data}
            />
          </div>
        </Spin>
      </Card>

      {isCreateNewModalVisible && (
        <AddDepartmentForm
          modalVisibility={isCreateNewModalVisible}
          visibilityToggler={(visible: boolean) => {
            setIsCreateNewModalVisible(visible)
          }}
        />
      )}

      {isDeleteModalVisible && (
        <DeleteDepartment
          selectedDepartment={deleteItem!}
          modalVisibility={isDeleteModalVisible}
          visibilityToggler={(visible: boolean) => {
            setIsdeleteModalVisible(visible)
          }}
        />
      )}

      {isUpdateModalVisible && (
        <UpdateDepartmentForm
          selectedDepartment={ItemTobeUpdated!}
          visibility={isUpdateModalVisible}
          visibilityToggler={(visible: boolean) => {
            setIsUpdateModalVisible(visible)
          }}
        />
      )}

      {isDetailsModalVisible && (
        <DepartmentDetails
          selectedDepartment={ItemTobeViewed!}
          visibility={isDetailsModalVisible}
          visibilityToggler={(visible: boolean) => {
            setIsDetailsModalVisible(visible)
          }}
        />
      )}
    </>
  )
}
