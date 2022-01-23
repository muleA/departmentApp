
import { Form, Input, Button, Modal, TreeSelect, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import Department from '../../../model/department'
import { createDepartment, updateDepartment } from '../State/reducer/department.reducer'
import { useEffect, useState } from 'react'

export default function DepartmentModal(props: {
  formType: 'new' | 'update'
  visibility: boolean
  visibilityToggler: (visible:boolean) => void
  selectedDepartment?: Department
}) {
  const departments = useSelector((state: RootState) => state.departments)
  const dispatch = useDispatch() 
   const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const treeData = departments.map((department: Department) => {
    return {
      id: department.id,
      pId: department.parentDepartmentId,
      title: department.name,
      value: department.id,
    }
  })

  //All event handlers goes below

  const handleOk = () => {
    props.visibilityToggler(false);
  }
  const handleCancel = () => {
    props.visibilityToggler(false)
  }
  const onFinish: (value: Department) => void = (value) => {
    if (props.formType === 'new') {
      setSubmitLoading(true)
      const asyncDispatcher = async () => await dispatch(createDepartment(value))
      asyncDispatcher()
        .then(() => {
          form.resetFields()
          notification.success({
            message: `Department created successfully`,
            description: 'Department ' + value.name + 'has been registered successfully.',
            placement: 'bottomRight',
          })
          setSubmitLoading(false)
        })
        .catch((err) => {
          notification.error({
            message: `Failed to register department`,
            description: err + '.',
            placement: 'bottomRight',
          })
          setSubmitLoading(false)
        })
    } else if (props.formType === 'update') {
      setSubmitLoading(true)
      const asyncDispatcher = async () => await dispatch(updateDepartment(value as Department))
      asyncDispatcher()
        .then(() => {
          notification.success({
            message: `Department info updated successfully`,
            description: 'Department ' + value.name + ' info has been updated successfully.',
            placement: 'bottomRight',
          })
          setSubmitLoading(false)
        })
        .catch((err) => {
          notification.error({
            message: `Failed to update department info`,
            description: err + '.',
            placement: 'bottomRight',
          })
          setSubmitLoading(false)
        })
    }
  }

  //end of event handlers

  useEffect(() => {
    if (props.formType === 'update' && props.selectedDepartment != null) {
      form.setFieldsValue({
        id: props.selectedDepartment.id,
        name: props.selectedDepartment.name,
        description: props.selectedDepartment.description,
        parentDepartmentId: props.selectedDepartment.parentDepartmentId,
      })
    }
  }, [form, props.formType, props.selectedDepartment])

  return (
    <Modal
      title={props.formType === 'new' ? 'Register new department' : 'Update Department '}
      width={720}
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
      onCancel={() => {
        props.visibilityToggler(false)
        form.resetFields()
      }}
      visible={props.visibility}
    >
      <Form
        onFinish={onFinish}
        form={form}
        autoComplete="off"
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ offset: 1 }}
      >
        {props.formType === 'update' && (
          <Form.Item
            hidden
            name="id"
            rules={[
              { required: true, message: 'Id is required.' },
              { whitespace: true, message: 'Department name can not be empty.' },
            ]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item
          label="Department name"
          name="name"
          rules={[
            { required: true, message: 'Department name is required.' },
            { whitespace: true, message: 'Department name can not be empty.' },
          ]}
          hasFeedback
        >
          <Input placeholder="Please enter department name" />
        </Form.Item>

        <Form.Item
          label="Department description"
          name="description"
          rules={[
            { required: true, message: 'Department description is required.' },
            { whitespace: true, message: 'Department description can not be empty.' },
          ]}
          hasFeedback
        >
          <Input.TextArea placeholder="Please enter department description" rows={4} />
        </Form.Item>

        <Form.Item name="parentDepartmentId" label="Managing department">
          <TreeSelect
            treeData={treeData}
            treeDataSimpleMode
            placeholder="Select managing department"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10 }}>
          {props.formType === 'new' && (
            <Button type="primary" className='text-white bg-blue-600 hover:bg-blue-800  
            font-medium rounded-lg text-sm ' htmlType="submit" loading={submitLoading}>
              Submit
            </Button>
          )}

          {props.formType === 'update' && (
            <>
              <Button className="mr-10 text-white bg-blue-700 hover:bg-blue-600  
  font-medium rounded-lg text-sm " type="primary" 
              htmlType="submit" loading={submitLoading}>
                Update
              </Button>
            </>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}
