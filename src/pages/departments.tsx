
import { Form,Button, notification, Spin, Table, Space} from "antd";
import { PlusCircleFilled,DeleteFilled,EditFilled,EyeFilled } from '@ant-design/icons';
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from '../store';
import Department from "../model/department";
import { getDepartment } from "../Redux/reducer/department.reducer";
import { useEffect,useState } from "react";
import AddDepartmentForm  from "../component/add_department";
import DeleteDepartment from "../component/delete_department";
import UpdateDepartmentForm from "../component/Update_department";
import DepartmentDetails from "../component/department_Details";

export default function Departments(){

  const departments: Department[] = useSelector((state:RootState)=>state.departments);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const data:Department[] = departments;
  const [selectedDepartment,setSelectedDepartment] = useState<Department | undefined>(undefined);
  const [loadingData,setLoadingData] = useState<boolean>(true);
  const [isModalVisible,setIsModalVisible]=useState<boolean>(false);
  const [isDeleteModalVisible,setIsdeleteModalVisible]=useState<boolean>(false);
  const [deleteItem,setDeleteItem]=useState<Department| null>(null);

  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [isUpdateModalVisible,setIsUpdateModalVisible]=useState<boolean>(false);
  const [ItemTobeUpdated,setItemTobeUpdated]=useState<Department| null>(null);

  const [isDetailsModalVisible,setIsDetailsModalVisible]=useState<boolean>(false);
  const [ItemTobeViewed,setItemTobeViewed]=useState<Department| null>(null);

  //all event handler goes below
/* delete button */


const onDeleteDepartment = (id:string) =>{
  const department = data.find((item)=>item.id===id);
 setDeleteItem(department!);
 setIsdeleteModalVisible(true);
 
}
const onUpdateDepartment = (id:string) =>{
 setUpdateLoading(true);
 setIsUpdateModalVisible(true);
 const department = data.find((item)=>item.id===id);
 setItemTobeUpdated(department!);
 console.log(department);
}

const onDetailsDepartment = (id:string) =>{  
 
  const department=data.find((item)=>item.id===id) 
  setIsDetailsModalVisible(true);
  setItemTobeViewed(department!);
  console.log("clilceed");


 }
 



/*  */
  const onNewDepartment = ()=>{
    setIsModalVisible(true);
  }


  // end of event handlers 


  useEffect(()=>{
    const asyncDispatcher = async ()=>{
      return await dispatch(getDepartment);
    }
    asyncDispatcher().then(()=>setLoadingData(false)).catch((err)=>{
                                                                      notification.error({
                                                                        message: `Failed to retrieve departments`,
                                                                        description: err+'.',
                                                                        placement:"bottomRight"
                                                                      });
                                                                      setLoadingData(false)
                                                                  }); 
    
  },[]);
  
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
                      render: (parentDepartmentId:string) => {
                        const parent: Department | undefined = data.find((item:Department)=>{return item.id===parentDepartmentId});
                        return (
                          <>
                            {(parent?parent.name:"None")}
                          </>
                        );
                      },
                    },
                
                    
                    {
                      title: 'Action',
                      key: 'action',
                      render: (text:any, record:any) => (
                        <Space size="middle" className="mx-auto">
                          <Button type="primary" onClick={()=>{onDetailsDepartment(record.id);}} icon={<EyeFilled/>}>View</Button> 
                         <Button type="primary" onClick={()=>{onUpdateDepartment(record.id);}} icon={<EditFilled/>}>Update</Button> 
                          <Button 
                          type="primary" onClick={()=>onDeleteDepartment(record.id)} danger icon={<DeleteFilled/>}>Delete</Button>
                        </Space>
                      ),
                    }
                ]; 

    return (
      <>
        <div className="mt-6">
          <Button type="primary" onClick={onNewDepartment} icon={<PlusCircleFilled/>}>New department</Button>
        </div>
        <Spin tip="Loading..." spinning={loadingData}>
          <Table className="mt-12" columns={columns} dataSource={data} />
        </Spin>
        
      {isModalVisible && <AddDepartmentForm modalVisibility={isModalVisible} visibilityToggler={(visible:boolean)=>{setIsModalVisible(visible)}}/>}        
      {isDeleteModalVisible && <DeleteDepartment selectedDepartment={deleteItem!} modalVisibility={isDeleteModalVisible} 
      visibilityToggler={(visible:boolean)=>{setIsdeleteModalVisible(visible)}}/>}   
       {isUpdateModalVisible && <UpdateDepartmentForm selectedDepartment={ItemTobeUpdated!} 
       visibility={isUpdateModalVisible}  
       visibilityToggler={(visible:boolean)=>{setIsUpdateModalVisible(visible)}} />}   
    
       {isDetailsModalVisible && <DepartmentDetails selectedDepartment={ItemTobeViewed!}
        visibility={isDetailsModalVisible}  
       visibilityToggler={(visible:boolean)=>{setIsDetailsModalVisible(visible)}} />}   
      
             
      </>
    );
}


