import React from 'react'
import UpdateUserForm from '../../components/profile/UpdateUserForm'

const EditUserInfo = ({ userId }) => {
    return (
        <div className="EditForm">
            <UpdateUserForm userId={userId} />
        </div>
    );
}

export default EditUserInfo