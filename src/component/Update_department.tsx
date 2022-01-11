import { Button, Form, Input, Modal, notification, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Department from "../model/department";
import { updateDepartment } from "../Redux/reducer/department.reducer";
import { RootState } from "../store";
import { EditFilled } from '@ant-design/icons';

export default function UpdateDepartmentForm(props: {
  visibility: boolean;
  visibilityToggler: (visible: boolean) => void;
  selectedDepartment: Department;
}) {
  const departments = useSelector((state: RootState) => state.departments);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  /* event handler */
  
  const handleOk = () => {
    props.visibilityToggler(false);
  };
  const handleCancel = () => {
    props.visibilityToggler(false);
  };
  /* event handler finished */
  const treeData = departments.map((department: Department) => {
    return {
      id: department.id,
      pId: department.parentDepartmentId,
      title: department.name,
      value: department.id,
    };
  });
  useEffect(() => {
    if (props.selectedDepartment != null) {
      form.setFieldsValue({
        name: props.selectedDepartment.name,
        description: props.selectedDepartment.description,
        parentDepartmentId: props.selectedDepartment.parentDepartmentId,
      });
    }
  },);

  const onFinish: (value: {
    name: string;
    description: string;
    parentDepartmentId?: string;
  }) => void = (value) => {
    setSubmitLoading(true);
    const asyncDispatcher = async () =>
      await dispatch(
        updateDepartment({
          id: props.selectedDepartment.id,
          ...value,
        } as Department)
      );
    asyncDispatcher()
      .then(() => {
        notification.success({
          message: `Department info updated successfully`,
          description:
            "Department " + value.name + " info has been updated successfully.",
          placement: "bottomRight",
        });
        setSubmitLoading(false);
      })
      .catch((err) => {
        notification.error({
          message: `Failed to update department info`,
          description: err + ".",
          placement: "bottomRight",
        });
        setSubmitLoading(false);
      });
  };

  return (
    <Modal
      title={"Update Department"}
      width={720}
      onCancel={handleCancel}
      onOk={handleOk}
      visible={props.visibility}
      bodyStyle={{ paddingBottom: 20 }}
    >
      <Form
        onFinish={onFinish}
        form={form}
        autoComplete="off"
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ offset: 1 }}
      >
        <Form.Item
          label="Department name"
          name="name"
          rules={[
            { required: true, message: "Department name is required." },
            { whitespace: true, message: "Department name can not be empty." },
          ]}
          hasFeedback
        >
          <Input placeholder="Please enter department name" />
        </Form.Item>

        <Form.Item
          label="Department description"
          name="description"
          rules={[
            { required: true, message: "Department description is required." },
            {
              whitespace: true,
              message: "Department description can not be empty.",
            },
          ]}
          hasFeedback
        >
          <Input.TextArea
            placeholder="Please enter department description"
            rows={4}
          />
        </Form.Item>

        <Form.Item name="parentDepartmentId" label="Managing department">
          <TreeSelect
            treeData={treeData}
            treeDataSimpleMode
            placeholder="Select managing department"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10 }}>
          <Button type="primary" htmlType="submit" loading={submitLoading}    icon={<EditFilled/>}>
         Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
