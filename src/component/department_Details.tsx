import { Button, Form, Input, Modal, notification, TreeSelect } from 'antd';
import react, { useEffect, useState } from 'react'
import reactDOM from 'react-dom'
import { useDispatch, useSelector } from 'react-redux';
import Department from '../model/department'
import {  updateDepartment } from '../Redux/reducer/department.reducer';
import { RootState } from '../store';


export default function DepartmentDetails(props:{visibility:boolean;
visibilityToggler:(visible:boolean)=>void; selectedDepartment?:Department})
{
    const departments = useSelector((state: RootState) => state.departments);
    const dispatch = useDispatch();
    const[isDetailsModalVisible,setIsDetailsModalVisible]=useState<boolean>(false);
    const [ItemTobeViewed,setItemTobeViewed]=useState<Department| null>(null);

    /* event handler */
    const showModal = () => {
      setIsDetailsModalVisible(true);
      console.log(setIsDetailsModalVisible);
      props.visibilityToggler(true);
    
    };
    const handleOk = () => {
      props.visibilityToggler(false);
    };
    const handleCancel = () => {
      props.visibilityToggler(false);
    };
    /* event handler finished */
  
    const getDescendents:(ancestorId:string)=>Department[] = (ancestorId)=>{

        let descendents = departments.filter((item)=>{

            let parent:Department | undefined = departments.find((department:Department)=>
            {return department.id===item.parentDepartmentId});
        
            while(parent!=null){
                if(parent.id === ancestorId){
                    return true;
                }
                parent = departments.find((department:Department)=>{return department.id===parent!.parentDepartmentId})
            }                 
            return false;
        });

        return descendents;
        console.log(descendents)
    }

    const managedDepartments: Department[] | undefined=getDescendents(props.selectedDepartment!.id);
    const managedDepartmentsTreeData = (managedDepartments)?managedDepartments.map((department:Department)=>
    { return {id:department.id,pId:department.parentDepartmentId,title:department.name,value:department.id,
        selectable:false}}):[];  
      return (
        <Modal
          title={"Department Under its  Department"}
          width={720}
          onCancel={handleCancel}
          onOk={handleOk}
          visible={props.visibility}
          bodyStyle={{ paddingBottom: 80 }}
        >
            <>
                <b>Departments under your management: </b> 
                {(managedDepartmentsTreeData.length==0)? " None":
                    <TreeSelect
                        className="w-1/2"
                        treeData={managedDepartmentsTreeData}
                        placeholder="Click to view departments"
                        treeDataSimpleMode
                        
                    />
                }
                
            </>    
        </Modal>
      );
    }