import React, { useState } from 'react';
import { Button, Popconfirm, Modal, Checkbox, message, Flex } from 'antd';
import { deleteJobById, IJobType } from './service';

const Action: React.FunctionComponent<IJobType & { onChange(): void }> = props => {
  const { status, job_id, onChange } = props;
  const [state, updateState] = useState({
    isModalOpen: false,
    checkboxValue: false,
  });
  const { isModalOpen, checkboxValue } = state;
  /** 操作modal */
  const handleModal = (value: boolean) => {
    updateState(preset => {
      return {
        ...preset,
        isModalOpen: value,
      };
    });
  };
  /** 删除job */
  const deleteJob = async () => {
    const res = await deleteJobById(job_id);
    message.success(res);
    onChange();
    updateState(preset => {
      return {
        ...preset,
        isModalOpen: false,
      };
    });
  };
  /** CANCELLED | SUCCESS | FAILED 不可删除，RUNNING ｜ WAITING 可以删除*/
  let Content;
  if (status === 'CANCELLED' || status === 'SUCCESS' || status === 'FAILED') {
    Content = (
      <Button size="small" disabled>
        删除
      </Button>
    );
  }
  if (status === 'RUNNING') {
    Content = (
      <Popconfirm
        placement="bottomRight"
        title="确定删除？"
        onConfirm={() => deleteJob()}
        okText="Yes"
        cancelText="No"
        icon
      >
        <Button size="small" danger>
          {' '}
          删除
        </Button>
      </Popconfirm>
    );
  }
  if (status === 'WAITING') {
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
          <Checkbox checked={checkboxValue} onChange={() => handleModal(true)}>
            Only this job
          </Checkbox>
          <Checkbox checked={!checkboxValue} onChange={() => handleModal(false)}>
            This job and follow-up jobs
          </Checkbox>
        </Flex>
      </Modal>
    </div>
  );
};
export default Action;
