import React, { useContext, useMemo, useState } from "react";
import { Form, Modal, Select, Spin, Avatar } from "antd";
import { AppContext } from "../../Context/AppProvider";
import { debounce } from "lodash";
import { db } from "../../firebase/config";

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 300,
  curMembers,
  ...props
}) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value,curMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions,curMembers]);

  React.useEffect(() => {
    return () => {
      // clear when unmount
      setOptions([]);
    };
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.photoURL}>
            {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {`${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

async function fetchUserList(search, curMembers) {
  return db
    .collection('users')
    .where('keywords', 'array-contains', search)
    .orderBy('displayName')
    .limit(20)
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
        }))
        .filter((opt) => !curMembers.includes(opt.value));
    });
}


export default function InviteMemberModal() {
  const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId,selectedRoom } =
    useContext(AppContext);

  const [value, setValue] = useState([]);
  const [form] = Form.useForm();
  const handleOk = () => {
    // reset form value
    form.resetFields();
    //update members in current room
    const roomRef = db.collection('rooms').doc(selectedRoomId)

    roomRef.update({
        members: [...selectedRoom.members,...value.map((val)=>val.value)]
    })

    setIsInviteMemberVisible(false);
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsInviteMemberVisible(false);
  };

  console.log({value});

  return (
    <div>
      <Modal
        title="M???i th??m th??nh vi??n"
        open={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            label="T??n c??c th??nh vi??n"
            value={value}
            placeholder="Nh???p t??n th??nh vi??n"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            curMembers={selectedRoom.members}
          />
        </Form>
      </Modal>
    </div>
  );
}
