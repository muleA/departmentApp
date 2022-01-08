import {
  Form,
  Input,
  Button,
  Modal,
  TreeSelect,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import Department from "../model/department";
import { createDepartment } from "../Redux/reducer/department.reducer";
import {  useState } from "react";

export default function AddDepartmentForm(props: {
  modalVisibility: boolean;
  visibilityToggler: (visible: boolean) => void;
}) {
  const departments = useSelector((state: RootState) => state.departments);
  const dispatch = useDispatch();
  const treeData = departments.map((department: Department) => {
    return {
      id: department.id,
      pId: department.parentDepartmentId,
      title: department.name,
      value: department.id,
    };
  });
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(props.modalVisibility);
  
  const onFinish: (value: {
    id?: string;
    name: string;
    description: string;
    parentDepartmentId?: string;
  }) => void = (value) => {

    setSubmitLoading(true);
    const asyncDispatcher = async () => await dispatch(createDepartment(value));
    asyncDispatcher()
      .then(() => {
        form.resetFields();
        notification.success({
          message: `Department created successfully`,
          description:
            "Department " + value.name + "has been registered successfully.",
          placement: "bottomRight",
        });
        setSubmitLoading(false);
      })
      .catch((err) => {
        notification.error({
          message: `Failed to register department`,
          description: err + ".",
          placement: "bottomRight",
        });
        setSubmitLoading(false);
      });
  };

  
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    props.visibilityToggler(false);
  };
  const handleCancel = () => {
    props.visibilityToggler(false);
  };
  return (
    <Modal
      title={"Register new department"}
      width={720}
      onCancel={handleCancel}
      onOk={handleOk}
      visible={props.modalVisibility}
      bodyStyle={{ paddingBottom: 80 }}
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
          
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Submit
            </Button>
          
        </Form.Item>
      </Form>
    </Modal>
  );
}
