import React, { useState } from 'react';
import { Button, Popconfirm, Modal, Checkbox, message, Flex } from 'antd';
import { deleteJobById, IJobType } from '../service';

const Action: React.FunctionComponent<IJobType & { onChange(): void }> = props => {
  //@ts-ignore
  const { status, job_id, onChange } = props;

  // 使用对象管理状态
  const [state, updateState] = useState({
    isModalOpen: false, // 控制 Modal 显示状态
    checkboxValue: false, // 控制 Checkbox 的选中状态
  });
  const { isModalOpen, checkboxValue } = state;

  /**
   * 控制 Modal 的显示或隐藏
   * @param value - 是否显示 Modal
   */
  const handleModal = (value: boolean) => {
    updateState(prevState => ({
      ...prevState,
      isModalOpen: value,
    }));
  };

  /**
   * 删除 Job 的操作
   */
  const deleteJob = async () => {
    try {
      const res = await deleteJobById(job_id);
      //@ts-ignore
      message.success(res); // 显示成功提示
      onChange(); // 通知父组件状态更新
      updateState(prevState => ({
        ...prevState,
        isModalOpen: false, // 关闭 Modal
      }));
    } catch (error) {
      message.error('删除失败，请重试'); // 错误处理
    }
  };

  /**
   * 根据 Job 状态生成对应的操作按钮
   */
  let Content;
  if (status === 'CANCELLED' || status === 'SUCCESS' || status === 'FAILED') {
    Content = (
      <Button size="small" disabled>
        删除
      </Button>
    );
  } else if (status === 'RUNNING') {
    Content = (
      <Popconfirm
        placement="bottomRight"
        title="确定删除？"
        onConfirm={deleteJob}
        okText="Yes"
        cancelText="No"
        icon={null}
      >
        <Button size="small" danger>
          删除
        </Button>
      </Popconfirm>
    );
  } else if (status === 'WAITING') {
    Content = (
      <Button size="small" danger onClick={() => handleModal(true)}>
        删除
      </Button>
    );
  }

  return (
    <div key={job_id}>
      {Content}
      <Modal
        title="Delete Job"
        open={isModalOpen}
        onOk={deleteJob}
        onCancel={() => handleModal(false)}
        cancelText="Cancel"
        okText="Ok"
      >
        <Flex vertical>
          <Checkbox
            checked={checkboxValue}
            onChange={e =>
              updateState(prevState => ({
                ...prevState,
                checkboxValue: e.target.checked,
              }))
            }
          >
            Only this job
          </Checkbox>
          <Checkbox
            checked={!checkboxValue}
            onChange={e =>
              updateState(prevState => ({
                ...prevState,
                checkboxValue: !e.target.checked,
              }))
            }
          >
            This job and follow-up jobs
          </Checkbox>
        </Flex>
      </Modal>
    </div>
  );
};

export default Action;
